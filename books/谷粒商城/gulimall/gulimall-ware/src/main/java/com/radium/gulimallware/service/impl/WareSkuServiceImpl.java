package com.radium.gulimallware.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.util.Map;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.Query;
import com.radium.gulimall.common.utils.R;

import com.radium.gulimallware.dao.WareSkuDao;
import com.radium.gulimallware.entity.WareSkuEntity;
import com.radium.gulimallware.feign.ProductFeignService;
import com.radium.gulimallware.service.WareSkuService;
import com.radium.gulimallware.to.SkuInfoTo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;


@Slf4j
@Service("wareSkuService")
public class WareSkuServiceImpl extends ServiceImpl<WareSkuDao, WareSkuEntity> implements WareSkuService {

    @Autowired
    private ProductFeignService productFeignService;
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        String skuId = params.get("skuId") == null ? "" : params.get("skuId").toString();
        String wareId = params.get("wareId") == null ? "" : params.get("wareId").toString();

        QueryWrapper<WareSkuEntity> wrapper = new QueryWrapper<>();
        if (!StringUtils.isEmpty(skuId)) {
            wrapper.eq("sku_id", skuId);
        }
        if (!StringUtils.isEmpty(wareId)) {
            wrapper.eq("ware_id", wareId);
        }

        IPage<WareSkuEntity> page = this.page(new Query<WareSkuEntity>().getPage(params), wrapper);
        return new PageUtils(page);
    }

    @Transactional
    @Override
    public void addStock(Long skuId, Long wareId, Integer num) {
        WareSkuEntity exist = getOne(new QueryWrapper<WareSkuEntity>()
                .eq("sku_id", skuId).eq("ware_id", wareId), false);
        if (exist != null) {
            baseMapper.addStock(skuId, wareId, num);
            return;
        }

        WareSkuEntity wareSku = new WareSkuEntity();
        wareSku.setSkuId(skuId);
        wareSku.setWareId(wareId);
        wareSku.setStock(num);
        wareSku.setStockLocked(0);
        SkuInfoTo skuInfo = getSkuInfo(skuId);
        if (skuInfo != null) {
            wareSku.setSkuName(skuInfo.getSkuName());
        }
        save(wareSku);
    }

    @Override
    public SkuInfoTo getSkuInfo(Long skuId) {
        try {
            R r = productFeignService.skuInfo(skuId);
            if (r == null || r.get("skuInfo") == null) {
                return null;
            }
            return objectMapper.convertValue(r.get("skuInfo"), SkuInfoTo.class);
        } catch (Exception e) {
            log.warn("查询商品 skuId={} 失败：{}", skuId, e.getMessage());
            return null;
        }
    }

}
