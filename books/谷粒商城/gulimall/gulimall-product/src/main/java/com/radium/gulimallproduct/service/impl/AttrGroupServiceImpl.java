package com.radium.gulimallproduct.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.Query;

import com.radium.gulimallproduct.dao.AttrDao;
import com.radium.gulimallproduct.dao.AttrGroupDao;
import com.radium.gulimallproduct.entity.AttrAttrgroupRelationEntity;
import com.radium.gulimallproduct.entity.AttrEntity;
import com.radium.gulimallproduct.entity.AttrGroupEntity;
import com.radium.gulimallproduct.service.AttrAttrgroupRelationService;
import com.radium.gulimallproduct.service.AttrGroupService;


@Service("attrGroupService")
public class AttrGroupServiceImpl extends ServiceImpl<AttrGroupDao, AttrGroupEntity> implements AttrGroupService {

    @Autowired
    private AttrDao attrDao;
    @Autowired
    private AttrAttrgroupRelationService relationService;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        QueryWrapper<AttrGroupEntity> wrapper = new QueryWrapper<>();
        String catelogId = str(params.get("catelogId"));
        if (!catelogId.isEmpty() && !"0".equals(catelogId)) wrapper.eq("catelog_id", catelogId);
        String key = str(params.get("key"));
        if (!key.isEmpty()) {
            // 组id 是 bigint，非数字的 key 直接参与比较会被 MySQL 隐式转成 0，误命中 id=0
            boolean numeric = key.chars().allMatch(Character::isDigit);
            wrapper.and(w -> {
                w.like("attr_group_name", key);
                if (numeric) w.or().eq("attr_group_id", key);
            });
        }

        IPage<AttrGroupEntity> page = this.page(
                new Query<AttrGroupEntity>().getPage(params),
                wrapper
        );

        return new PageUtils(page);
    }

    @Override
    public List<AttrEntity> relationAttrs(Long attrGroupId) {
        return attrDao.selectRelationAttrs(attrGroupId);
    }

    @Override
    public List<AttrEntity> noRelationAttrs(Long catelogId) {
        return attrDao.selectNoRelationAttrs(catelogId);
    }

    @Override
    @Transactional
    public void saveRelations(List<AttrAttrgroupRelationEntity> relations) {
        if (relations == null || relations.isEmpty()) return;
        // attr_sort 为 null 时 MySQL 升序会把它排在最前，新关联的属性会插到组内第一位
        for (AttrAttrgroupRelationEntity r : relations) {
            if (r.getAttrSort() == null) r.setAttrSort(0);
        }
        relationService.saveBatch(relations);
    }

    @Override
    @Transactional
    public void deleteRelations(List<AttrAttrgroupRelationEntity> relations) {
        if (relations == null || relations.isEmpty()) return;
        for (AttrAttrgroupRelationEntity r : relations) {
            relationService.remove(new QueryWrapper<AttrAttrgroupRelationEntity>()
                    .eq("attr_id", r.getAttrId())
                    .eq("attr_group_id", r.getAttrGroupId()));
        }
    }

    @Override
    @Transactional
    public void removeAttrGroupByIds(List<Long> attrGroupIds) {
        if (attrGroupIds == null || attrGroupIds.isEmpty()) return;
        this.removeByIds(attrGroupIds);
        relationService.remove(new QueryWrapper<AttrAttrgroupRelationEntity>().in("attr_group_id", attrGroupIds));
    }

    private static String str(Object v) {
        return v == null ? "" : v.toString().trim();
    }

}