import type { MenuNode } from '@/types';

/** 对应 Vue 版 utils/index.js getUUID（captcha uuid 只需唯一，不必 RFC4122） */
export function getUUID(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const isEmail = (v: string) => /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(v);
export const isMobile = (v: string) => /^1[0-9]{10}$/.test(v);
export const isURL = (v?: string) => !!v && /^http[s]?:\/\/.*/.test(v);

/**
 * 对应 utils/index.js treeDataTranslate：平铺数组 -> children 树
 * （/sys/menu/list 返回平铺数组，无 code 信封）
 */
export function treeDataTranslate<T extends Record<string, any>>(
  data: T[],
  id: string | ((item: T) => string | number) = 'id',
  pid: string | ((item: T) => string | number) = 'parentId'
): T[] {
  const keyOf = (item: T, kind: string | ((i: T) => string | number)) =>
    (typeof kind === 'function' ? kind(item) : (item[kind] as string | number)) ?? '';
  const all: Record<string, T> = {};
  const clones = data.map((d) => {
    const c = { ...d, children: [] as T[], _level: 0 } as any;
    all[String(keyOf(c, id))] = c;
    return c;
  });
  const roots: T[] = [];
  clones.forEach((item) => {
    const parent = all[String(keyOf(item, pid))];
    if (parent && parent !== item && keyOf(item, id) !== keyOf(item, pid)) {
      (parent as any)._level = ((parent as any)._level ?? 0) + 1;
      ((parent as any).children as T[]).push(item);
    } else {
      roots.push(item);
    }
  });
  return roots;
}

/** nav 树（children 在 `list` 字段）里的全部叶子菜单（type=1 且有 url） */
export function flattenNavMenus(nodes: MenuNode[], acc: MenuNode[] = []): MenuNode[] {
  nodes.forEach((n) => {
    if (n.list && n.list.length > 0) flattenNavMenus(n.list, acc);
    else if (n.url && /\S/.test(n.url)) acc.push(n);
  });
  return acc;
}

/** 动态菜单 url -> 路由 path（对齐 Vue 版 path 规则：去头 / ，'/'->'-' 的是 route name，这里直接用 /url 作 path） */
export function menuUrlToPath(url: string): string {
  return '/' + url.replace(/^\//, '');
}
