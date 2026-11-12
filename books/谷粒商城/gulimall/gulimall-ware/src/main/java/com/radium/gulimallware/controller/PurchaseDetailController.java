package com.radium.gulimallware.controller;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.radium.gulimallware.constant.PurchaseConstant.DetailStatus;
import com.radium.gulimallware.entity.PurchaseDetailEntity;
import com.radium.gulimallware.service.PurchaseDetailService;
import com.radium.gulimallware.service.WareSkuService;
import com.radium.gulimallware.to.SkuInfoTo;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.R;


/**
 * 采购需求
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-25 19:42:07
 */
@RestController
@RequestMapping("gulimallware/purchasedetail")
public class PurchaseDetailController {
    @Autowired
    private PurchaseDetailService purchaseDetailService;
    @Autowired
    private WareSkuService wareSkuService;

    /**
     * 列表
     */
    @RequestMapping("/list")
    public R list(@RequestParam Map<String, Object> params){
        PageUtils page = purchaseDetailService.queryPage(params);

        return R.ok().put("page", page);
    }


    /**
     * 信息
     */
    @RequestMapping("/info/{id}")
    public R info(@PathVariable("id") Long id){
		PurchaseDetailEntity purchaseDetail = purchaseDetailService.getById(id);

        return R.ok().put("purchaseDetail", purchaseDetail);
    }

    /**
     * 保存
     */
    @RequestMapping("/save")
    public R save(@RequestBody PurchaseDetailEntity purchaseDetail){
        if (purchaseDetail.getStatus() == null) {
            purchaseDetail.setStatus(DetailStatus.CREATED.getCode());
        }
        fillSkuPrice(purchaseDetail);
		purchaseDetailService.save(purchaseDetail);

        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    public R update(@RequestBody PurchaseDetailEntity purchaseDetail){
        fillSkuPrice(purchaseDetail);
		purchaseDetailService.updateById(purchaseDetail);

        return R.ok();
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    public R delete(@RequestBody Long[] ids){
		purchaseDetailService.removeByIds(Arrays.asList(ids));

        return R.ok();
    }

    /** sku_price 存整行小计（数量×商品单价），单价远程查 gulimall-product */
    private void fillSkuPrice(PurchaseDetailEntity detail) {
        if (detail.getSkuId() == null || detail.getSkuNum() == null) {
            return;
        }
        SkuInfoTo skuInfo = wareSkuService.getSkuInfo(detail.getSkuId());
        if (skuInfo != null && skuInfo.getPrice() != null) {
            detail.setSkuPrice(skuInfo.getPrice().multiply(BigDecimal.valueOf(detail.getSkuNum())));
        }
    }

}
