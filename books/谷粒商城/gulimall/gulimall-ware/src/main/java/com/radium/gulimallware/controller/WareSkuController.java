package com.radium.gulimallware.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.radium.gulimallware.entity.WareSkuEntity;
import com.radium.gulimallware.service.WareSkuService;
import com.radium.gulimallware.to.SkuInfoTo;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.R;
import org.springframework.util.StringUtils;



/**
 * 商品库存
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-25 19:42:07
 */
@RestController
@RequestMapping("gulimallware/waresku")
public class WareSkuController {
    @Autowired
    private WareSkuService wareSkuService;

    /**
     * 列表
     */
    @RequestMapping("/list")
    public R list(@RequestParam Map<String, Object> params){
        PageUtils page = wareSkuService.queryPage(params);

        return R.ok().put("page", page);
    }


    /**
     * 信息
     */
    @RequestMapping("/info/{id}")
    public R info(@PathVariable("id") Long id){
		WareSkuEntity wareSku = wareSkuService.getById(id);

        return R.ok().put("wareSku", wareSku);
    }

    /**
     * 保存
     */
    @RequestMapping("/save")
    public R save(@RequestBody WareSkuEntity wareSku){
        if (wareSku.getStock() == null) {
            wareSku.setStock(0);
        }
        if (wareSku.getStockLocked() == null) {
            wareSku.setStockLocked(0);
        }
        if (StringUtils.isEmpty(wareSku.getSkuName()) && wareSku.getSkuId() != null) {
            SkuInfoTo skuInfo = wareSkuService.getSkuInfo(wareSku.getSkuId());
            if (skuInfo != null) {
                wareSku.setSkuName(skuInfo.getSkuName());
            }
        }
		wareSkuService.save(wareSku);

        return R.ok();
    }

    /**
     * 批量保存库存：发布商品时由 gulimall-product 通过 Feign 调用
     */
    @RequestMapping("/saves")
    public R saves(@RequestBody List<WareSkuEntity> wareSkus){
		wareSkuService.saveBatch(wareSkus);

        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    public R update(@RequestBody WareSkuEntity wareSku){
		wareSkuService.updateById(wareSku);

        return R.ok();
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    public R delete(@RequestBody Long[] ids){
		wareSkuService.removeByIds(Arrays.asList(ids));

        return R.ok();
    }

}
