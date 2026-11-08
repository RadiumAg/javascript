package com.radium.gulimallmember.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.radium.gulimall.common.valid.AddGroup;
import com.radium.gulimall.common.valid.ListValue;
import com.radium.gulimall.common.valid.UpdateGroup;

import java.math.BigDecimal;
import java.io.Serializable;
import java.util.Date;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import lombok.Data;

/**
 * 会员等级
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-25 19:41:32
 */
@Data
@TableName("ums_member_level")
public class MemberLevelEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * id
	 */
	@Null(message = "新增不能指定id", groups = {AddGroup.class})
	@NotNull(message = "修改必须指定id", groups = {UpdateGroup.class})
	@TableId
	private Long id;
	/**
	 * 等级名称
	 */
	@NotBlank(message = "等级名称必须提交", groups = {AddGroup.class, UpdateGroup.class})
	private String name;
	/**
	 * 等级需要的成长值
	 */
	@Min(value = 0, message = "成长值必须大于等于0", groups = {AddGroup.class, UpdateGroup.class})
	private Integer growthPoint;
	/**
	 * 是否为默认等级[0->不是；1->是]
	 */
	@ListValue(vals = {0, 1}, message = "默认等级只能提交 0 或 1", groups = {AddGroup.class, UpdateGroup.class})
	private Integer defaultStatus;
	/**
	 * 免运费标准
	 */
	private BigDecimal freeFreightPoint;
	/**
	 * 每次评价获取的成长值
	 */
	@Min(value = 0, message = "评价成长值必须大于等于0", groups = {AddGroup.class, UpdateGroup.class})
	private Integer commentGrowthPoint;
	/**
	 * 是否有免邮特权
	 */
	@ListValue(vals = {0, 1}, message = "免邮特权只能提交 0 或 1", groups = {AddGroup.class, UpdateGroup.class})
	private Integer priviledgeFreeFreight;
	/**
	 * 是否有会员价格特权
	 */
	@ListValue(vals = {0, 1}, message = "会员价特权只能提交 0 或 1", groups = {AddGroup.class, UpdateGroup.class})
	private Integer priviledgeMemberPrice;
	/**
	 * 是否有生日特权
	 */
	@ListValue(vals = {0, 1}, message = "生日特权只能提交 0 或 1", groups = {AddGroup.class, UpdateGroup.class})
	private Integer priviledgeBirthday;
	/**
	 * 备注
	 */
	private String note;

}
