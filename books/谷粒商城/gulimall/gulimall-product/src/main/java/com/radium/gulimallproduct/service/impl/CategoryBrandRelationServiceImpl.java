package com.radium.gulimallproduct.service.impl;

import com.radium.gulimallproduct.dao.BrandDao;
import com.radium.gulimallproduct.dao.CategoryDao;
import com.radium.gulimallproduct.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Map;
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
    public Object getBrandsByCatId(Long catId) {
        var catelogId = categoryBrandRelationDao.selectList(new QueryWrapper<CategoryBrandRelationEntity>().eq("catelog_id", catId));
        var collect = catelogId.stream().map(item ->{
            var brandId = item.getBrandId();
            var byId = brandService.getById(brandId);
            return byId;
        }).toList();
        return collect;
    }

}