package com.radium.gulimallproduct.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.radium.gulimall.common.utils.PageUtils;
import com.radium.gulimall.common.utils.Query;

import com.radium.gulimallproduct.dao.CategoryDao;
import com.radium.gulimallproduct.dto.CategoryMoveDTO;
import com.radium.gulimallproduct.entity.CategoryEntity;
import com.radium.gulimallproduct.service.CategoryService;


@Service("categoryService")
public class CategoryServiceImpl extends ServiceImpl<CategoryDao, CategoryEntity> implements CategoryService {

    /** 商品分类业务上的最大层级：1..MAX_LEVEL */
    private static final int MAX_LEVEL = 3;

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        IPage<CategoryEntity> page = this.page(
                new Query<CategoryEntity>().getPage(params),
                new QueryWrapper<CategoryEntity>()
        );

        return new PageUtils(page);
    }

    @Override
    public Object listWithTree() {
        // 1. 查出所有分类
        var entities = baseMapper.selectList(null);
        // 2. 组装成父子的树形结构，返回排好序的一级节点（旧版把 level1Menus 算完却 return entities，导致 sort 不落效）
        var level1Menus = entities
                .stream()
                .filter(categoryEntity -> categoryEntity.getParentCid() == 0)
                .map((menu) -> {
                    menu.setChildren(getChildren(menu, entities));
                    return menu;
                })
                .sorted(CategoryServiceImpl::compareBySort)
                .collect(Collectors.toList());

        return level1Menus;
    }

    @Override
    public void removeMenuByIds(List<Long> list) {
        baseMapper.deleteBatchIds(list);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void move(CategoryMoveDTO dto) {
        Long draggedCatId = dto.getDraggedCatId();
        Long newParentCid = dto.getNewParentCid();
        if (draggedCatId == null || newParentCid == null) {
            throw new IllegalArgumentException("draggedCatId / newParentCid 不能为空");
        }
        CategoryEntity dragged = getById(draggedCatId);
        if (dragged == null) throw new IllegalStateException("分类不存在: " + draggedCatId);
        if (Objects.equals(draggedCatId, newParentCid)) throw new IllegalStateException("不能移动到自身下面");

        int newLevel;
        if (newParentCid == 0L) {
            newLevel = 1;
        } else {
            CategoryEntity newParent = getById(newParentCid);
            if (newParent == null) throw new IllegalStateException("目标父分类不存在: " + newParentCid);
            if (isDescendantOf(newParent, draggedCatId)) {
                throw new IllegalStateException("不能移动到自己的后代分类下");
            }
            newLevel = newParent.getCatLevel() + 1;
        }

        int subtreeHeight = calcSubtreeHeight(draggedCatId);
        if (newLevel + subtreeHeight - 1 > MAX_LEVEL) {
            throw new IllegalStateException(
                    "移动后子树最深层级为 " + (newLevel + subtreeHeight - 1) + "，超过 " + MAX_LEVEL + " 级上限");
        }

        Long oldParentCid = dragged.getParentCid();
        int levelDelta = newLevel - dragged.getCatLevel();
        boolean sameParent = Objects.equals(oldParentCid, newParentCid);

        // 1) 源父 sibling 重排 0..n-1（同父时跳过：dest 那一遍已经覆盖了）
        if (!sameParent) {
            renumberSiblings(oldParentCid, draggedCatId);
        }
        // 2) 目标父：取现有 sibling（排除 dragged 自己，防同父重复）→ 在 position 插入 dragged → 一起重排 0..n-1
        List<CategoryEntity> destSiblings = new ArrayList<>(listSiblingsOrdered(newParentCid, draggedCatId));
        int position = dto.getPosition() == null ? destSiblings.size()
                : Math.max(0, Math.min(dto.getPosition(), destSiblings.size()));
        dragged.setParentCid(newParentCid);
        dragged.setCatLevel(newLevel);
        destSiblings.add(position, dragged);
        IntStream.range(0, destSiblings.size()).forEach(i -> destSiblings.get(i).setSort(i));
        updateBatchById(destSiblings);

        // 3) dragged 子树所有后代 catLevel 级联平移
        if (levelDelta != 0) {
            shiftChildLevels(draggedCatId, levelDelta);
        }
    }

    /* ---------------------- 私有辅助 ---------------------- */

    private static int compareBySort(CategoryEntity a, CategoryEntity b) {
        int sa = a.getSort() == null ? 0 : a.getSort();
        int sb = b.getSort() == null ? 0 : b.getSort();
        return Integer.compare(sa, sb);
    }

    /** 从 node 往上找 parentCid 链，判断 ancestorCatId 是否是它的祖先 */
    private boolean isDescendantOf(CategoryEntity node, Long ancestorCatId) {
        Long cid = node.getParentCid();
        while (cid != null && cid != 0L) {
            if (Objects.equals(cid, ancestorCatId)) return true;
            CategoryEntity p = getById(cid);
            if (p == null) return false;
            cid = p.getParentCid();
        }
        return false;
    }

    /** 以 catId 为根的子树高度：叶子=1 */
    private int calcSubtreeHeight(Long catId) {
        List<CategoryEntity> children = list(new QueryWrapper<CategoryEntity>().eq("parent_cid", catId));
        if (children.isEmpty()) return 1;
        int maxChild = 0;
        for (CategoryEntity c : children) {
            maxChild = Math.max(maxChild, calcSubtreeHeight(c.getCatId()));
        }
        return 1 + maxChild;
    }

    private List<CategoryEntity> listSiblingsOrdered(Long parentCid, Long excludeCatId) {
        QueryWrapper<CategoryEntity> q = new QueryWrapper<CategoryEntity>().eq("parent_cid", parentCid);
        if (excludeCatId != null) q.ne("cat_id", excludeCatId);
        q.orderByAsc("sort", "cat_id");
        return list(q);
    }

    private void renumberSiblings(Long parentCid, Long excludeCatId) {
        List<CategoryEntity> list = new ArrayList<>(listSiblingsOrdered(parentCid, excludeCatId));
        if (list.isEmpty()) return;
        IntStream.range(0, list.size()).forEach(i -> list.get(i).setSort(i));
        updateBatchById(list);
    }

    /** BFS：把 parentCatId 之下所有后代 catLevel 平移 delta */
    private void shiftChildLevels(Long parentCatId, int delta) {
        List<CategoryEntity> frontier = list(new QueryWrapper<CategoryEntity>().eq("parent_cid", parentCatId));
        while (!frontier.isEmpty()) {
            frontier.forEach(e -> e.setCatLevel(e.getCatLevel() + delta));
            updateBatchById(frontier);
            List<Long> ids = frontier.stream().map(CategoryEntity::getCatId).collect(Collectors.toList());
            List<CategoryEntity> next = new ArrayList<>();
            for (Long id : ids) {
                next.addAll(list(new QueryWrapper<CategoryEntity>().eq("parent_cid", id)));
            }
            frontier = next;
        }
    }

    /// 递归查找所有菜单的子菜单
    ///
    /// @param root
    /// @param all
    /// @return
    private List<CategoryEntity> getChildren(CategoryEntity root, List<CategoryEntity> all) {

        return all.stream()
                .filter(categoryEntity -> Objects.equals(categoryEntity.getParentCid(), root.getCatId()))
                .map(categoryEntity -> {
                    categoryEntity.setChildren(getChildren(categoryEntity, all));
                    return categoryEntity;
                })
                .sorted(CategoryServiceImpl::compareBySort)
                .collect(Collectors.toList());
    }
}
