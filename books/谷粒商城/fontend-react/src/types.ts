/** 后端实体与接口响应类型（renren-fast 对照 SPEC-renren-fast-vue.md，gulimall 微服务对照各模块实体） */

export interface R {
  code: number;
  msg?: string;
  [key: string]: unknown;
}

export interface PageData<T = Record<string, any>> {
  totalCount: number;
  pageSize: number;
  totalPage: number;
  currPage: number;
  list: T[];
}

/** /sys/menu/nav 的树节点：子节点挂在 `list` 字段（不是 children） */
export interface MenuNode {
  menuId: number;
  parentId: number;
  name: string;
  type: number; // 0 目录 1 菜单 2 按钮
  url?: string;
  perms?: string;
  icon?: string;
  orderNum?: number;
  list?: MenuNode[];
  parentName?: string;
  children?: MenuNode[];
  _level?: number;
}

export interface SysUser {
  userId: number;
  username: string;
  password?: string;
  salt?: string;
  email: string;
  mobile: string;
  status: number; // 0 禁用 1 正常
  createTime?: string;
  createUserId?: number;
  roleIdList?: number[];
}

export interface SysRole {
  roleId: number;
  roleName: string;
  remark?: string;
  createTime?: string;
  createUserId?: number;
  menuIdList?: number[];
}

export interface SysConfig {
  id: number;
  paramKey: string;
  paramValue: string;
  remark?: string;
}

export interface SysLog {
  id: number;
  username: string;
  operation: string;
  method: string;
  params: string;
  time: number;
  ip: string;
  createDate: string;
}

export interface ScheduleJob {
  jobId: number;
  beanName: string;
  params?: string;
  cronExpression: string;
  status: number; // 0 正常 1 暂停（与 user 相反！）
  remark?: string;
  createTime?: string;
}

export interface ScheduleJobLog {
  logId: number;
  jobId: number;
  beanName: string;
  params?: string;
  status: number; // 0 成功 其他 失败
  error?: string;
  times: number;
  createTime: string;
}

export interface SysOss {
  id: number;
  url: string;
  createDate: string;
}

export interface CloudStorageConfig {
  type?: number; // 1 七牛 2 阿里 3 腾讯
  qiniuDomain?: string;
  qiniuPrefix?: string;
  qiniuAccessKey?: string;
  qiniuSecretKey?: string;
  qiniuBucketName?: string;
  aliyunDomain?: string;
  aliyunPrefix?: string;
  aliyunEndPoint?: string;
  aliyunAccessKeyId?: string;
  aliyunAccessKeySecret?: string;
  aliyunBucketName?: string;
  qcloudDomain?: string;
  qcloudPrefix?: string;
  qcloudAppId?: number;
  qcloudSecretId?: string;
  qcloudSecretKey?: string;
  qcloudBucketName?: string;
  qcloudRegion?: string;
}

/* ------------------------------------------------------------------ *
 * gulimall 微服务（走网关 /gw，接口按模块前缀 /gulimallxxx）
 * ------------------------------------------------------------------ */

/** /gulimallproduct/category/list/tree 的嵌套节点，字段与 CategoryEntity 对齐 */
export interface CategoryNode {
  catId: number;
  name: string;
  parentCid: number;
  catLevel: number;
  showStatus: number; // 逻辑删除标记：0=已删除
  productCount: number;
  sort?: number;
  icon?: string;
  productUnit?: string;
  children?: CategoryNode[];
}

/** /gulimallproduct/brand/list 分页行，字段与 BrandEntity 对齐 */
export interface Brand {
  brandId: number;
  name: string;
  logo?: string;
  descript?: string;
  showStatus: number; // 0=不显示 1=显示
  firstLetter?: string;
  sort?: number;
}

/** /gulimallproduct/attrgroup/list 分页行，字段与 AttrGroupEntity 对齐 */
export interface AttrGroup {
  attrGroupId: number;
  attrGroupName: string;
  sort?: number;
  descript?: string;
  icon?: string;
  catelogId: number;
}

/** /gulimallproduct/attr/list 分页行，字段与 AttrEntity 对齐 */
export interface Attr {
  attrId: number;
  attrName: string;
  searchType: number; // 0=不需要检索 1=需要
  valueType: number; // 0=只能单个值 1=允许多个值
  icon?: string;
  /** 可选值列表：后端注释说逗号分隔，但种子数据用的是分号，展示时两种都切 */
  valueSelect?: string;
  attrType: number; // 0=销售属性 1=基本属性（规格参数）
  enable: number; // 0=禁用 1=启用
  catelogId: number;
  showDesc: number; // 快速展示到介绍：0=否 1=是
}

/** 属性&分组关联；取消关联时后端只认 attrId + attrGroupId 这对组合 */
export interface AttrGroupRelation {
  id?: number;
  attrId: number;
  attrGroupId: number;
  attrSort?: number;
}

/* ------------------------------------------------------------------ *
 * 接口响应类型：统一是 R 信封 + 各自的数据字段，字段名以后端 R.put 为准
 * ------------------------------------------------------------------ */

/** 分页列表统一信封 {code:0, page:{totalCount, list, ...}} */
export type PageRes<T> = R & { page?: PageData<T> };

/** POST body：与后端实体同名，save 不带主键、update 必带 */
export type UserPayload = Partial<SysUser>;
export type RolePayload = Partial<SysRole>;
export type MenuPayload = Partial<MenuNode>;
export type ConfigPayload = Partial<SysConfig>;
export type SchedulePayload = Partial<ScheduleJob>;
export type CategoryPayload = Partial<CategoryNode>;
export type AttrGroupPayload = Partial<AttrGroup>;
export type AttrPayload = Partial<Attr>;

