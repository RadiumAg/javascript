/**
 * gulimall 微服务接口（基址 /gw -> 网关原样路径，按模块前缀 /gulimallxxx）。
 * 目前只接了 product 的商品分类 CRUD。
 */
import { microGet, microPost } from './http';
import type { CategoryNode, CategoryPayload, CategoryTreeRes, R } from '@/types';

export const categoryTree = () =>
  microGet<CategoryTreeRes>('/gulimallproduct/category/list/tree');

export const categorySave = (data: CategoryPayload) =>
  microPost<R>('/gulimallproduct/category/save', data);

export const categoryUpdate = (data: CategoryPayload) =>
  microPost<R>('/gulimallproduct/category/update', data);

/** 后端是 @RequestBody Long[]，空数组会拼出 IN () 直接报错，调用方自己保证非空 */
export const categoryDelete = (catIds: number[]) =>
  microPost<R>('/gulimallproduct/category/delete', catIds, { raw: true });

/**
 * 拖拽排序落库：后端只有单条 /update，这里并发提交；listWithTree 按 sort 升序排，
 * 所以把 siblings 的新下标直接写回 sort。跳过 sort 已经等于目标下标的节点，减少一次全量刷新。
 * 任一失败即抛出，调用方负责回滚 UI。
 */
export async function categorySortBatch(siblings: CategoryNode[]) {
  const tasks = siblings
    .map((n, i) => ({ node: n, sort: i }))
    .filter(({ node, sort }) => (node.sort ?? 0) !== sort)
    .map(({ node, sort }) =>
      categoryUpdate({ catId: node.catId, sort }).then((res) => {
        if (res.code !== 0) throw new Error(res.msg || `catId=${node.catId} 排序保存失败`);
      }),
    );
  await Promise.all(tasks);
}

/**
 * 跨父移动：后端 @Transactional 里一次完成 parentCid/catLevel 级联/sort 重排 + 层级上限/循环校验。
 * position 缺省追加末尾。业务失败返回 code=400，msg 是原因。
 */
export const categoryMove = (data: {
  draggedCatId: number;
  newParentCid: number;
  position?: number;
}) => microPost<R>('/gulimallproduct/category/move', data);
