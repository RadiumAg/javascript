package com.radium.gulimallproduct.service.impl;

import org.springframework.stereotype.Service;
import java.util.Map;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.Query;

import com.radium.gulimallproduct.dao.BrandDao;
import com.radium.gulimallproduct.entity.BrandEntity;
import com.radium.gulimallproduct.service.BrandService;


@Service("brandService")
public class BrandServiceImpl extends ServiceImpl<BrandDao, BrandEntity> implements BrandService {

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        QueryWrapper<BrandEntity> wrapper = new QueryWrapper<>();
        String name = str(params.get("name"));
        if (!name.isEmpty()) wrapper.like("name", name);
        String showStatus = str(params.get("showStatus"));
        if (!showStatus.isEmpty()) wrapper.eq("show_status", showStatus);
        String firstLetter = str(params.get("firstLetter"));
        if (!firstLetter.isEmpty()) wrapper.eq("first_letter", firstLetter);

        IPage<BrandEntity> page = this.page(
                new Query<BrandEntity>().getPage(params),
                wrapper
        );

        return new PageUtils(page);
    }

    private static String str(Object v) {
        return v == null ? "" : v.toString().trim();
    }

}