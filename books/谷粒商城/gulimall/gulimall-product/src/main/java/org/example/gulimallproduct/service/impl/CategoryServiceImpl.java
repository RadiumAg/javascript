package org.example.gulimallproduct.service.impl;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.stream.Collectors;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.example.gulimall.common.utils.PageUtils;
import org.example.gulimall.common.utils.Query;

import org.example.gulimallproduct.dao.CategoryDao;
import org.example.gulimallproduct.entity.CategoryEntity;
import org.example.gulimallproduct.service.CategoryService;


@Service("categoryService")
public class CategoryServiceImpl extends ServiceImpl<CategoryDao, CategoryEntity> implements CategoryService {

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        IPage<CategoryEntity> page = this.page(
                new Query<CategoryEntity>().getPage(params),
                new QueryWrapper<CategoryEntity>()
        );

        return new PageUtils(page);
    }

    @Override
    public Object listWithTree() {
        // 1. 查出所有分类
        var entities =  baseMapper.selectList(null);
        // 2. 组装成父子的树形结构
        var  level1Menus level1Menus = entities
                .stream()
                .filter(categoryEntity ->  categoryEntity.getParentCid() == 0)
                .collect(Collectors.toList());
        return entities;
    }


}