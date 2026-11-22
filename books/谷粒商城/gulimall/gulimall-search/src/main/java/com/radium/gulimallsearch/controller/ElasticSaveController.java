package com.radium.gulimallsearch.controller;

import com.radium.gulimall.common.es.SkuEsModel;
import com.radium.gulimall.common.utils.R;
import com.radium.gulimallsearch.service.ProductSaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RequestMapping("/search")
@RestController
public class ElasticSaveController {
    @Autowired
    ProductSaveService productSaveService;
    /// 上架商品
    /// @return
    @PostMapping("/product")
    public R productStartsUp(@RequestBody List<SkuEsModel> esModels){
        if (esModels == null || esModels.isEmpty()) {
            return R.error("上架数据为空，无需处理");
        }
        try {
            productSaveService.productStatusUp(esModels);
            return R.ok();
        } catch (IOException e) {
            return R.error("商品上架失败：" + e.getMessage());
        }
    }
}
