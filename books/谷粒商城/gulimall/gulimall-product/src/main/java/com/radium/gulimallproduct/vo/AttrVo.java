package com.radium.gulimallproduct.vo;

import com.radium.gulimallproduct.entity.AttrEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 属性的提交体：比实体多一个所属分组，保存/修改时顺带维护关联。
 * 不提交 attrGroupId 表示不动关联（关联在属性分组页维护）。
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class AttrVo extends AttrEntity {

    private Long attrGroupId;
}
