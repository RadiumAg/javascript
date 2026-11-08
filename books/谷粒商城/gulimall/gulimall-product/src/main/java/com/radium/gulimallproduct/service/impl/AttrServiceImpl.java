package com.radium.gulimallproduct.service.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.Query;

import com.radium.gulimallproduct.dao.AttrDao;
import com.radium.gulimallproduct.entity.AttrAttrgroupRelationEntity;
import com.radium.gulimallproduct.entity.AttrEntity;
import com.radium.gulimallproduct.entity.AttrGroupEntity;
import com.radium.gulimallproduct.entity.CategoryEntity;
import com.radium.gulimallproduct.service.AttrAttrgroupRelationService;
import com.radium.gulimallproduct.service.AttrGroupService;
import com.radium.gulimallproduct.service.AttrService;
import com.radium.gulimallproduct.service.CategoryService;
import com.radium.gulimallproduct.vo.AttrRespVo;
import com.radium.gulimallproduct.vo.AttrVo;


@Service("attrService")
public class AttrServiceImpl extends ServiceImpl<AttrDao, AttrEntity> implements AttrService {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private AttrGroupService attrGroupService;

    @Autowired
    private AttrAttrgroupRelationService relationService;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        QueryWrapper<AttrEntity> wrapper = new QueryWrapper<>();
        String catelogId = str(params.get("catelogId"));
        if (!catelogId.isEmpty() && !"0".equals(catelogId)) wrapper.eq("catelog_id", catelogId);
        String attrType = str(params.get("attrType"));
        if (!attrType.isEmpty()) wrapper.eq("attr_type", attrType);
        String key = str(params.get("key"));
        if (!key.isEmpty()) {
            // attr_id 是 bigint，非数字 key 参与比较会被 MySQL 隐式转成 0，误命中 id=0
            boolean numeric = key.chars().allMatch(Character::isDigit);
            wrapper.and(w -> {
                w.like("attr_name", key);
                if (numeric) w.or().eq("attr_id", key);
            });
        }
        IPage<AttrEntity> page = this.page(new Query<AttrEntity>().getPage(params), wrapper);
        return new PageUtils(page);
    }

    private static String str(Object v) {
        return v == null ? "" : v.toString().trim();
    }

    @Override
    public AttrRespVo getAttrInfo(Long attrId) {
        AttrEntity entity = getById(attrId);
        AttrRespVo vo = new AttrRespVo();
        if (entity == null) return vo;
        BeanUtils.copyProperties(entity, vo);

        CategoryEntity cat = categoryService.getById(entity.getCatelogId());
        if (cat != null) {
            vo.setCatelogName(cat.getName());
            List<Long> parents = new ArrayList<>();
            for (Long pid = cat.getParentCid(); pid != null && pid != 0; ) {
                parents.add(0, pid);
                CategoryEntity parent = categoryService.getById(pid);
                pid = parent == null ? null : parent.getParentCid();
            }
            vo.setCatelogParentIds(parents.toArray(new Long[0]));
        }

        AttrAttrgroupRelationEntity rel = relationService.getOne(
                new QueryWrapper<AttrAttrgroupRelationEntity>().eq("attr_id", attrId).last("LIMIT 1"));
        if (rel != null) {
            vo.setAttrGroupId(rel.getAttrGroupId());
            AttrGroupEntity group = attrGroupService.getById(rel.getAttrGroupId());
            if (group != null) vo.setGroupName(group.getAttrGroupName());
        }
        return vo;
    }

    @Override
    @Transactional
    public void saveAttr(AttrVo attr) {
        this.save(attr);
        if (attr.getAttrGroupId() != null) {
            relationService.save(relation(attr.getAttrId(), attr.getAttrGroupId()));
        }
    }

    @Override
    @Transactional
    public void updateAttr(AttrVo attr) {
        this.updateById(attr);
        if (attr.getAttrGroupId() == null) return;
        relationService.remove(new QueryWrapper<AttrAttrgroupRelationEntity>().eq("attr_id", attr.getAttrId()));
        relationService.save(relation(attr.getAttrId(), attr.getAttrGroupId()));
    }

    /** attr_sort 留 null 会被 MySQL 升序排到最前，新关联会插到组内第一位 */
    private AttrAttrgroupRelationEntity relation(Long attrId, Long attrGroupId) {
        AttrAttrgroupRelationEntity rel = new AttrAttrgroupRelationEntity();
        rel.setAttrId(attrId);
        rel.setAttrGroupId(attrGroupId);
        rel.setAttrSort(0);
        return rel;
    }

}