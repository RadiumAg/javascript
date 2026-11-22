package com.radium.gulimallproduct.feign;

import com.radium.gulimall.common.es.SkuEsModel;
import com.radium.gulimall.common.utils.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

/**
 * 商品服务调用搜索服务：把组装好的 SKU 文档推过去写入 ES（上架）。
 */
@FeignClient("gulimall-search")
public interface SearchFeignService {

    @PostMapping("/search/product")
    R productStatusUp(@RequestBody List<SkuEsModel> esModels);
}
