package com.radium.gulimallproduct.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.radium.gulimall.common.valid.AddGroup;
import com.radium.gulimall.common.valid.UpdateGroup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.radium.gulimallproduct.entity.AttrAttrgroupRelationEntity;
import com.radium.gulimallproduct.entity.AttrGroupEntity;
import com.radium.gulimallproduct.service.AttrGroupService;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.R;



/**
 * 属性分组
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-21 20:33:18
 */
@RestController
@RequestMapping("gulimallproduct/attrgroup")
public class AttrGroupController {
    @Autowired
    private AttrGroupService attrGroupService;

    /**
     * 列表：catelogId 按分类过滤（0/缺省=不限），key 匹配组名或组id
     */
    @RequestMapping("/list")
    public R list(@RequestParam Map<String, Object> params){
        PageUtils page = attrGroupService.queryPage(params);

        return R.ok().put("page", page);
    }


    /**
     * 信息
     */
    @RequestMapping("/info/{attrGroupId}")
    public R info(@PathVariable("attrGroupId") Long attrGroupId){
		AttrGroupEntity attrGroup = attrGroupService.getById(attrGroupId);

        return R.ok().put("attrGroup", attrGroup);
    }

    /**
     * 保存
     */
    @RequestMapping("/save")
    public R save(@Validated(AddGroup.class) @RequestBody AttrGroupEntity attrGroup){
		attrGroupService.save(attrGroup);

        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    public R update(@Validated(UpdateGroup.class) @RequestBody AttrGroupEntity attrGroup){
		attrGroupService.updateById(attrGroup);

        return R.ok();
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    public R delete(@RequestBody Long[] attrGroupIds){
		attrGroupService.removeAttrGroupByIds(Arrays.asList(attrGroupIds));

        return R.ok();
    }

    /**
     * 组内已关联的基本属性
     */
    @GetMapping("/attr/relation/{attrGroupId}")
    public R relationAttrs(@PathVariable("attrGroupId") Long attrGroupId) {
        return R.ok().put("data", attrGroupService.relationAttrs(attrGroupId));
    }

    /**
     * 该分类下未关联任何分组的基本属性，供关联弹窗挑选
     */
    @GetMapping("/attr/norelation/{catelogId}")
    public R noRelationAttrs(@PathVariable("catelogId") Long catelogId) {
        return R.ok().put("data", attrGroupService.noRelationAttrs(catelogId));
    }

    /**
     * 批量关联：body 是 [{attrId, attrGroupId, attrSort?}]
     */
    @PostMapping("/attr/relation")
    public R saveRelation(@RequestBody List<AttrAttrgroupRelationEntity> relations) {
        attrGroupService.saveRelations(relations);
        return R.ok();
    }

    /**
     * 批量取消关联：body 是 [{attrId, attrGroupId}]
     */
    @PostMapping("/attr/relation/delete")
    public R deleteRelation(@RequestBody List<AttrAttrgroupRelationEntity> relations) {
        attrGroupService.deleteRelations(relations);
        return R.ok();
    }

    /**
     * 该分类下所有分组连同组内属性，商详页规格参数块用
     */
    @GetMapping("/{catelogId}/withattrs")
    public R attrGroupWithAttrs(@PathVariable("catelogId") Long catelogId) {
        return R.ok().put("data", attrGroupService.getAttrGroupWithAttrs(catelogId));
    }

}