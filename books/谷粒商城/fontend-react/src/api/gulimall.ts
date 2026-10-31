/**
 * gulimall 微服务接口（基址 /gw -> 网关原样路径，按模块前缀 /gulimallxxx）。
 * 目前只接了 product 的商品分类 CRUD。
 */
import { microGet, microPost } from './http';
import type { CategoryPayload, CategoryTreeRes, R } from '@/types';

export const categoryTree = () => microGet<CategoryTreeRes>('/gulimallproduct/category/list/tree');

export const categorySave = (data: CategoryPayload) =>
  microPost<R>('/gulimallproduct/category/save', data);

export const categoryUpdate = (data: CategoryPayload) =>
  microPost<R>('/gulimallproduct/category/update', data);

/** 后端是 @RequestBody Long[]，空数组会拼出 IN () 直接报错，调用方自己保证非空 */
export const categoryDelete = (catIds: number[]) =>
  microPost<R>('/gulimallproduct/category/delete', catIds, { raw: true });
