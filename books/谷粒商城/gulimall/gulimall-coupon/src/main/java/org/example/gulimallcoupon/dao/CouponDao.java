package org.example.gulimallcoupon.dao;

import org.example.gulimallcoupon.entity.CouponEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 优惠券信息
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-25 19:40:19
 */
@Mapper
public interface CouponDao extends BaseMapper<CouponEntity> {
	
}
