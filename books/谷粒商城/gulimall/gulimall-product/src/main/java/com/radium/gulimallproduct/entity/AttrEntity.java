package com.radium.gulimallproduct.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.radium.gulimall.common.valid.AddGroup;
import com.radium.gulimall.common.valid.ListValue;
import com.radium.gulimall.common.valid.UpdateGroup;

import java.io.Serializable;
import java.util.Date;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import lombok.Data;

/**
 * 商品属性
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-21 20:33:18
 */
@Data
@TableName("pms_attr")
public class AttrEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * 属性id
	 */
	@Null(message = "新增不能指定属性id", groups = {AddGroup.class})
	@NotNull(message = "修改必须指定属性id", groups = {UpdateGroup.class})
	@TableId
	private Long attrId;
	/**
	 * 属性名
	 */
	@NotBlank(message = "属性名必须提交", groups = {AddGroup.class, UpdateGroup.class})
	private String attrName;
	/**
	 * 是否需要检索[0-不需要，1-需要]
	 */
	@ListValue(vals = {0, 1}, message = "可检索只能提交 0 或 1", groups = {AddGroup.class, UpdateGroup.class})
	private Integer searchType;
	/**
	 * 值类型[0-单选，1-多选]
	 */
	@ListValue(vals = {0, 1}, message = "值类型只能提交 0 或 1", groups = {AddGroup.class, UpdateGroup.class})
	private Integer valueType;
	/**
	 * 属性图标
	 */
	private String icon;
	/**
	 * 可选值列表[用逗号分隔]
	 */
	private String valueSelect;
	/**
	 * 属性类型[0-销售属性，1-基本属性
	 */
	private Integer attrType;
	/**
	 * 启用状态[0 - 禁用，1 - 启用]
	 */
	private Long enable;
	/**
	 * 所属分类
	 */
	@NotNull(message = "所属分类必须提交", groups = {AddGroup.class, UpdateGroup.class})
	private Long catelogId;
	/**
	 * 快速展示【是否展示在介绍上；0-否 1-是】，在sku中仍然可以调整
	 */
	@ListValue(vals = {0, 1}, message = "快速展示只能提交 0 或 1", groups = {AddGroup.class, UpdateGroup.class})
	private Integer showDesc;

}
