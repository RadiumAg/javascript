package com.radium.gulimallcoupon.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.radium.gulimall.common.to.MemberPrice;
import com.radium.gulimall.common.to.SkuReductionTo;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.Query;

import com.radium.gulimallcoupon.dao.SkuFullReductionDao;
import com.radium.gulimallcoupon.entity.MemberPriceEntity;
import com.radium.gulimallcoupon.entity.SkuFullReductionEntity;
import com.radium.gulimallcoupon.entity.SkuLadderEntity;
import com.radium.gulimallcoupon.service.MemberPriceService;
import com.radium.gulimallcoupon.service.SkuFullReductionService;
import com.radium.gulimallcoupon.service.SkuLadderService;


@Service("skuFullReductionService")
public class SkuFullReductionServiceImpl extends ServiceImpl<SkuFullReductionDao, SkuFullReductionEntity> implements SkuFullReductionService {

    @Autowired
    private SkuLadderService skuLadderService;
    @Autowired
    private MemberPriceService memberPriceService;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        IPage<SkuFullReductionEntity> page = this.page(
                new Query<SkuFullReductionEntity>().getPage(params),
                new QueryWrapper<SkuFullReductionEntity>()
        );

        return new PageUtils(page);
    }

    @Override
    public void saveSkuReduction(SkuReductionTo skuReductionTo) {
        // sms_sku_full_reduction：满减
        if (Integer.valueOf(1).equals(skuReductionTo.getPriceStatus())) {
            SkuFullReductionEntity fullReduction = new SkuFullReductionEntity();
            fullReduction.setSkuId(skuReductionTo.getSkuId());
            fullReduction.setFullPrice(skuReductionTo.getFullPrice());
            fullReduction.setReducePrice(skuReductionTo.getReducePrice());
            this.save(fullReduction);
        }

        // sms_sku_ladder：阶梯满减
        if (Integer.valueOf(1).equals(skuReductionTo.getCountStatus())) {
            SkuLadderEntity skuLadder = new SkuLadderEntity();
            skuLadder.setSkuId(skuReductionTo.getSkuId());
            skuLadder.setFullCount(skuReductionTo.getFullCount());
            skuLadder.setDiscount(skuReductionTo.getDiscount());
            skuLadderService.save(skuLadder);
        }

        // sms_member_price：会员价
        List<MemberPrice> memberPrices = skuReductionTo.getMemberPrice();
        if (memberPrices != null && !memberPrices.isEmpty()) {
            List<MemberPriceEntity> entities = memberPrices.stream()
                    .filter(mp -> mp.getPrice() != null)
                    .map(mp -> {
                        MemberPriceEntity entity = new MemberPriceEntity();
                        entity.setSkuId(skuReductionTo.getSkuId());
                        entity.setMemberLevelId(mp.getId());
                        entity.setMemberLevelName(mp.getName());
                        entity.setMemberPrice(mp.getPrice());
                        return entity;
                    }).collect(Collectors.toList());
            if (!entities.isEmpty()) {
                memberPriceService.saveBatch(entities);
            }
        }
    }

}