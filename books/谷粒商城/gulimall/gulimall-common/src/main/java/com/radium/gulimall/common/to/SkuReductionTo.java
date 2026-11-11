package com.radium.gulimall.common.to;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class SkuReductionTo {

    private Long skuId;

    private BigDecimal fullPrice;

    private BigDecimal reducePrice;

    private BigDecimal discount;

    private Integer fullCount;

    private Integer priceStatus;

    private Integer countStatus;

    private List<MemberPrice> memberPrice;

}
