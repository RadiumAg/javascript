package com.radium.gulimallware.feign;

import com.radium.gulimall.common.utils.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@FeignClient("gulimall-product")
public interface ProductFeignService {

    @RequestMapping("/gulimallproduct/skuinfo/info/{skuId}")
    R skuInfo(@PathVariable("skuId") Long skuId);
}
