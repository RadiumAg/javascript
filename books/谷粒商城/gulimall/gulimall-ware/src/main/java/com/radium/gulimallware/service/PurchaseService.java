package com.radium.gulimallware.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimallware.entity.PurchaseEntity;
import com.radium.gulimallware.vo.MergeVo;
import com.radium.gulimallware.vo.PurchaseDoneVo;

import java.util.List;
import java.util.Map;

/**
 * 采购信息
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-25 19:42:07
 */
public interface PurchaseService extends IService<PurchaseEntity> {

    PageUtils queryPage(Map<String, Object> params);

    /** 未领取的采购单（新建/已分配），合并整单时供选择 */
    PageUtils queryPageUnreceive(Map<String, Object> params);

    /** 把采购需求合并进采购单，purchaseId 为空则新建 */
    void mergePurchase(MergeVo mergeVo);

    /** 领取采购单，单内需求转为正在采购 */
    void received(List<Long> ids);

    /** 完成采购：成功的需求入库，任一失败则整单标记异常 */
    void done(PurchaseDoneVo doneVo);
}
