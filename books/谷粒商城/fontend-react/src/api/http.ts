import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import type { PageData, R } from '@/types';

/**
 * dev 流量都经 vite 代理转发到网关（.env.development 的 VITE_API_TARGET，本机为 http://localhost:8087）：
 *  - API_BASE  /proxyApi -> 网关 /renren-fast/**（renren-fast 后台，含 context-path）
 *  - MICRO_BASE /gw      -> 网关原样路径，用于 /gulimallproduct/** 等微服务接口
 * 浏览器侧始终同源，因此网关不需要配 CORS。
 */
export const API_BASE = '/proxyApi';
export const MICRO_BASE = '/gw';

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

function createClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });

  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers['token'] = token;
    // 对应 Vue 版 adornParams：GET 一律附加缓存参数 t
    if ((config.method ?? 'get').toLowerCase() === 'get') {
      config.params = { t: Date.now(), ...(config.params ?? {}) };
    }
    return config;
  });

  client.interceptors.response.use((response) => {
    const data = response.data as R | undefined;
    // 后端 token 失效返回 HTTP 200 + {code:401}
    if (data && data.code === 401) onUnauthorized();
    return response;
  });

  return client;
}

const renrenClient = createClient(API_BASE);
const microClient = createClient(MICRO_BASE);

/** JSON POST 的 body 组装：与 Vue 版 adornData 对齐（默认在 body 里附加 t，后端 DTO 会忽略） */
function buildPayload(data?: unknown, raw = false): unknown {
  if (data === undefined) return raw ? undefined : { t: Date.now() };
  return raw ? data : { t: Date.now(), ...(data as object) };
}

/** GET，自动带 t，返回整个 data 对象 */
export async function apiGet<T = R>(url: string, params?: Record<string, any>): Promise<T> {
  const res = await renrenClient.get<T>(url, { params } as AxiosRequestConfig);
  return res.data;
}

/** 裸数组接口（如 /sys/menu/list 无 code 信封） */
export async function apiGetRaw<T>(url: string, params?: Record<string, any>): Promise<T> {
  const res = await renrenClient.get<T>(url, { params } as AxiosRequestConfig);
  return res.data as unknown as T;
}

export async function apiPost<T = R>(
  url: string,
  data?: unknown,
  opts: { raw?: boolean } = {}
): Promise<T> {
  const res = await renrenClient.post<T>(url, buildPayload(data, opts.raw));
  return res.data;
}

/** —— 以下是走网关打微服务的同一套方法，只是基址换成 /gw —— */

export async function microGet<T = R>(url: string, params?: Record<string, any>): Promise<T> {
  const res = await microClient.get<T>(url, { params } as AxiosRequestConfig);
  return res.data;
}

export async function microGetRaw<T>(url: string, params?: Record<string, any>): Promise<T> {
  const res = await microClient.get<T>(url, { params } as AxiosRequestConfig);
  return res.data as unknown as T;
}

export async function microPost<T = R>(
  url: string,
  data?: unknown,
  opts: { raw?: boolean } = {}
): Promise<T> {
  const res = await microClient.post<T>(url, buildPayload(data, opts.raw));
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
