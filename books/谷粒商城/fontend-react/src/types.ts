/** renren-fast 后端实体/响应类型（对照 SPEC-renren-fast-vue.md） */

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
