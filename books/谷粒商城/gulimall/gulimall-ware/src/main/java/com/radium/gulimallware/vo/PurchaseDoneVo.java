package com.radium.gulimallware.vo;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class PurchaseDoneVo {

    @NotNull(message = "采购单id不能为空")
    private Long id;

    @Valid
    @NotEmpty(message = "采购需求不能为空")
    private List<Item> items;

    @Data
    public static class Item {

        @NotNull(message = "采购需求id不能为空")
        private Long itemId;

        /** 3=采购成功（入库） 4=采购失败 */
        @NotNull(message = "采购结果不能为空")
        private Integer status;
    }
}
