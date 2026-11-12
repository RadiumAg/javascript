import { Tag } from 'antd';
import type { ReactNode } from 'react';

/** 采购单状态，与后端 PurchaseConstant.PurchaseStatus 对齐 */
export const PURCHASE_STATUS = [
  { value: 0, label: '新建', color: 'default' },
  { value: 1, label: '已分配', color: 'blue' },
  { value: 2, label: '已领取', color: 'orange' },
  { value: 3, label: '已完成', color: 'green' },
  { value: 4, label: '有异常', color: 'red' },
] as const;

/** 采购需求状态，与后端 PurchaseConstant.DetailStatus 对齐 */
export const DETAIL_STATUS = [
  { value: 0, label: '新建', color: 'default' },
  { value: 1, label: '已分配', color: 'blue' },
  { value: 2, label: '正在采购', color: 'orange' },
  { value: 3, label: '已完成', color: 'green' },
  { value: 4, label: '采购失败', color: 'red' },
] as const;

type StatusItem = { value: number; label: string; color: string };

export const statusOptions = (list: readonly StatusItem[]) =>
  list.map(({ value, label }) => ({ value, label }));

export const statusTag = (list: readonly StatusItem[], value?: number): ReactNode => {
  const hit = list.find((s) => s.value === value);
  if (!hit) return value ?? '-';
  return <Tag color={hit.color}>{hit.label}</Tag>;
};
