package com.radium.gulimallproduct.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * 三级分类跨父移动入参：把 draggedCatId 挂到 newParentCid 下，
 * position 为在新父 children 里的下标（null/越界 = 追加到末尾）。
 */
@Data
public class CategoryMoveDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long draggedCatId;
    private Long newParentCid;
    private Integer position;
}
