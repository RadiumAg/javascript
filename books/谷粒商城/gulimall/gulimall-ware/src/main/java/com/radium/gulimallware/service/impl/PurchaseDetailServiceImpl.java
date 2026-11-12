package com.radium.gulimallware.service.impl;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.Query;

import com.radium.gulimallware.dao.PurchaseDetailDao;
import com.radium.gulimallware.entity.PurchaseDetailEntity;
import com.radium.gulimallware.service.PurchaseDetailService;
import org.springframework.util.StringUtils;


@Service("purchaseDetailService")
public class PurchaseDetailServiceImpl extends ServiceImpl<PurchaseDetailDao, PurchaseDetailEntity> implements PurchaseDetailService {

    /**
     * key：采购单id 或 skuId；status：需求状态；wareId：仓库；purchaseId：只看某张采购单的需求
     */
    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        String key = params.get("key") == null ? "" : params.get("key").toString();
        String status = params.get("status") == null ? "" : params.get("status").toString();
        String wareId = params.get("wareId") == null ? "" : params.get("wareId").toString();
        String purchaseId = params.get("purchaseId") == null ? "" : params.get("purchaseId").toString();

        QueryWrapper<PurchaseDetailEntity> wrapper = new QueryWrapper<>();
        if (!StringUtils.isEmpty(key)) {
            wrapper.and(w -> w.eq("purchase_id", key).or().eq("sku_id", key));
        }
        if (!StringUtils.isEmpty(status)) {
            wrapper.eq("status", status);
        }
        if (!StringUtils.isEmpty(wareId)) {
            wrapper.eq("ware_id", wareId);
        }
        if (!StringUtils.isEmpty(purchaseId)) {
            wrapper.eq("purchase_id", purchaseId);
        }

        IPage<PurchaseDetailEntity> page = this.page(new Query<PurchaseDetailEntity>().getPage(params), wrapper);
        return new PageUtils(page);
    }

    @Override
    public List<PurchaseDetailEntity> listDetailByPurchaseId(Long purchaseId) {
        return list(new QueryWrapper<PurchaseDetailEntity>().eq("purchase_id", purchaseId));
    }

}
