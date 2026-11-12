package com.radium.gulimallware.service.impl;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.radium.gulimall.common.exception.GulimallException;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.Query;

import com.radium.gulimallware.constant.PurchaseConstant.DetailStatus;
import com.radium.gulimallware.constant.PurchaseConstant.PurchaseStatus;
import com.radium.gulimallware.dao.PurchaseDao;
import com.radium.gulimallware.entity.PurchaseDetailEntity;
import com.radium.gulimallware.entity.PurchaseEntity;
import com.radium.gulimallware.service.PurchaseDetailService;
import com.radium.gulimallware.service.PurchaseService;
import com.radium.gulimallware.service.WareSkuService;
import com.radium.gulimallware.vo.MergeVo;
import com.radium.gulimallware.vo.PurchaseDoneVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;


@Service("purchaseService")
public class PurchaseServiceImpl extends ServiceImpl<PurchaseDao, PurchaseEntity> implements PurchaseService {

    @Autowired
    private PurchaseDetailService purchaseDetailService;
    @Autowired
    private WareSkuService wareSkuService;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        String key = params.get("key") == null ? "" : params.get("key").toString();
        String status = params.get("status") == null ? "" : params.get("status").toString();

        QueryWrapper<PurchaseEntity> wrapper = new QueryWrapper<>();
        if (!StringUtils.isEmpty(key)) {
            wrapper.and(w -> w.eq("id", key).or().like("assignee_name", key));
        }
        if (!StringUtils.isEmpty(status)) {
            wrapper.eq("status", status);
        }

        IPage<PurchaseEntity> page = this.page(new Query<PurchaseEntity>().getPage(params), wrapper);
        return new PageUtils(page);
    }

    @Override
    public PageUtils queryPageUnreceive(Map<String, Object> params) {
        IPage<PurchaseEntity> page = this.page(
                new Query<PurchaseEntity>().getPage(params),
                new QueryWrapper<PurchaseEntity>().in("status",
                        PurchaseStatus.CREATED.getCode(), PurchaseStatus.ASSIGNED.getCode()));
        return new PageUtils(page);
    }

    @Transactional
    @Override
    public void mergePurchase(MergeVo mergeVo) {
        Long purchaseId = mergeVo.getPurchaseId();
        if (purchaseId == null) {
            PurchaseEntity purchase = new PurchaseEntity();
            purchase.setStatus(PurchaseStatus.CREATED.getCode());
            Date now = new Date();
            purchase.setCreateTime(now);
            purchase.setUpdateTime(now);
            save(purchase);
            purchaseId = purchase.getId();
        } else {
            PurchaseEntity purchase = getById(purchaseId);
            if (purchase == null) {
                throw new GulimallException(500, "采购单不存在：" + purchaseId);
            }
            if (!canMerge(purchase.getStatus())) {
                throw new GulimallException(500, "采购单已领取或已结束，不能再合并需求");
            }
        }

        List<PurchaseDetailEntity> details = purchaseDetailService.listByIds(mergeVo.getItems());
        if (details.isEmpty()) {
            throw new GulimallException(500, "采购需求不存在");
        }
        for (PurchaseDetailEntity detail : details) {
            Integer status = detail.getStatus();
            if (status != null && status != DetailStatus.CREATED.getCode() && status != DetailStatus.ASSIGNED.getCode()) {
                throw new GulimallException(500, "采购需求 " + detail.getId() + " 已在采购中或已结束，不能合并");
            }
        }

        Long targetId = purchaseId;
        List<PurchaseDetailEntity> updates = details.stream().map(detail -> {
            PurchaseDetailEntity update = new PurchaseDetailEntity();
            update.setId(detail.getId());
            update.setPurchaseId(targetId);
            update.setStatus(DetailStatus.ASSIGNED.getCode());
            return update;
        }).collect(Collectors.toList());
        purchaseDetailService.updateBatchById(updates);

        BigDecimal amount = purchaseDetailService.listDetailByPurchaseId(purchaseId).stream()
                .map(detail -> detail.getSkuPrice() == null ? BigDecimal.ZERO : detail.getSkuPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        PurchaseEntity update = new PurchaseEntity();
        update.setId(purchaseId);
        update.setAmount(amount);
        update.setUpdateTime(new Date());
        updateById(update);
    }

    @Transactional
    @Override
    public void received(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new GulimallException(500, "请先选择要领单的采购单");
        }
        List<PurchaseEntity> purchases = listByIds(ids).stream()
                .filter(purchase -> canMerge(purchase.getStatus()))
                .map(purchase -> {
                    purchase.setStatus(PurchaseStatus.RECEIVE.getCode());
                    purchase.setUpdateTime(new Date());
                    return purchase;
                }).collect(Collectors.toList());
        if (purchases.isEmpty()) {
            throw new GulimallException(500, "没有可领取的采购单，只有新建/已分配状态才能领取");
        }
        updateBatchById(purchases);

        List<PurchaseDetailEntity> details = new ArrayList<>();
        for (PurchaseEntity purchase : purchases) {
            details.addAll(purchaseDetailService.listDetailByPurchaseId(purchase.getId()));
        }
        if (details.isEmpty()) {
            return;
        }
        List<PurchaseDetailEntity> updates = details.stream().map(detail -> {
            PurchaseDetailEntity update = new PurchaseDetailEntity();
            update.setId(detail.getId());
            update.setStatus(DetailStatus.BUYING.getCode());
            return update;
        }).collect(Collectors.toList());
        purchaseDetailService.updateBatchById(updates);
    }

    @Transactional
    @Override
    public void done(PurchaseDoneVo doneVo) {
        PurchaseEntity purchase = getById(doneVo.getId());
        if (purchase == null) {
            throw new GulimallException(500, "采购单不存在：" + doneVo.getId());
        }
        if (purchase.getStatus() == null || purchase.getStatus() != PurchaseStatus.RECEIVE.getCode()) {
            throw new GulimallException(500, "只有已领取的采购单才能完成采购");
        }

        boolean allOk = true;
        List<Long> finishedIds = new ArrayList<>();
        List<PurchaseDetailEntity> updates = new ArrayList<>();
        for (PurchaseDoneVo.Item item : doneVo.getItems()) {
            PurchaseDetailEntity update = new PurchaseDetailEntity();
            update.setId(item.getItemId());
            if (item.getStatus() == DetailStatus.HASERROR.getCode()) {
                allOk = false;
                update.setStatus(DetailStatus.HASERROR.getCode());
            } else {
                update.setStatus(DetailStatus.FINISH.getCode());
                finishedIds.add(item.getItemId());
            }
            updates.add(update);
        }
        purchaseDetailService.updateBatchById(updates);

        PurchaseEntity update = new PurchaseEntity();
        update.setId(doneVo.getId());
        update.setStatus(allOk ? PurchaseStatus.FINISH.getCode() : PurchaseStatus.HASERROR.getCode());
        update.setUpdateTime(new Date());
        updateById(update);

        // 采购成功的需求逐条入库，失败的不影响已成功部分
        if (finishedIds.isEmpty()) {
            return;
        }
        for (PurchaseDetailEntity detail : purchaseDetailService.listByIds(finishedIds)) {
            wareSkuService.addStock(detail.getSkuId(), detail.getWareId(), detail.getSkuNum());
        }
    }

    private boolean canMerge(Integer status) {
        return status != null
                && (status == PurchaseStatus.CREATED.getCode() || status == PurchaseStatus.ASSIGNED.getCode());
    }

}
