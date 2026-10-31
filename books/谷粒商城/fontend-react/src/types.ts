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
