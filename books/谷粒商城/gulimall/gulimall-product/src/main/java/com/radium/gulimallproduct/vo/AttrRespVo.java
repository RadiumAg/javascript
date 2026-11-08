package com.radium.gulimallproduct.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 属性详情回显体：在提交体基础上补分类名、分组名和分类父链，
 * 前端编辑弹窗回显级联分类和所属分组用。
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AttrRespVo extends AttrVo {

    private String catelogName;

    private String groupName;

    /** 所属分类的父级 id 链（顶层在前，不含自己） */
    private Long[] catelogParentIds;
}
