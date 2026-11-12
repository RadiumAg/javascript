package com.radium.gulimallware.vo;

import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
public class MergeVo {

    /** 为空表示新建采购单后再合并 */
    private Long purchaseId;

    @NotEmpty(message = "采购需求不能为空")
    private List<Long> items;
}
