package com.radium.gulimallproduct.feign;

import com.radium.gulimall.common.utils.R;
import com.radium.gulimallproduct.vo.SkuHasStockVo;
import com.radium.gulimallproduct.vo.SkuStockVo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@FeignClient("gulimall-ware")
public interface WareFeignService {

    @RequestMapping("/gulimallware/waresku/saves")
    R saveSkuStock(@RequestBody List<SkuStockVo> stocks);


    @RequestMapping("/gulimallware/waresku/hasstock/{skuId}")
    R<SkuHasStockVo> getSkusHasStocks(@PathVariable("skuId") Long skuId);
}