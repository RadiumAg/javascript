package com.radium.gulimallware.to;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.math.BigDecimal;

/** gulimall-product 的 sku 信息，入库时用来补冗余的 skuName、采购需求用来算金额 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SkuInfoTo {

    private Long skuId;
    private String skuName;
    private BigDecimal price;
}
