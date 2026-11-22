package com.radium.gulimallproduct.service.impl;

import com.alibaba.nacos.common.utils.StringUtils;
import com.alibaba.nacos.shaded.io.grpc.netty.shaded.io.netty.util.internal.StringUtil;
import com.radium.gulimall.common.es.SkuEsModel;
import com.radium.gulimall.common.to.SkuReductionTo;
import com.radium.gulimall.common.to.SpuBoundsTo;
import com.radium.gulimallproduct.entity.*;
import com.radium.gulimallproduct.feign.CouponFeignService;
import com.radium.gulimallproduct.feign.WareFeignService;
import com.radium.gulimallproduct.service.*;
import com.radium.gulimallproduct.vo.SkuHasStockVo;
import com.radium.gulimallproduct.vo.SkuStockVo;
import com.radium.gulimallproduct.vo.SpuSaveVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.Query;
import com.radium.gulimall.common.utils.R;
import com.radium.gulimallproduct.dao.SpuInfoDao;


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
    @Autowired
    CouponFeignService couponFeignService;
    @Autowired
    BrandService brandService;
    @Autowired
    CategoryService categoryService;
    @Autowired
    AttrService attrService;

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
                value.setQuickShow(attr.getQuickShow() == null ? 0 : attr.getQuickShow());
                attrValues.add(value);
            }
            productAttrValueService.saveBatch(attrValues);
        }

        if (CollectionUtils.isEmpty(vo.getSkus())) {
            return;
        }
        if (vo.getBounds() != null) {
            SpuBoundsTo spuBoundsTo = new SpuBoundsTo();
            BeanUtils.copyProperties(vo.getBounds(), spuBoundsTo);
            spuBoundsTo.setSpuId(spuId);
            couponFeignService.saveSpuBounds(spuBoundsTo);
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

            SkuReductionTo reductionTo = new SkuReductionTo();
            BeanUtils.copyProperties(sku, reductionTo);
            reductionTo.setSkuId(skuId);
            if ((sku.getFullCount() != null && sku.getFullCount() > 0)
                    || (sku.getFullPrice() != null && sku.getFullPrice().compareTo(BigDecimal.ZERO) > 0)) {
                couponFeignService.saveSkuReduction(reductionTo);
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

    @Override
    public PageUtils queryPageByCondition(Map<String, Object> params) {
        QueryWrapper<SpuInfoEntity> wrapper = new QueryWrapper<>();
        String key = params.get("key") == null ? "" : params.get("key").toString();
        String status = params.get("status") == null ? "" : params.get("status").toString();
        String brandId = params.get("brandId") == null ? "" : params.get("brandId").toString();
        String catalogId = params.get("catalogId") == null ? "" : params.get("catalogId").toString();

        if (!StringUtils.isEmpty(key)) {
            wrapper.and(w -> {
                w.eq("id", key).or().like("spu_name", key);
            });
        }
        if (!StringUtils.isEmpty(status)) {
            wrapper.eq("publish_status", status);
        }
        if (!StringUtils.isEmpty(brandId)) {
            wrapper.and(w -> {
                w.eq("brand_id", brandId);
            });

        }
        if (!StringUtils.isEmpty(catalogId)) {
            wrapper.and(w -> {
                w.eq("catalog_id", catalogId);
            });

        }

        IPage<SpuInfoEntity> page = this.page(new Query<SpuInfoEntity>().getPage(params), wrapper);
        return new PageUtils(page);
    }

    @Override
    public void up(Long spuId) {
        // 组装需要的数据
        List<SkuInfoEntity> skus = skuInfoService.getSkuBySpuId(spuId);
        List<Long> skuIdList = skus.stream().map(SkuInfoEntity::getSkuId).toList();
        List<ProductAttrValueEntity> baseAttrs = productAttrValueService.baseAttrListforspu(spuId);
        List<Long> attrIds = baseAttrs.stream().map(attr -> {
            return attr.getAttrId();
        });
        List<Long> searchAttrIds = attrService.selectSearchAttrs(attrIds).stream().map(attr -> {
            return attr.getAttrId();
        });
        List<SkuEsModel.Attrs> attrsList = new ArrayList<>();
        Set<Long> attrIdSet = new HashSet<>(searchAttrIds);
        baseAttrs.stream().filter(attr -> {
            return attrIdSet.contains(attr.getAttrId());
        }).map(item -> {
            SkuEsModel.Attrs attrs = new SkuEsModel.Attrs();
            BeanUtils.copyProperties(item, attrs);
            return attrIds;
        }).toList();

        var upProducts = skus.stream().map(sku -> {
            var esModel = new SkuEsModel();
            BeanUtils.copyProperties(sku, esModel);
            esModel.setSkuPrice(sku.getPrice());
            esModel.setSkuImg(sku.getSkuDefaultImg());
            Map<Long, Boolean> mapStock = null;
            // 1. 发送远程调用，库存系统查询是否有库存
            try {
                R<List<SkuHasStockVo>> skusHasStocks = wareFeignService.getSkusHasStocks(sku.getSkuId());
                mapStock = skusHasStocks.getData().stream().collect(Collectors.toMap(SkuHasStockVo::getSkuId, SkuHasStockVo::getHasStock));
            } catch (Exception e) {
                log.error("库存服务查询异常:{}", e.getMessage());
            }
            Boolean hasStockData = mapStock == null || mapStock.get(sku.getSkuId());
            esModel.setHasStock(hasStockData);
            // 2. 评分热度
            esModel.setHotScore(0L);
            // 3. 查询品牌和分类的名字信息
            var brand = brandService.getById(sku.getBrandId());
            esModel.setBrandName(brand.getName());
            esModel.setBrandImage(brand.getLogo());
            var category = categoryService.getById(esModel.getCatalogId());
            esModel.setCatalogName(category.getName());
            // 设置检索属性
            esModel.setAttrs(attrsList);
            return esModel;
        }).toList();
        // 5. 将数据发送给es进行保存
    }
}