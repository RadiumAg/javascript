package com.radium.gulimallproduct.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimallproduct.entity.AttrEntity;
import com.radium.gulimallproduct.vo.AttrRespVo;
import com.radium.gulimallproduct.vo.AttrVo;

import java.util.List;
import java.util.Map;

/**
 * 商品属性
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-21 20:33:18
 */
public interface AttrService extends IService<AttrEntity> {

    PageUtils queryPage(Map<String, Object> params);

    /** 详情回显：带分类名、分组名、分类父链 */
    AttrRespVo getAttrInfo(Long attrId);

    /** 保存属性；提交 attrGroupId 时顺带建关联 */
    void saveAttr(AttrVo attr);

    /** 修改属性；提交 attrGroupId 时把关联改到新分组 */
    void updateAttr(AttrVo attr);

    /** 上架时筛出 spu 基础属性里的检索属性，用于 ES 文档的可筛选标记 */
    List<AttrEntity> selectSearchAttrs(List<Long> attrIds);
}

