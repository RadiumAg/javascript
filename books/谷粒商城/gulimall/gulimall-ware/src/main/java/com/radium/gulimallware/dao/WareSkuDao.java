package com.radium.gulimallware.dao;

import com.radium.gulimallware.entity.WareSkuEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 商品库存
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-25 19:42:07
 */
@Mapper
public interface WareSkuDao extends BaseMapper<WareSkuEntity> {

    /** 采购入库：库存累加，交给数据库做原子更新 */
    int addStock(@Param("skuId") Long skuId, @Param("wareId") Long wareId, @Param("num") Integer num);
}
