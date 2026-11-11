package com.radium.gulimallproduct.vo;

import lombok.Data;

import java.math.BigDecimal;

/**
 * SPU 积分设置，落 gulimall-coupon sms_spu_bounds
 */
@Data
public class Bounds {

    private BigDecimal buyBounds;

    private BigDecimal growBounds;

}
