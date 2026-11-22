package com.radium.gulimallproduct.controller;

import java.util.Arrays;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.radium.gulimallproduct.entity.SpuInfoEntity;
import com.radium.gulimallproduct.service.SpuInfoService;
import com.radium.gulimallproduct.vo.SpuSaveVo;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.R;

import javax.validation.Valid;



/**
 * spu信息
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-21 20:33:18
 */
@RestController
@RequestMapping("gulimallproduct/spuinfo")
public class SpuInfoController {
    @Autowired
    private SpuInfoService spuInfoService;

    /**
     * 列表
     */
    @RequestMapping("/list")
    public R list(@RequestParam Map<String, Object> params){
        PageUtils page = spuInfoService.queryPageByCondition(params);

        return R.ok().put("page", page);
    }


    /**
     * 信息
     */
    @RequestMapping("/info/{id}")
    public R info(@PathVariable("id") Long id){
		SpuInfoEntity spuInfo = spuInfoService.getById(id);

        return R.ok().put("spuInfo", spuInfo);
    }

    /**
     * 发布商品：一次事务保存 spu/desc/images/规格参数/sku/sku图片/销售属性，并远程同步库存
     */
    @RequestMapping("/save")
    public R save(@Valid @RequestBody SpuSaveVo spuSaveVo){
		spuInfoService.saveSpuInfo(spuSaveVo);

        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    public R update(@RequestBody SpuInfoEntity spuInfo){
		spuInfoService.updateById(spuInfo);

        return R.ok();
    }

    /**
     * 上架：组装该 SPU 下所有 SKU 的 ES 文档推给搜索服务写入 ES，成功后置 publish_status=1。
     * 只翻状态请走 /update；这里会走完整 up() 流程，需要 search/ware 服务在跑。
     */
    @RequestMapping("/up/{spuId}")
    public R up(@PathVariable("spuId") Long spuId){
        spuInfoService.up(spuId);
        return R.ok();
    }

    /**
     * 下架：取该 SPU 下所有 skuId 推给搜索服务删除 ES 文档，成功后置 publish_status=0。
     * 需要 search 服务在跑。
     */
    @RequestMapping("/down/{spuId}")
    public R down(@PathVariable("spuId") Long spuId){
        spuInfoService.down(spuId);
        return R.ok();
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    public R delete(@RequestBody Long[] ids){
		spuInfoService.removeByIds(Arrays.asList(ids));

        return R.ok();
    }

}
