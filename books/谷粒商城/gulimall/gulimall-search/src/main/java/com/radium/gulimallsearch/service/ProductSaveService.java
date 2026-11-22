package com.radium.gulimallsearch.service;

import com.radium.gulimall.common.es.SkuEsModel;

import java.util.List;

/**
 * 商品上架数据写入 ES
 */
public interface ProductSaveService {

    /**
     * 批量写入上架文档，_id 用 skuId，重复上架覆盖同一篇文档。
     *
     * @return 全部写入成功返回 true；有任何一条失败返回 false（失败的明细在日志里）
     */
    boolean saveBatch(List<SkuEsModel> products);
}
