package com.radium.gulimallmember.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimallmember.entity.MemberLevelEntity;

import java.util.Map;

/**
 * 会员等级
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-25 19:41:32
 */
public interface MemberLevelService extends IService<MemberLevelEntity> {

    PageUtils queryPage(Map<String, Object> params);

    /** 新增等级；设为默认时把其它等级的默认位摘掉 */
    void saveLevel(MemberLevelEntity level);

    /** 修改等级；设为默认时把其它等级的默认位摘掉 */
    void updateLevel(MemberLevelEntity level);
}

