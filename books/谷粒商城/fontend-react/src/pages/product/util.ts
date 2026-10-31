import type { Key } from 'react';
import type { CategoryNode } from '@/types';

export function flattenCatIds(nodes: CategoryNode[]): (string | number)[] {
  return nodes.flatMap((n) => [
    n.catId,
    ...(n.children ? flattenCatIds(n.children) : []),
  ]);
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
