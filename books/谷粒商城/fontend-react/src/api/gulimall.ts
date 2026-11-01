/**
 * gulimall 微服务接口（基址 /gw -> 网关原样路径，按模块前缀 /gulimallxxx）。
 * 目前只接了 product 的商品分类 CRUD。
 */
import { MICRO_BASE, microGet, microPost } from './http';
import type {
  Brand,
  CategoryNode,
  CategoryPayload,
  CategoryTreeRes,
  PageRes,
  R,
} from '@/types';
import type { ListParams } from './renren';

/** 与后端 BrandEntity 同名字段，save 不带主键、update 必带 */
export type BrandPayload = Partial<Brand>;

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

/** /gulimallproduct/brand/list 分页：入参沿用 renren-generator 通用 {page, limit, ...过滤} */
export const brandList = (params: ListParams) =>
  microGet<PageRes<Brand>>('/gulimallproduct/brand/list', params);

export const brandSave = (data: BrandPayload) =>
  microPost<R>('/gulimallproduct/brand/save', data);

export const brandUpdate = (data: BrandPayload) =>
  microPost<R>('/gulimallproduct/brand/update', data);

/** 后端是 @RequestBody Long[]，空数组会拼出 IN () 报错，调用方自己保证非空 */
export const brandDelete = (brandIds: number[]) =>
  microPost<R>('/gulimallproduct/brand/delete', brandIds, { raw: true });

/* ------------------- 文件上传（gulimall-third-part） ------------------- */
// 上传接口在第三方服务，走网关 /gw -> /gulimallthirdpart/upload/**；第三方服务无鉴权，不带 token。
// ImageUpload 组件用原生 fetch/XHR（不走 axios 拦截器），所以这里只拼 URL 字符串。

/** 图片上传（后端未配 COS 时落本地磁盘，见 gulimall.upload / gulimall.cos 配置） */
export const imageUploadUrl = () => `${MICRO_BASE}/gulimallthirdpart/upload/image`;

/** 腾讯云 COS 直传签名（后端未配 COS 时返回 code!=0，前端回退到后端转发上传）；调用方自行拼 ?ext= */
export const cosSignatureUrl = () => `${MICRO_BASE}/gulimallthirdpart/upload/cos-signature`;
