package com.radium.gulimallmember.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.Query;

import com.radium.gulimallmember.dao.MemberLevelDao;
import com.radium.gulimallmember.entity.MemberLevelEntity;
import com.radium.gulimallmember.service.MemberLevelService;


@Service("memberLevelService")
public class MemberLevelServiceImpl extends ServiceImpl<MemberLevelDao, MemberLevelEntity> implements MemberLevelService {

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        IPage<MemberLevelEntity> page = this.page(
                new Query<MemberLevelEntity>().getPage(params),
                new QueryWrapper<MemberLevelEntity>()
        );

        return new PageUtils(page);
    }

    @Override
    @Transactional
    public void saveLevel(MemberLevelEntity level) {
        clearOtherDefaults(null, level.getDefaultStatus());
        this.save(level);
    }

    @Override
    @Transactional
    public void updateLevel(MemberLevelEntity level) {
        clearOtherDefaults(level.getId(), level.getDefaultStatus());
        this.updateById(level);
    }

    /** 默认等级全表只能有一个：新默认位落下去之前，先把别的（或自己的旧记录之外的）清零 */
    private void clearOtherDefaults(Long excludeId, Integer defaultStatus) {
        if (defaultStatus == null || defaultStatus != 1) return;
        UpdateWrapper<MemberLevelEntity> wrapper = new UpdateWrapper<MemberLevelEntity>()
                .set("default_status", 0)
                .eq("default_status", 1);
        if (excludeId != null) wrapper.ne("id", excludeId);
        this.update(wrapper);
    }

}