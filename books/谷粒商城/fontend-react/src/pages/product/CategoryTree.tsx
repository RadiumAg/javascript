import { useMemo, useState, type Key } from 'react';
import { Alert, Button, Card, Flex, Input, Spin, Tree } from 'antd';
import { useMount } from 'ahooks';
import { gulimallApi } from '@/api';
import type { CategoryNode } from '@/types';
import { filterCategoryTree, flattenCatIds } from './util';

type Props = {
  selectedCatId?: number;
  /** 再次点击已选中节点会取消选择，此时 catId/node 都是 undefined（= 不限分类） */
  onSelect: (catId?: number, node?: CategoryNode) => void;
};

/** 属性分组/规格参数/销售属性三个页面共用的左侧分类树 */
export function CategoryTree({ selectedCatId, onSelect }: Props) {
  const [rows, setRows] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Key[]>([]);

  useMount(() => {
    setLoading(true);
    gulimallApi
      .categoryTree()
      .then((res) => {
        if (res.code !== 0) {
          setError(res.msg || '分类加载失败');
          return;
        }
        setRows(res.data ?? []);
      })
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  });

  const kw = search.trim();
  const treeData = useMemo(() => filterCategoryTree(rows, kw), [rows, kw]);

  return (
    <Card
      size="small"
      title="商品分类"
      extra={
        <Button
          type="link"
          size="small"
          disabled={selectedCatId === undefined}
          onClick={() => onSelect(undefined, undefined)}
        >
          全部
        </Button>
      }
    >
      <Flex vertical gap={8}>
        <Input.Search
          placeholder="搜索分类名"
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {error && <Alert type="error" showIcon message={error} />}
        <Spin spinning={loading}>
          <div style={{ maxHeight: 'calc(100vh - 260px)', overflow: 'auto' }}>
            <Tree<CategoryNode>
              blockNode
              treeData={treeData}
              fieldNames={{ title: 'name', key: 'catId', children: 'children' }}
              selectedKeys={selectedCatId === undefined ? [] : [selectedCatId]}
              expandedKeys={kw ? flattenCatIds(treeData) : expanded}
              onExpand={(keys) => setExpanded(keys)}
              onSelect={(keys, info) => {
                if (!keys.length) {
                  onSelect(undefined, undefined);
                  return;
                }
                onSelect(Number(keys[0]), info.node as CategoryNode);
              }}
            />
          </div>
        </Spin>
      </Flex>
    </Card>
  );
}