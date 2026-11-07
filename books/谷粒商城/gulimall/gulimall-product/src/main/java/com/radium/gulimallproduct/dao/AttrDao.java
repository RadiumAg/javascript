package com.radium.gulimallproduct.dao;

import com.radium.gulimallproduct.entity.AttrEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 商品属性
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-21 20:33:18
 */
@Mapper
public interface AttrDao extends BaseMapper<AttrEntity> {

    /** 某个属性分组下已关联的基本属性，按组内排序 */
    List<AttrEntity> selectRelationAttrs(@Param("attrGroupId") Long attrGroupId);

    /** 某分类下尚未关联任何分组的基本属性（销售属性不分组，故排除） */
    List<AttrEntity> selectNoRelationAttrs(@Param("catelogId") Long catelogId);
}