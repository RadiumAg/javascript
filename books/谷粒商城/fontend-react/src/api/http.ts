import axios from 'axios';
import { message } from 'antd';
import type { PageData, R } from '@/types';

/** dev 走 vite 代理 /proxyApi -> http://localhost:8080/renren-fast */
export const API_BASE = '/proxyApi';

export function getToken(): string {
  const m = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : '';
}
export function setToken(token: string): void {
  document.cookie = `token=${encodeURIComponent(token)}; path=/`;
}
export function removeToken(): void {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

/** token 失效时的回调（main.tsx 里注入，避免 http <-> store 循环依赖） */
let onUnauthorized: () => void = () => {};
export function setUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn;
}

const instance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json; charset=utf-8' }
});

instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers['token'] = token;
  // 对应 Vue 版 adornParams：GET 一律附加缓存参数 t
  if ((config.method ?? 'get').toLowerCase() === 'get') {
    config.params = { t: Date.now(), ...(config.params ?? {}) };
  }
  return config;
});

instance.interceptors.response.use((response) => {
  const data = response.data as R | undefined;
  // 后端 token 失效返回 HTTP 200 + {code:401}
  if (data && data.code === 401) onUnauthorized();
  return response;
});

/** GET，自动带 t，返回整个 data 对象 */
export async function apiGet<T = R>(url: string, params?: Record<string, any>): Promise<T> {
  const res = await instance.get<T>(url, { params });
  return res.data;
}

/** 裸数组接口（如 /sys/menu/list 无 code 信封） */
export async function apiGetRaw<T>(url: string, params?: Record<string, any>): Promise<T> {
  const res = await instance.get<T>(url, { params });
  return res.data as unknown as T;
}

/** JSON POST；openDefaultData 与 Vue 版 adornData 对齐（默认在 body 里附加 t，后端 DTO 会忽略） */
export async function apiPost<T = R>(
  url: string,
  data?: unknown,
  opts: { raw?: boolean } = {}
): Promise<T> {
  const payload =
    data === undefined ? (opts.raw ? undefined : { t: Date.now() })
    : opts.raw ? data
    : { t: Date.now(), ...(data as object) };
  const res = await instance.post<T>(url, payload);
  return res.data;
}

/** 业务 R 校验：code!==0 弹错并返回 false */
export function assertOk(data: R): boolean {
  if (!data || data.code !== 0) {
    message.error((data && (data.msg as string)) || '请求失败');
    return false;
  }
  return true;
}

export type { PageData };
