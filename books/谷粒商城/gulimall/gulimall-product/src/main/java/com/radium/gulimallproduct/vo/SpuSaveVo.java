package com.radium.gulimallproduct.vo;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

/**
 * 发布商品提交体，对应前端 SpuSavePayload，一次事务落 7 张表
 */
@Data
public class SpuSaveVo {

    @NotBlank(message = "商品名称不能为空")
    private String spuName;
    private String spuDescription;
    @NotNull(message = "所属分类不能为空")
    private Long catalogId;
    @NotNull(message = "品牌不能为空")
    private Long brandId;
    private BigDecimal weight;
    private Integer publishStatus;
    private String description;
    private List<String> images;
    private List<Attrs> attrs;
    private List<Skus> skus;

    @Data
    public static class Attrs {
        private Long attrId;
        private String attrName;
        private String value;
        private Integer quickShow;
    }

    @Data
    public static class Skus {
        private String skuName;
        private BigDecimal price;
        private Integer stock;
        private String skuTitle;
        private String skuSubtitle;
        private Integer enable;
        private List<String> images;
        private List<SaleAttrs> saleAttrValues;
    }

    @Data
    public static class SaleAttrs {
        private Long attrId;
        private String attrName;
        private String attrValue;
    }
}