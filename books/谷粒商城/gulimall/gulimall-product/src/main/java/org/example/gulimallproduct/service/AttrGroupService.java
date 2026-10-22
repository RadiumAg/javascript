package org.example.gulimallproduct.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.gulimall.common.utils.PageUtils;
import org.example.gulimallproduct.entity.AttrGroupEntity;

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
}

