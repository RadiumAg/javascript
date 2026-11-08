package com.radium.gulimallproduct.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimallproduct.entity.AttrAttrgroupRelationEntity;
import com.radium.gulimallproduct.entity.AttrEntity;
import com.radium.gulimallproduct.entity.AttrGroupEntity;
import com.radium.gulimallproduct.vo.AttrGroupRelationVo;

import java.util.List;
import java.util.Map;

/**
 * 属性分组
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-21 20:33:18
 */
public interface AttrGroupService extends IService<AttrGroupEntity> {

    PageUtils queryPage(Map<String, Object> params);

    /** 组内已关联的基本属性 */
    List<AttrEntity> relationAttrs(Long attrGroupId);

    /** 该分类下还没进任何分组的基本属性，供"关联属性"弹窗挑选 */
    List<AttrEntity> noRelationAttrs(Long catelogId);

    void saveRelations(List<AttrAttrgroupRelationEntity> relations);

    /** 入参只需 attrId + attrGroupId，按这对组合删除关联 */
    void deleteRelations(List<AttrAttrgroupRelationEntity> relations);

    /** 删分组同时清掉组内关联，否则残留关联会把这些属性挡在"未分组"列表外 */
    void removeAttrGroupByIds(List<Long> attrGroupIds);

    /** 该分类下所有分组 + 组内属性，商详页规格参数块的数据形状 */
    List<AttrGroupRelationVo> getAttrGroupWithAttrs(Long catelogId);
}