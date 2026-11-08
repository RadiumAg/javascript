package com.radium.gulimallproduct.vo;

import com.radium.gulimallproduct.entity.AttrEntity;
import lombok.Data;

import java.util.List;

/**
 * 分组 + 组内属性，商详页规格参数块的数据形状。
 */
@Data
public class AttrGroupRelationVo {

    private Long attrGroupId;

    private String attrGroupName;

    private List<AttrEntity> attrs;
}
