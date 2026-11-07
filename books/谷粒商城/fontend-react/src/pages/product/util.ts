import type { Key } from 'react';
import type { CategoryNode } from '@/types';

export function flattenCatIds(nodes: CategoryNode[]): (string | number)[] {
  return nodes.flatMap((n) => [
    n.catId,
    ...(n.children ? flattenCatIds(n.children) : []),
  ]);
}

/** 命中节点保留整棵子树；未命中但有后代命中的保留为路径节点 */
export function filterCategoryTree(
  nodes: CategoryNode[],
  kw: string,
): CategoryNode[] {
  if (!kw) return nodes;
  const lower = kw.toLowerCase();
  const walk = (list: CategoryNode[]): CategoryNode[] =>
    list.flatMap((n) => {
      if (n.name.toLowerCase().includes(lower)) return [n];
      const children = walk(n.children ?? []);
      return children.length ? [{ ...n, children }] : [];
    });
  return walk(nodes);
}

export function findNodePath(
  nodes: CategoryNode[],
  id: Key,
  parentPath: number[] = [],
): { parentPath: number[]; index: number } | null {
  for (let i = 0; i < nodes.length; i++) {
    if (String(nodes[i].catId) === String(id)) {
      return { parentPath, index: i };
    }
    if (nodes[i].children) {
      const found = findNodePath(nodes[i].children!, id, [...parentPath, i]);
      if (found) return found;
    }
  }
  return null;
}

export function getListByPath(
  nodes: CategoryNode[],
  path: number[],
): CategoryNode[] {
  let list = nodes;
  for (const idx of path) {
    list = list[idx].children ?? [];
  }
  return list;
}

export function updateListByPath(
  nodes: CategoryNode[],
  path: number[],
  newList: CategoryNode[],
): CategoryNode[] {
  if (path.length === 0) return newList;
  const [idx, ...rest] = path;
  return nodes.map((n, i) =>
    i === idx
      ? { ...n, children: updateListByPath(n.children ?? [], rest, newList) }
      : n,
  );
}

export function isSameParent(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/** findNodePath 的返回 -> 完整节点路径（比 parentPath 多一级 index） */
export function pathOf(loc: { parentPath: number[]; index: number }): number[] {
  return [...loc.parentPath, loc.index];
}

/** 按完整节点路径取节点 */
export function findNodeByPath(
  nodes: CategoryNode[],
  path: number[],
): CategoryNode | null {
  if (path.length === 0) return null;
  let list = nodes;
  let cur: CategoryNode | undefined;
  for (const idx of path) {
    cur = list[idx];
    if (!cur) return null;
    list = cur.children ?? [];
  }
  return cur ?? null;
}

/** ancestorPath 是不是 descendantPath 的严格前缀（即 descendant 是 ancestor 的后代） */
export function isDescendantPath(
  ancestorPath: number[],
  descendantPath: number[],
): boolean {
  if (descendantPath.length <= ancestorPath.length) return false;
  return ancestorPath.every((v, i) => descendantPath[i] === v);
}

/** 子树最大深度：叶子=1 */
export function subtreeDepth(node: CategoryNode): number {
  if (!node.children?.length) return 1;
  return 1 + Math.max(...node.children.map(subtreeDepth));
}

/** 把 path 指向的节点从树里摘掉；返回 [新树, 摘出的节点] */
export function detachNode(
  nodes: CategoryNode[],
  path: number[],
): [CategoryNode[], CategoryNode] {
  const [head, ...tail] = path;
  const node = nodes[head];
  if (tail.length === 0) {
    return [nodes.filter((_, i) => i !== head), node];
  }
  const [newChildren, removed] = detachNode(node.children ?? [], tail);
  return [
    nodes.map((n, i) => (i === head ? { ...n, children: newChildren } : n)),
    removed,
  ];
}

/** 把 child 挂到 parentPath 指向节点的 children 末尾；parentPath 空数组 = 顶层追加 */
export function attachAsChild(
  nodes: CategoryNode[],
  parentPath: number[],
  child: CategoryNode,
): CategoryNode[] {
  if (parentPath.length === 0) return [...nodes, child];
  const [head, ...tail] = parentPath;
  return nodes.map((n, i) => {
    if (i !== head) return n;
    if (tail.length === 0) {
      return { ...n, children: [...(n.children ?? []), child] };
    }
    return { ...n, children: attachAsChild(n.children ?? [], tail, child) };
  });
}

/** 平移整棵子树的 catLevel；顶层同时改 parentCid */
export function shiftSubtreeLevels(
  node: CategoryNode,
  delta: number,
  newParentCid?: number,
): CategoryNode {
  const next: CategoryNode = {
    ...node,
    catLevel: node.catLevel + delta,
    ...(newParentCid !== undefined ? { parentCid: newParentCid } : {}),
  };
  if (next.children?.length) {
    next.children = next.children.map((c) => shiftSubtreeLevels(c, delta));
  }
  return next;
}
