package com.radium.gulimallsearch.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import com.radium.gulimall.common.es.SkuEsModel;
import com.radium.gulimallsearch.service.ProductSaveService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
public class ProductSaveServiceImpl implements ProductSaveService {

    /**
     * 独立于 SearchService 的 gulimall_product：那个索引是 ProductDoc（name/brand/price）的教学演示结构，
     * 和 SkuEsModel（skuTitle/brandName/attrs…）字段完全不同，混写会让 mapping 两边都不对。
     */
    public static final String INDEX = "gulimall_sku";

    private final ElasticsearchClient client;

    private volatile boolean mappingReady = false;

    public ProductSaveServiceImpl(ElasticsearchClient client) {
        this.client = client;
    }

    @Override
    public boolean saveBatch(List<SkuEsModel> products) {
        if (products == null || products.isEmpty()) {
            return true;
        }
        try {
            ensureIndex();

            BulkRequest.Builder builder = new BulkRequest.Builder();
            for (SkuEsModel product : products) {
                builder.operations(op -> op.index(idx -> idx.index(INDEX).id(String.valueOf(product.getSkuId())).document(product)));
            }

            BulkResponse resp = client.bulk(builder.build());
            if (resp.errors()) {
                resp.items().stream().filter(item -> item.error() != null).limit(5).forEach(item -> log.error("上架文档 skuId={} 写入失败：{}", item.id(), item.error().reason()));
                long failed = resp.items().stream().filter(item -> item.error() != null).count();
                log.error("批量上架 ES 写入失败 {} 条，共 {} 条", failed, products.size());
                return false;
            }
            log.info("批量上架 ES 写入成功 {} 条 -> {}", products.size(), INDEX);
            return true;
        } catch (IOException e) {
            log.error("批量上架 ES 写入异常，共 {} 条：{}", products.size(), e.getMessage());
            return false;
        }
    }

    /**
     * 首次上架自动建索引。attrs 必须是 nested：普通 object 数组里
     * "颜色=红" 和 "尺码=XL" 会被交叉匹配到同一条属性上，筛选结果就错了。
     */
    private void ensureIndex() throws IOException {
        if (mappingReady) {
            return;
        }
        if (client.indices().exists(e -> e.index(INDEX)).value()) {
            mappingReady = true;
            return;
        }
        client.indices().create(c -> c.index(INDEX).mappings(m -> m.properties("skuId", p -> p.long_(l -> l)).properties("spuId", p -> p.long_(l -> l)).properties("skuTitle", p -> p.text(t -> t.analyzer("ik_max_word").searchAnalyzer("ik_smart").fields("keyword", f -> f.keyword(k -> k.ignoreAbove(256))))).properties("skuPrice", p -> p.scaledFloat(s -> s.scalingFactor(100.0))).properties("skuImg", p -> p.keyword(k -> k.index(false))).properties("saleCount", p -> p.long_(l -> l)).properties("hasStock", p -> p.boolean_(b -> b)).properties("hotScore", p -> p.long_(l -> l)).properties("brandId", p -> p.long_(l -> l)).properties("brandName", p -> p.text(t -> t.analyzer("ik_max_word").searchAnalyzer("ik_smart").fields("keyword", f -> f.keyword(k -> k.ignoreAbove(256))))).properties("brandImg", p -> p.keyword(k -> k.index(false))).properties("catalogId", p -> p.long_(l -> l)).properties("catalogName", p -> p.text(t -> t.analyzer("ik_max_word").searchAnalyzer("ik_smart"))).properties("attrs", p -> p.nested(n -> n.properties("attrId", q -> q.long_(l -> l)).properties("attrName", q -> q.keyword(k -> k)).properties("attrValue", q -> q.keyword(k -> k))))));
        mappingReady = true;
        log.info("索引 {} 已创建：attrs 为 nested，文本走 ik 分词", INDEX);
    }

    @Override
    public void productStatusUp(List<SkuEsModel> skuEsModels) throws IOException {
        if (skuEsModels == null || skuEsModels.isEmpty()) {
            return;
        }
        ensureIndex();
        // 逐条 model 建一条 index 操作，_id 用 skuId 让重复上架覆盖同一篇文档
        BulkRequest.Builder bulkRequest = new BulkRequest.Builder();
        for (SkuEsModel model : skuEsModels) {
            bulkRequest.operations(op -> op.index(idx -> idx.index(INDEX).id(model.getSkuId().toString()).document(model)));
        }
        BulkResponse response = client.bulk(bulkRequest.build());
        if (response.errors()) {
            response.items().stream().filter(item -> item.error() != null).limit(5).forEach(item -> log.error("上架文档 skuId={} 写入失败：{}", item.id(), item.error().reason()));
            long failed = response.items().stream().filter(item -> item.error() != null).count();
            throw new IOException("商品上架 ES 写入失败 " + failed + " 条，共 " + skuEsModels.size() + " 条");
        }
        log.info("商品上架 ES 写入成功 {} 条 -> {}", skuEsModels.size(), INDEX);
    }

    @Override
    public void productStatusDown(List<Long> skuIds) throws IOException {
        if (skuIds == null || skuIds.isEmpty()) {
            return;
        }
        // 索引都不存在 = 没东西可删，当作成功返回，避免对空索引 bulk delete 报 index_not_found
        if (!client.indices().exists(e -> e.index(INDEX)).value()) {
            log.info("索引 {} 不存在，下架无需删除 ES 文档", INDEX);
            return;
        }
        // _id 就是 skuId，逐条建 delete 操作后统一 bulk
        BulkRequest.Builder bulkRequest = new BulkRequest.Builder();
        for (Long skuId : skuIds) {
            bulkRequest.operations(op -> op.delete(del -> del.index(INDEX).id(String.valueOf(skuId))));
        }
        BulkResponse response = client.bulk(bulkRequest.build());
        if (response.errors()) {
            response.items().stream()
                    .filter(item -> item.error() != null)
                    .limit(5)
                    .forEach(item -> log.error("下架文档 skuId={} 删除失败：{}",
                            item.id(), item.error().reason()));
            long failed = response.items().stream().filter(item -> item.error() != null).count();
            throw new IOException("商品下架 ES 删除失败 " + failed + " 条，共 " + skuIds.size() + " 条");
        }
        log.info("商品下架 ES 删除完成 {} 条 -> {}", skuIds.size(), INDEX);
    }
}
