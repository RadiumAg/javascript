package com.radium.gulimallproduct.service.impl;

import com.radium.gulimallproduct.dao.BrandDao;
import com.radium.gulimallproduct.dao.CategoryDao;
import com.radium.gulimallproduct.entity.BrandEntity;
import com.radium.gulimallproduct.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.Query;

import com.radium.gulimallproduct.dao.CategoryBrandRelationDao;
import com.radium.gulimallproduct.entity.CategoryBrandRelationEntity;
import com.radium.gulimallproduct.service.CategoryBrandRelationService;


@Service("categoryBrandRelationService")
public class CategoryBrandRelationServiceImpl extends ServiceImpl<CategoryBrandRelationDao, CategoryBrandRelationEntity> implements CategoryBrandRelationService {

    @Autowired
    CategoryBrandRelationDao categoryBrandRelationDao;

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    BrandDao brandDao;

    @Autowired
    BrandService brandService;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        IPage<CategoryBrandRelationEntity> page = this.page(
                new Query<CategoryBrandRelationEntity>().getPage(params),
                new QueryWrapper<CategoryBrandRelationEntity>()
        );

        return new PageUtils(page);
    }

    @Override
    public List<BrandEntity> getBrandsByCatId(Long catId) {
        var relations = categoryBrandRelationDao.selectList(new QueryWrapper<CategoryBrandRelationEntity>().eq("catelog_id", catId));
        return relations.stream()
                .map(item -> brandService.getById(item.getBrandId()))
                .filter(Objects::nonNull)
                .toList();
    }

}