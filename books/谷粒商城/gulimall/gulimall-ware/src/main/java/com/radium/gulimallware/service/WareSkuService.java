package com.radium.gulimallware.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimallware.entity.WareSkuEntity;
import com.radium.gulimallware.to.SkuInfoTo;

import java.util.Map;

/**
 * 商品库存
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-25 19:42:07
 */
public interface WareSkuService extends IService<WareSkuEntity> {

    PageUtils queryPage(Map<String, Object> params);

    /** 采购入库：该仓库已有此 sku 就累加库存，否则新建库存记录 */
    void addStock(Long skuId, Long wareId, Integer num);

    /** 远程查商品 sku，查不到或商品服务不可用时返回 null */
    SkuInfoTo getSkuInfo(Long skuId);
}
