package com.radium.gulimallproduct.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimallproduct.dto.CategoryMoveDTO;
import com.radium.gulimallproduct.entity.CategoryEntity;

import java.util.List;
import java.util.Map;

/**
 * 商品三级分类
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-21 20:33:18
 */
public interface CategoryService extends IService<CategoryEntity> {

    PageUtils queryPage(Map<String, Object> params);

    Object listWithTree();

    void removeMenuByIds(List<Long> list);

    /**
     * 跨父移动。返回 true = 完成；失败会抛 IllegalStateException，业务原因写在 message 里。
     */
    void move(CategoryMoveDTO dto);
}

