package com.radium.gulimallproduct.feign;

import com.radium.gulimall.common.es.SkuEsModel;
import com.radium.gulimall.common.utils.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

/**
 * 商品服务调用搜索服务：上架把 SKU 文档推过去写 ES，下架按 skuId 删 ES 文档。
 */
@FeignClient("gulimall-search")
public interface SearchFeignService {

    @PostMapping("/search/product")
    R productStatusUp(@RequestBody List<SkuEsModel> esModels);

    @PostMapping("/search/product/down")
    R productStatusDown(@RequestBody List<Long> skuIds);
}