/* ------------------------------ 会员等级 ------------------------------ */

/** /gulimallmember/memberlevel/list 分页行，字段与 MemberLevelEntity 对齐 */
export interface MemberLevel {
  id: number;
  name: string;
  growthPoint: number;
  defaultStatus: number; // 0=不是默认 1=默认
  freeFreightPoint?: number;
  commentGrowthPoint?: number;
  priviledgeFreeFreight: number; // 0/1
  priviledgeMemberPrice: number; // 0/1
  priviledgeBirthday: number; // 0/1
  note?: string;
}

export type MemberLevelPayload = Partial<MemberLevel>;

/* ------------------------------ 发布商品 ------------------------------ */

/** SKU 上的销售属性组合项，落 pms_sku_sale_attr_value */
export interface SkuSaleAttrPayload {
  attrId: number;
  attrName: string;
  attrValue: string;
}

export interface SkuSavePayload {
  skuName: string;
  price?: number;
  stock?: number;
  skuTitle?: string;
  skuSubtitle?: string;
  enable: number; // 0=下架 1=上架
  images: string[];
  saleAttrValues: SkuSaleAttrPayload[];
  /** 满减：满 fullPrice 减 reducePrice，priceStatus=1 生效，落 sms_sku_full_reduction */
  fullPrice?: number;
  reducePrice?: number;
  priceStatus?: number;
  /** 阶梯：满 fullCount 件打 discount 折，countStatus=1 生效，落 sms_sku_ladder */
  fullCount?: number;
  discount?: number;
  countStatus?: number;
  /** 各会员等级专享价，落 sms_member_price */
  memberPrice?: SkuMemberPricePayload[];
}

/** SKU 会员价，对应后端 common.to.MemberPrice */
export interface SkuMemberPricePayload {
  id: number; // memberLevelId
  name: string;
  price?: number;
}

/** SPU 级规格参数，落 pms_product_attr_value */
export interface SpuAttrValuePayload {
  attrId: number;
  attrName: string;
  value: string;
  quickShow: number; // 0=否 1=快速展示在介绍上
}

/** /gulimallproduct/spuinfo/list 分页行，字段与 SpuInfoEntity 对齐 */
export interface SpuItem {
  id: number;
  spuName: string;
  spuDescription?: string;
  catalogId: number;
  brandId: number;
  weight?: number;
  publishStatus: number; // 0=下架 1=上架
  createTime?: string;
  updateTime?: string;
}

/** 发布商品提交体，对应后端 SpuSaveVo */
export interface SpuSavePayload {
  spuName: string;
  catalogId: number;
  brandId: number;
  weight?: number;
  publishStatus: number; // 0=下架 1=上架
  description?: string;
  images: string[];
  attrs: SpuAttrValuePayload[];
  /** 积分设置，Feign 同步 gulimall-coupon sms_spu_bounds */
  bounds?: SpuBoundsPayload;
  skus: SkuSavePayload[];
}

export interface SpuBoundsPayload {
  buyBounds: number;
  growBounds: number;
}

/** 仓库信息，对应 wms_ware_info */
export interface WareInfo {
  id: number;
  name: string;
  address?: string;
  areacode?: string;
}

/** 商品库存，对应 wms_ware_sku */
export interface WareSku {
  id: number;
  skuId: number;
  wareId: number;
  stock: number;
  skuName?: string;
  stockLocked: number;
}

/** 采购单，对应 wms_purchase。status: 0新建 1已分配 2已领取 3已完成 4有异常 */
export interface Purchase {
  id: number;
  assigneeId?: number;
  assigneeName?: string;
  phone?: string;
  priority?: number;
  status: number;
  wareId?: number;
  amount?: number;
  createTime?: string;
  updateTime?: string;
}

/** 采购需求，对应 wms_purchase_detail。status: 0新建 1已分配 2正在采购 3已完成 4采购失败 */
export interface PurchaseDetail {
  id: number;
  purchaseId?: number;
  skuId: number;
  skuNum: number;
  /** 整行小计（数量×商品单价），后端保存时算好 */
  skuPrice?: number;
  wareId: number;
  status: number;
}

/** 合并整单：purchaseId 缺省表示新建采购单 */
export interface PurchaseMergePayload {
  purchaseId?: number;
  items: number[];
}

/** 完成采购：items.status 3=成功入库 4=采购失败 */
export interface PurchaseDonePayload {
  id: number;
  items: { itemId: number; status: number }[];
}

export type LoginRes = R & { token?: string };
/** /sys/user/info（当前登录人）与 /sys/user/info/{id}（详情）同用 user 字段 */
export type UserInfoRes = R & { user?: SysUser };
export type MenuNavRes = R & { menuList?: MenuNode[]; permissions?: string[] };
/** /sys/menu/select 也是 menuList，但是平铺数组且含合成根节点 menuId=0 */
export type MenuSelectRes = R & { menuList?: MenuNode[] };
export type MenuInfoRes = R & { menu?: MenuNode };
export type RoleInfoRes = R & { role?: SysRole };
/** /sys/role/select 的字段名是 list，与 /sys/menu/select 的 menuList 不一致 */
export type RoleSelectRes = R & { list?: SysRole[] };
export type ConfigInfoRes = R & { config?: SysConfig };
export type ScheduleInfoRes = R & { schedule?: ScheduleJob };
export type ScheduleLogInfoRes = R & { log?: ScheduleJobLog };
export type OssConfigRes = R & { config?: CloudStorageConfig };
/** 微服务的 R 用 data 承载列表 */
export type CategoryTreeRes = R & { data?: CategoryNode[] };
/** 分组关联/未关联属性接口同样用 data 承载，但不分页 */
export type AttrListRes = R & { data?: Attr[] };
