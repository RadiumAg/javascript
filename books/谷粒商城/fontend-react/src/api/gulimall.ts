/**
 * gulimall 微服务接口（基址 /gw -> 网关原样路径，按模块前缀 /gulimallxxx）。
 * 覆盖 product 的分类/品牌/属性分组，以及 third-part 的文件上传。
 */
import { MICRO_BASE, microGet, microPost } from './http';
import type {
  Attr,
  AttrGroup,
  AttrGroupPayload,
  AttrGroupRelation,
  AttrListRes,
  AttrPayload,
  Brand,
  CategoryNode,
  CategoryPayload,
  CategoryTreeRes,
  MemberLevel,
  MemberLevelPayload,
  PageRes,
  Purchase,
  PurchaseDetail,
  PurchaseDonePayload,
  PurchaseMergePayload,
  R,
  SpuItem,
  SpuSavePayload,
  WareInfo,
  WareSku,
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

/** 分类关联的品牌，返回 BrandVo[{brandId, brandName}]，发布商品选品牌用 */
export const categoryBrands = (catId: number) =>
  microGet<R & { data?: { brandId: number; brandName: string }[] }>(
    '/gulimallproduct/categorybrandrelation/brands/list',
    { catId },
  );

export const brandSave = (data: BrandPayload) =>
  microPost<R>('/gulimallproduct/brand/save', data);

export const brandUpdate = (data: BrandPayload) =>
  microPost<R>('/gulimallproduct/brand/update', data);

/** 后端是 @RequestBody Long[]，空数组会拼出 IN () 报错，调用方自己保证非空 */
export const brandDelete = (brandIds: number[]) =>
  microPost<R>('/gulimallproduct/brand/delete', brandIds, { raw: true });

/* ------------------- 属性分组（gulimall-product） ------------------- */

/** 过滤：catelogId（0/缺省=不限）、key（组名 like 或组id eq） */
export const attrGroupList = (params: ListParams) =>
  microGet<PageRes<AttrGroup>>('/gulimallproduct/attrgroup/list', params);

export const attrGroupSave = (data: AttrGroupPayload) =>
  microPost<R>('/gulimallproduct/attrgroup/save', data);

export const attrGroupUpdate = (data: AttrGroupPayload) =>
  microPost<R>('/gulimallproduct/attrgroup/update', data);

/** 后端删分组时会连带清掉组内关联；空数组会拼出 IN () 报错，调用方自己保证非空 */
export const attrGroupDelete = (attrGroupIds: number[]) =>
  microPost<R>('/gulimallproduct/attrgroup/delete', attrGroupIds, { raw: true });

/** 组内已关联的基本属性，按 attrSort 升序 */
export const attrGroupRelationAttrs = (attrGroupId: number) =>
  microGet<AttrListRes>(`/gulimallproduct/attrgroup/attr/relation/${attrGroupId}`);

/** 该分类下还没进任何分组的基本属性，供关联弹窗挑选 */
export const attrGroupNoRelationAttrs = (catelogId: number) =>
  microGet<AttrListRes>(`/gulimallproduct/attrgroup/attr/norelation/${catelogId}`);

/** body 是裸数组，必须 raw:true，否则 buildPayload 会把数组摊进对象 */
export const attrGroupRelationSave = (relations: AttrGroupRelation[]) =>
  microPost<R>('/gulimallproduct/attrgroup/attr/relation', relations, { raw: true });

/** 取消关联只需 attrId + attrGroupId 这对组合 */
export const attrGroupRelationDelete = (relations: AttrGroupRelation[]) =>
  microPost<R>('/gulimallproduct/attrgroup/attr/relation/delete', relations, { raw: true });

/* ------------------- 规格参数 / 销售属性（gulimall-product） ------------------- */

/** 过滤：catelogId（0/缺省=不限）、attrType（1=基本属性 0=销售属性）、key（属性名 like 或属性id eq） */
export const attrList = (params: ListParams) =>
  microGet<PageRes<Attr>>('/gulimallproduct/attr/list', params);

export const attrSave = (data: AttrPayload) =>
  microPost<R>('/gulimallproduct/attr/save', data);

export const attrUpdate = (data: AttrPayload) =>
  microPost<R>('/gulimallproduct/attr/update', data);

/** 后端是 @RequestBody Long[]，空数组会拼出 IN () 报错，调用方自己保证非空 */
export const attrDelete = (attrIds: number[]) =>
  microPost<R>('/gulimallproduct/attr/delete', attrIds, { raw: true });

/* ------------------- 会员等级（gulimall-member） ------------------- */

export const memberLevelList = (params: ListParams) =>
  microGet<PageRes<MemberLevel>>('/gulimallmember/memberlevel/list', params);

/** 发布商品选会员等级用，全量返回在 data */
export const memberLevelSelect = () =>
  microGet<R & { data?: MemberLevel[] }>('/gulimallmember/memberlevel/select');

export const memberLevelSave = (data: MemberLevelPayload) =>
  microPost<R>('/gulimallmember/memberlevel/save', data);

export const memberLevelUpdate = (data: MemberLevelPayload) =>
  microPost<R>('/gulimallmember/memberlevel/update', data);

/** 后端是 @RequestBody Long[]，空数组会拼出 IN () 报错，调用方自己保证非空 */
export const memberLevelDelete = (ids: number[]) =>
  microPost<R>('/gulimallmember/memberlevel/delete', ids, { raw: true });

/* ------------------- 发布商品（gulimall-product） ------------------- */

/** 发布商品：后端一次事务落 7 张表，并 Feign 同步库存到 gulimall-ware */
export const spuSave = (data: SpuSavePayload) =>
  microPost<R>('/gulimallproduct/spuinfo/save', data);

/** spu 管理列表：后端 queryPageByCondition 读 key/status/brandId/catalogId（都传，空串=不限） */
export const spuList = (params: ListParams) =>
  microGet<PageRes<SpuItem>>('/gulimallproduct/spuinfo/list', params);

/** 只改 publishStatus 等字段的局部更新（updateById 忽略 null 字段） */
export const spuUpdate = (data: Partial<SpuItem> & { id: number }) =>
  microPost<R>('/gulimallproduct/spuinfo/update', data);

export const spuDelete = (ids: number[]) =>
  microPost<R>('/gulimallproduct/spuinfo/delete', ids, { raw: true });

/* ------------------- 库存系统（gulimall-ware） ------------------- */

/** 仓库维护：key 匹配仓库名 like 或 id eq */
export const wareInfoList = (params: ListParams) =>
  microGet<PageRes<WareInfo>>('/gulimallware/wareinfo/list', params);

export const wareInfoSave = (data: Partial<WareInfo>) =>
  microPost<R>('/gulimallware/wareinfo/save', data);

export const wareInfoUpdate = (data: Partial<WareInfo> & { id: number }) =>
  microPost<R>('/gulimallware/wareinfo/update', data);

export const wareInfoDelete = (ids: number[]) =>
  microPost<R>('/gulimallware/wareinfo/delete', ids, { raw: true });

/** 商品库存：按 skuId / wareId 精确过滤 */
export const wareSkuList = (params: ListParams) =>
  microGet<PageRes<WareSku>>('/gulimallware/waresku/list', params);

/** skuName 留空时后端远程查商品服务补上 */
export const wareSkuSave = (data: Partial<WareSku>) =>
  microPost<R>('/gulimallware/waresku/save', data);

export const wareSkuUpdate = (data: Partial<WareSku> & { id: number }) =>
  microPost<R>('/gulimallware/waresku/update', data);

export const wareSkuDelete = (ids: number[]) =>
  microPost<R>('/gulimallware/waresku/delete', ids, { raw: true });

/** 采购需求：key 匹配采购单id/skuId，另有 status、wareId、purchaseId 过滤 */
export const purchaseDetailList = (params: ListParams) =>
  microGet<PageRes<PurchaseDetail>>('/gulimallware/purchasedetail/list', params);

export const purchaseDetailSave = (data: Partial<PurchaseDetail>) =>
  microPost<R>('/gulimallware/purchasedetail/save', data);

export const purchaseDetailUpdate = (data: Partial<PurchaseDetail> & { id: number }) =>
  microPost<R>('/gulimallware/purchasedetail/update', data);

export const purchaseDetailDelete = (ids: number[]) =>
  microPost<R>('/gulimallware/purchasedetail/delete', ids, { raw: true });

/** 采购单：key 匹配采购单id/采购人名，status 过滤状态 */
export const purchaseList = (params: ListParams) =>
  microGet<PageRes<Purchase>>('/gulimallware/purchase/list', params);

/** 未领取（新建/已分配）的采购单，合并整单弹窗里选 */
export const purchaseUnreceiveList = (params: ListParams) =>
  microGet<PageRes<Purchase>>('/gulimallware/purchase/unreceive/list', params);

export const purchaseSave = (data: Partial<Purchase>) =>
  microPost<R>('/gulimallware/purchase/save', data);

/** 分配采购人员也走这个接口：带 assigneeId/assigneeName/phone + status=1 */
export const purchaseUpdate = (data: Partial<Purchase> & { id: number }) =>
  microPost<R>('/gulimallware/purchase/update', data);

export const purchaseDelete = (ids: number[]) =>
  microPost<R>('/gulimallware/purchase/delete', ids, { raw: true });

export const purchaseMerge = (data: PurchaseMergePayload) =>
  microPost<R>('/gulimallware/purchase/merge', data);

/** body 是裸数组 List<Long> */
export const purchaseReceived = (ids: number[]) =>
  microPost<R>('/gulimallware/purchase/received', ids, { raw: true });

/** 完成采购：成功的需求入库，任一失败整单标记异常 */
export const purchaseDone = (data: PurchaseDonePayload) =>
  microPost<R>('/gulimallware/purchase/done', data);

/* ------------------- 文件上传（gulimall-third-part） ------------------- */
// 上传接口在第三方服务，走网关 /gw -> /gulimallthirdpart/upload/**；第三方服务无鉴权，不带 token。
// ImageUpload 组件用原生 fetch/XHR（不走 axios 拦截器），所以这里只拼 URL 字符串。

/** 图片上传（后端未配 COS 时落本地磁盘，见 gulimall.upload / gulimall.cos 配置） */
export const imageUploadUrl = () => `${MICRO_BASE}/gulimallthirdpart/upload/image`;

/** 腾讯云 COS 直传签名（后端未配 COS 时返回 code!=0，前端回退到后端转发上传）；调用方自行拼 ?ext= */
export const cosSignatureUrl = () => `${MICRO_BASE}/gulimallthirdpart/upload/cos-signature`;
