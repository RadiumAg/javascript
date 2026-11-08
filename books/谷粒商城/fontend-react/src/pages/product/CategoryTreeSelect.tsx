import { useState } from 'react';
import { TreeSelect } from 'antd';
import type { CSSProperties } from 'react';
import { useMount } from 'ahooks';
import { gulimallApi } from '@/api';
import type { CategoryNode } from '@/types';

type Props = {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  style?: CSSProperties;
};

/** 表单里的所属分类选择器，可直接作为 Form.Item 的受控子组件 */
export function CategoryTreeSelect({ value, onChange, disabled, style }: Props) {
  const [treeData, setTreeData] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(false);

  useMount(() => {
    setLoading(true);
    gulimallApi
      .categoryTree()
      .then((res) => {
        if (res.code === 0) setTreeData(res.data ?? []);
      })
      .finally(() => setLoading(false));
  });

  return (
    <TreeSelect
      value={value}
      onChange={onChange}
      disabled={disabled}
      loading={loading}
      treeData={treeData}
      fieldNames={{ label: 'name', value: 'catId', children: 'children' }}
      placeholder="选择所属分类"
      showSearch
      treeNodeFilterProp="name"
      allowClear
      style={{ width: '100%', ...style }}
    />
  );
}