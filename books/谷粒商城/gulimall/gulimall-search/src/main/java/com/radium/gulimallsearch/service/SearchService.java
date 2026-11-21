package com.radium.gulimallsearch.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.radium.gulimallsearch.model.ProductDoc;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class SearchService {

    public static final String INDEX = "gulimall_product";

    private final ElasticsearchClient client;

    public SearchService(ElasticsearchClient client) {
        this.client = client;
    }

    public boolean indexExists() throws IOException {
        return client.indices().exists(e -> e.index(INDEX)).value();
    }

    public String dropIndex() throws IOException {
        if (!indexExists()) {
            return INDEX + " 不存在，无需删除";
        }
        client.indices().delete(d -> d.index(INDEX));
        return INDEX + " 已删除";
    }

    public String initIndex() throws IOException {
        if (indexExists()) {
            return INDEX + " 已存在，未改动（要重建先调 delete）";
        }
        client.indices().create(c -> c.index(INDEX).mappings(m -> m
                .properties("name", p -> p.text(t -> t
                        .analyzer("ik_max_word")
                        .searchAnalyzer("ik_smart")
                        .fields("keyword", f -> f.keyword(k -> k.ignoreAbove(256)))))
                .properties("brand", p -> p.text(t -> t
                        .analyzer("ik_max_word")
                        .searchAnalyzer("ik_smart")))
                .properties("category", p -> p.text(t -> t
                        .analyzer("ik_max_word")
                        .searchAnalyzer("ik_smart")))
                .properties("description", p -> p.text(t -> t
                        .analyzer("ik_max_word")
                        .searchAnalyzer("ik_smart")))
                .properties("price", p -> p.long_(l -> l))
                .properties("stock", p -> p.integer(i -> i))
                .properties("rating", p -> p.float_(f -> f))
                .properties("created", p -> p.date(d -> d.format("yyyy-MM-dd")))));
        return INDEX + " 已创建：入库 ik_max_word，检索 ik_smart";
    }

    public String save(ProductDoc doc) throws IOException {
        var resp = client.index(b -> {
            b.index(INDEX);
            if (doc.getId() != null) {
                b.id(String.valueOf(doc.getId()));
            }
            return b.document(doc);
        });
        return resp.result().jsonValue();
    }

    public Map<String, Object> bulkSave(List<ProductDoc> docs) throws IOException {
        BulkRequest.Builder builder = new BulkRequest.Builder();
        for (ProductDoc doc : docs) {
            builder.operations(op -> op.index(idx -> {
                idx.index(INDEX);
                if (doc.getId() != null) {
                    idx.id(String.valueOf(doc.getId()));
                }
                return idx.document(doc);
            }));
        }
        BulkResponse resp = client.bulk(builder.build());
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("requested", docs.size());
        data.put("failed", resp.errors() ? resp.items().stream().filter(i -> i.error() != null).count() : 0);
        return data;
    }

    /**
     * 从已有索引全量搬运，用于把课程里 standard 分词的旧索引灌进 ik 索引。
     * 源文档没有业务 id，直接用 ES 的 _id 作为新文档 id。
     */
    public Map<String, Object> importFrom(String sourceIndex, int size) throws IOException {
        SearchResponse<ProductDoc> resp = client.search(s -> s.index(sourceIndex).size(size), ProductDoc.class);
        List<ProductDoc> docs = new ArrayList<>();
        List<String> ids = new ArrayList<>();
        for (Hit<ProductDoc> hit : resp.hits().hits()) {
            docs.add(hit.source());
            ids.add(hit.id());
        }
        BulkRequest.Builder builder = new BulkRequest.Builder();
        for (int i = 0; i < docs.size(); i++) {
            String id = ids.get(i);
            ProductDoc doc = docs.get(i);
            builder.operations(op -> op.index(idx -> idx.index(INDEX).id(id).document(doc)));
        }
        BulkResponse bulk = client.bulk(builder.build());
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("source", sourceIndex);
        data.put("scanned", docs.size());
        data.put("failed", bulk.errors() ? bulk.items().stream().filter(i -> i.error() != null).count() : 0);
        return data;
    }

    public Map<String, Object> search(String keyword, int page, int limit) throws IOException {
        SearchResponse<ProductDoc> resp = client.search(s -> s
                .index(INDEX)
                .from((page - 1) * limit)
                .size(limit)
                .query(q -> q.multiMatch(m -> m
                        .query(keyword)
                        .fields("name", "brand", "category", "description")))
                .highlight(h -> h
                        .preTags("<em>")
                        .postTags("</em>")
                        .fields("name", f -> f)
                        .fields("description", f -> f)), ProductDoc.class);
        List<Map<String, Object>> list = new ArrayList<>();
        for (Hit<ProductDoc> hit : resp.hits().hits()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", hit.id());
            item.put("doc", hit.source());
            item.put("highlight", hit.highlight());
            list.add(item);
        }
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("keyword", keyword);
        data.put("total", resp.hits().total() == null ? 0 : resp.hits().total().value());
        data.put("page", page);
        data.put("limit", limit);
        data.put("list", list);
        return data;
    }

    public Map<String, Object> analyze(String analyzer, String text) throws IOException {
        var resp = client.indices().analyze(a -> a.analyzer(analyzer).text(text));
        List<String> tokens = new ArrayList<>();
        resp.tokens().forEach(t -> tokens.add(t.token()));
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("analyzer", analyzer);
        data.put("text", text);
        data.put("tokens", tokens);
        return data;
    }
}
