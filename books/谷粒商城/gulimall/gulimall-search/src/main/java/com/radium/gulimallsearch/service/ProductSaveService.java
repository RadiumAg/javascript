package com.radium.gulimallsearch.service;

import com.radium.gulimall.common.es.SkuEsModel;

import java.io.IOException;
import java.util.List;

/**
 * 商品上架数据写入 ES
 */
public interface ProductSaveService {

    /**
     * 商品上架：批量写入 gulimall_sku，_id 用 skuId，重复上架覆盖同一篇文档。
     * 有任何一条写入失败抛 IOException，明细在日志里。
     */
    void productStatusUp(List<SkuEsModel> products) throws IOException;

    /**
     * productStatusUp 的 boolean 适配器：全部成功返回 true，任何失败返回 false（明细在日志里）。
     */
    boolean saveBatch(List<SkuEsModel> products);
}
