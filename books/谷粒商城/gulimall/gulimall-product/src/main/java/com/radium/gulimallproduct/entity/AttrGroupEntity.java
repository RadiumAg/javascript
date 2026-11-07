package com.radium.gulimallproduct.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.radium.gulimall.common.valid.AddGroup;
import com.radium.gulimall.common.valid.UpdateGroup;

import java.io.Serializable;

import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

/**
 * 属性分组
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-21 20:33:18
 */
@Data
@TableName("pms_attr_group")
public class AttrGroupEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * 分组id
	 */
	@Null(message = "新增不能指定分组id", groups = {AddGroup.class})
	@NotNull(message = "修改必须指定分组id", groups = {UpdateGroup.class})
	@TableId
	private Long attrGroupId;
	/**
	 * 组名
	 */
	@NotBlank(message = "组名必须提交", groups = {AddGroup.class, UpdateGroup.class})
	private String attrGroupName;
	/**
	 * 排序
	 */
	@Min(value = 0, message = "排序必须大于等于0", groups = {AddGroup.class})
	private Integer sort;
	/**
	 * 描述
	 */
	private String descript;
	/**
	 * 组图标
	 */
	private String icon;
	/**
	 * 所属分类id
	 */
	@NotNull(message = "所属分类必须提交", groups = {AddGroup.class, UpdateGroup.class})
	private Long catelogId;

}