package com.radium.gulimallproduct.service.impl;

import com.radium.gulimallproduct.feign.WareFeignService;
import com.radium.gulimallproduct.vo.SkuStockVo;
import com.radium.gulimallproduct.vo.SpuSaveVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.Query;
import com.radium.gulimall.common.utils.R;

import com.radium.gulimallproduct.dao.SpuInfoDao;
import com.radium.gulimallproduct.entity.ProductAttrValueEntity;
import com.radium.gulimallproduct.entity.SkuImagesEntity;
import com.radium.gulimallproduct.entity.SkuInfoEntity;
import com.radium.gulimallproduct.entity.SkuSaleAttrValueEntity;
import com.radium.gulimallproduct.entity.SpuImagesEntity;
import com.radium.gulimallproduct.entity.SpuInfoDescEntity;
import com.radium.gulimallproduct.entity.SpuInfoEntity;
import com.radium.gulimallproduct.service.ProductAttrValueService;
import com.radium.gulimallproduct.service.SkuImagesService;
import com.radium.gulimallproduct.service.SkuInfoService;
import com.radium.gulimallproduct.service.SkuSaleAttrValueService;
import com.radium.gulimallproduct.service.SpuImagesService;
import com.radium.gulimallproduct.service.SpuInfoDescService;
import com.radium.gulimallproduct.service.SpuInfoService;


@Slf4j
@Service("spuInfoService")
public class SpuInfoServiceImpl extends ServiceImpl<SpuInfoDao, SpuInfoEntity> implements SpuInfoService {

    @Autowired
    private SpuInfoDescService spuInfoDescService;
    @Autowired
    private SpuImagesService spuImagesService;
    @Autowired
    private ProductAttrValueService productAttrValueService;
    @Autowired
    private SkuInfoService skuInfoService;
    @Autowired
    private SkuImagesService skuImagesService;
    @Autowired
    private SkuSaleAttrValueService skuSaleAttrValueService;
    @Autowired
    private WareFeignService wareFeignService;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        IPage<SpuInfoEntity> page = this.page(
                new Query<SpuInfoEntity>().getPage(params),
                new QueryWrapper<SpuInfoEntity>()
        );

        return new PageUtils(page);
    }

    @Override
    @Transactional
    public void saveSpuInfo(SpuSaveVo vo) {
        SpuInfoEntity spuInfo = new SpuInfoEntity();
        BeanUtils.copyProperties(vo, spuInfo);
        spuInfo.setCreateTime(new Date());
        spuInfo.setUpdateTime(new Date());
        this.save(spuInfo);
        Long spuId = spuInfo.getId();

        SpuInfoDescEntity desc = new SpuInfoDescEntity();
        desc.setSpuId(spuId);
        desc.setDecript(vo.getDescription());
        spuInfoDescService.save(desc);

        if (!CollectionUtils.isEmpty(vo.getImages())) {
            List<SpuImagesEntity> images = new ArrayList<>();
            for (int i = 0; i < vo.getImages().size(); i++) {
                SpuImagesEntity img = new SpuImagesEntity();
                img.setSpuId(spuId);
                img.setImgUrl(vo.getImages().get(i));
                img.setImgSort(i);
                img.setDefaultImg(i == 0 ? 1 : 0);
                images.add(img);
            }
            spuImagesService.saveBatch(images);
        }

        if (!CollectionUtils.isEmpty(vo.getAttrs())) {
            List<ProductAttrValueEntity> attrValues = new ArrayList<>();
            for (int i = 0; i < vo.getAttrs().size(); i++) {
                SpuSaveVo.Attrs attr = vo.getAttrs().get(i);
                ProductAttrValueEntity value = new ProductAttrValueEntity();
                value.setSpuId(spuId);
                value.setAttrId(attr.getAttrId());
                value.setAttrName(attr.getAttrName());
                value.setAttrValue(attr.getValue());
                value.setAttrSort(i);
                value.setQuickShow(0);
                attrValues.add(value);
            }
            productAttrValueService.saveBatch(attrValues);
        }

        if (CollectionUtils.isEmpty(vo.getSkus())) {
            return;
        }
        List<SkuStockVo> stocks = new ArrayList<>();
        for (SpuSaveVo.Skus sku : vo.getSkus()) {
            SkuInfoEntity skuInfo = new SkuInfoEntity();
            BeanUtils.copyProperties(sku, skuInfo);
            skuInfo.setSpuId(spuId);
            skuInfo.setCatalogId(vo.getCatalogId());
            skuInfo.setBrandId(vo.getBrandId());
            skuInfo.setSaleCount(0L);
            if (!CollectionUtils.isEmpty(sku.getImages())) {
                skuInfo.setSkuDefaultImg(sku.getImages().get(0));
            }
            skuInfoService.save(skuInfo);
            Long skuId = skuInfo.getSkuId();

            if (!CollectionUtils.isEmpty(sku.getImages())) {
                List<SkuImagesEntity> skuImages = new ArrayList<>();
                for (int i = 0; i < sku.getImages().size(); i++) {
                    SkuImagesEntity img = new SkuImagesEntity();
                    img.setSkuId(skuId);
                    img.setImgUrl(sku.getImages().get(i));
                    img.setImgSort(i);
                    img.setDefaultImg(i == 0 ? 1 : 0);
                    skuImages.add(img);
                }
                skuImagesService.saveBatch(skuImages);
            }

            if (!CollectionUtils.isEmpty(sku.getSaleAttrValues())) {
                List<SkuSaleAttrValueEntity> saleAttrs = new ArrayList<>();
                for (int i = 0; i < sku.getSaleAttrValues().size(); i++) {
                    SpuSaveVo.SaleAttrs attr = sku.getSaleAttrValues().get(i);
                    SkuSaleAttrValueEntity saleAttr = new SkuSaleAttrValueEntity();
                    saleAttr.setSkuId(skuId);
                    saleAttr.setAttrId(attr.getAttrId());
                    saleAttr.setAttrName(attr.getAttrName());
                    saleAttr.setAttrValue(attr.getAttrValue());
                    saleAttr.setAttrSort(i);
                    saleAttrs.add(saleAttr);
                }
                skuSaleAttrValueService.saveBatch(saleAttrs);
            }

            SkuStockVo stock = new SkuStockVo();
            stock.setSkuId(skuId);
            stock.setSkuName(sku.getSkuName());
            stock.setStock(sku.getStock() == null ? 0 : sku.getStock());
            stock.setWareId(1L);
            stocks.add(stock);
        }

        // 库存落 wms 库是跨服务调用，失败不回滚商品本身，只记日志提示补偿
        try {
            R r = wareFeignService.saveSkuStock(stocks);
            if (r == null || !Integer.valueOf(0).equals(r.get("code"))) {
                log.warn("库存同步失败 spuId={} resp={}", spuId, r);
            }
        } catch (Exception e) {
            log.warn("库存同步异常 spuId={}，gulimall-ware 可能未启动: {}", spuId, e.getMessage());
        }
    }

}