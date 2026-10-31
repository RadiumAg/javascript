/**
 * renren-fast 后台接口（基址 /proxyApi -> 网关 /renren-fast/**）。
 * 页面只从这里导入，不再自己拼 URL 和内联响应类型。
 */
import { API_BASE, apiGet, apiGetRaw, apiPost, getToken } from './http';
import type {
  CloudStorageConfig,
  ConfigInfoRes,
  ConfigPayload,
  LoginRes,
  MenuInfoRes,
  MenuNavRes,
  MenuNode,
  MenuPayload,
  MenuSelectRes,
  OssConfigRes,
  PageRes,
  R,
  RoleInfoRes,
  RolePayload,
  RoleSelectRes,
  ScheduleInfoRes,
  ScheduleJob,
  ScheduleJobLog,
  ScheduleLogInfoRes,
  SchedulePayload,
  SysConfig,
  SysLog,
  SysOss,
  SysRole,
  SysUser,
  UserInfoRes,
  UserPayload,
} from '@/types';

/** 列表接口的查询参数：page/limit + 各模块自己的过滤字段 */
export type ListParams = Record<string, any>;

/* ------------------------------ 登录 / 会话 ------------------------------ */

export const captchaUrl = (uuid: string) =>
  `${API_BASE}/captcha.jpg?uuid=${encodeURIComponent(uuid)}`;

export const login = (data: {
  username: string;
  password: string;
  uuid: string;
  captcha: string;
}) => apiPost<LoginRes>('/sys/login', data);

export const logout = () => apiPost<R>('/sys/logout');

/** 当前登录人（无主键的 /sys/user/info） */
export const current = () => apiGet<UserInfoRes>('/sys/user/info');

/** 菜单树 + 权限码，登录后只拉一次 */
export const nav = () => apiGet<MenuNavRes>('/sys/menu/nav');

export const changePassword = (data: { password: string; newPassword: string }) =>
  apiPost<R>('/sys/user/password', data);

/* ------------------------------ 用户 sys/user ------------------------------ */

export const userList = (params: ListParams) => apiGet<PageRes<SysUser>>('/sys/user/list', params);

export const userInfo = (userId: number) => apiGet<UserInfoRes>(`/sys/user/info/${userId}`);

export const userSave = (data: UserPayload) => apiPost<R>('/sys/user/save', data);

export const userUpdate = (data: UserPayload) => apiPost<R>('/sys/user/update', data);

export const userDelete = (userIds: number[]) => apiPost<R>('/sys/user/delete', userIds, { raw: true });

/* ------------------------------ 角色 sys/role ------------------------------ */

export const roleList = (params: ListParams) => apiGet<PageRes<SysRole>>('/sys/role/list', params);

export const roleInfo = (roleId: number) => apiGet<RoleInfoRes>(`/sys/role/info/${roleId}`);

/** 角色下拉（全量，无分页） */
export const roleSelect = () => apiGet<RoleSelectRes>('/sys/role/select');

export const roleSave = (data: RolePayload) => apiPost<R>('/sys/role/save', data);

export const roleUpdate = (data: RolePayload) => apiPost<R>('/sys/role/update', data);

export const roleDelete = (roleIds: number[]) => apiPost<R>('/sys/role/delete', roleIds, { raw: true });

/* ------------------------------ 菜单 sys/menu ------------------------------ */

/** 裸数组响应，没有 code 信封（SPEC D3），带 parentName */
export const menuList = () => apiGetRaw<MenuNode[]>('/sys/menu/list');

export const menuSelect = () => apiGet<MenuSelectRes>('/sys/menu/select');

export const menuInfo = (menuId: number) => apiGet<MenuInfoRes>(`/sys/menu/info/${menuId}`);

export const menuSave = (data: MenuPayload) => apiPost<R>('/sys/menu/save', data);

export const menuUpdate = (data: MenuPayload) => apiPost<R>('/sys/menu/update', data);

/** 菜单删除走路径参数，单条 */
export const menuDelete = (menuId: number) => apiPost<R>(`/sys/menu/delete/${menuId}`);

/* ------------------------------ 参数配置 sys/config ------------------------------ */

export const configList = (params: ListParams) => apiGet<PageRes<SysConfig>>('/sys/config/list', params);

export const configInfo = (id: number) => apiGet<ConfigInfoRes>(`/sys/config/info/${id}`);

export const configSave = (data: ConfigPayload) => apiPost<R>('/sys/config/save', data);

export const configUpdate = (data: ConfigPayload) => apiPost<R>('/sys/config/update', data);

export const configDelete = (ids: number[]) => apiPost<R>('/sys/config/delete', ids, { raw: true });

/* ------------------------------ 操作日志 sys/log ------------------------------ */

export const logList = (params: ListParams) => apiGet<PageRes<SysLog>>('/sys/log/list', params);

/* ------------------------------ 定时任务 sys/schedule ------------------------------ */

export const scheduleList = (params: ListParams) =>
  apiGet<PageRes<ScheduleJob>>('/sys/schedule/list', params);

export const scheduleInfo = (jobId: number) => apiGet<ScheduleInfoRes>(`/sys/schedule/info/${jobId}`);

export const scheduleSave = (data: SchedulePayload) => apiPost<R>('/sys/schedule/save', data);

export const scheduleUpdate = (data: SchedulePayload) => apiPost<R>('/sys/schedule/update', data);

/** delete/pause/resume/run 四个动作同一套批量入参 */
export type ScheduleAction = 'delete' | 'pause' | 'resume' | 'run';

export const scheduleAction = (action: ScheduleAction, jobIds: number[]) =>
  apiPost<R>(`/sys/schedule/${action}`, jobIds, { raw: true });

export const scheduleLogList = (params: ListParams) =>
  apiGet<PageRes<ScheduleJobLog>>('/sys/scheduleLog/list', params);

export const scheduleLogInfo = (logId: number) => apiGet<ScheduleLogInfoRes>(`/sys/scheduleLog/info/${logId}`);

/* ------------------------------ 文件服务 sys/oss ------------------------------ */

export const ossList = (params: ListParams) => apiGet<PageRes<SysOss>>('/sys/oss/list', params);

/** 直传 Upload 组件的 action，token 只能放 query（组件不走 axios 拦截器） */
export const ossUploadUrl = () => `${API_BASE}/sys/oss/upload?token=${encodeURIComponent(getToken())}`;

export const ossConfig = () => apiGet<OssConfigRes>('/sys/oss/config');

export const ossSaveConfig = (data: CloudStorageConfig) => apiPost<R>('/sys/oss/saveConfig', data);

export const ossDelete = (ids: number[]) => apiPost<R>('/sys/oss/delete', ids, { raw: true });
