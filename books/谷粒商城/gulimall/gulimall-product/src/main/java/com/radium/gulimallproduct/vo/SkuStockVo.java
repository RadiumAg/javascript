package com.radium.gulimallproduct.vo;

import lombok.Data;

/**
 * 发布商品时同步给 gulimall-ware 的库存记录
 */
@Data
public class SkuStockVo {
    private Long skuId;
    private Long wareId;
    private Integer stock;
    private String skuName;
}