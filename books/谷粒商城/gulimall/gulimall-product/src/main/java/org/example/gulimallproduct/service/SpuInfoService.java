package org.example.gulimallproduct.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.gulimall.common.utils.PageUtils;
import org.example.gulimallproduct.entity.SpuInfoEntity;

import java.util.Map;

/**
 * spu信息
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-21 20:33:18
 */
public interface SpuInfoService extends IService<SpuInfoEntity> {

    PageUtils queryPage(Map<String, Object> params);
}

