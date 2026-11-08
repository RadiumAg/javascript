import { useMemo, useState, type FC } from 'react';
import { Button, Card, Flex, Input, Space, Table, Tag } from 'antd';
import { useMemoizedFn, useMount } from 'ahooks';
import { assertOk, gulimallApi } from '@/api';
import { confirm, message } from '@/api/feedback';
import { paginationProps, usePageList } from '@/hooks/usePageList';
import type { Attr, CategoryNode } from '@/types';
import { CategoryTree } from './CategoryTree';
import { buildAttrColumns } from './attrColumns';
import { useCreateOrEditAttrForm } from './useCreateOrEditAttrForm';

type Filter = { catelogId?: number; key?: string; attrType: number };

const BaseAttrPage: FC = () => {
  const [filter, setFilter] = useState<Filter>({ attrType: 1 });
  const [catName, setCatName] = useState('');
  const [catNames, setCatNames] = useState<Map<number, string>>(new Map());
  const pl = usePageList<Attr>(gulimallApi.attrList, filter);
  const [selected, setSelected] = useState<number[]>([]);

  const { formNode, onOpen: open } = useCreateOrEditAttrForm({
    attrType: 1,
    defaultCatelogId: filter.catelogId,
    onOk: async (values, { record, type }) => {
      const res =
        type === 'add'
          ? await gulimallApi.attrSave({ ...values, attrType: 1 })
          : await gulimallApi.attrUpdate({ ...values, attrId: record!.attrId });
      if (res.code !== 0) {
        message.error(res.msg || (type === 'add' ? '新增失败' : '修改失败'));
        return false;
      }
      message.success(type === 'add' ? '新增成功' : '修改成功');
      pl.refresh();
    },
  });

  const handleSelectCat = useMemoizedFn((catId?: number, node?: CategoryNode) => {
    const next = { ...filter, catelogId: catId };
    setFilter(next);
    setCatName(node?.name ?? '');
    setSelected([]);
    pl.query(next);
  });

  const doDelete = useMemoizedFn((ids: number[]) => {
    confirm({
      title: '提示',
      content: `确定删除 ${ids.length} 个属性? id=${ids.join(',')}`,
      onOk: async () => {
        const res = await gulimallApi.attrDelete(ids);
        if (assertOk(res)) {
          message.success('删除成功');
          setSelected([]);
          pl.refresh();
        }
      },
    });
  });

  const columns = useMemo(
    () => [
      ...buildAttrColumns((id) => catNames.get(id) ?? String(id)),
      {
        title: '操作',
        width: 150,
        render: (_: unknown, row: Attr) => (
          <Space>
            <Button size="small" onClick={() => open(row, 'edit')}>
              修改
            </Button>
            <Button size="small" danger onClick={() => doDelete([row.attrId])}>
              删除
            </Button>
          </Space>
        ),
      },
    ],
    [catNames, open, doDelete],
  );

  useMount(() => {
    gulimallApi.categoryTree().then((res) => {
      if (res.code !== 0) return;
      const map = new Map<number, string>();
      const walk = (list: CategoryNode[]) => {
        for (const n of list) {
          map.set(n.catId, n.name);
          if (n.children?.length) walk(n.children);
        }
      };
      walk(res.data ?? []);
      setCatNames(map);
    });
  });

  return (
    <Flex gap={12} align="stretch" style={{ margin: 12 }}>
      <div style={{ width: 260, flexShrink: 0 }}>
        <CategoryTree selectedCatId={filter.catelogId} onSelect={handleSelectCat} />
      </div>
      <Card
        size="small"
        style={{ flex: 1, minWidth: 0 }}
        title={
          <>
            规格参数 {catName && <Tag>{catName}</Tag>}
            <Tag color="blue">{pl.total} 条</Tag>
          </>
        }
      >
        <Space style={{ marginBottom: 12 }} wrap>
          <Input.Search
            placeholder="属性名 / 属性id"
            allowClear
            value={filter.key}
            onChange={(e) => setFilter((f) => ({ ...f, key: e.target.value || undefined }))}
            onSearch={(v) => pl.query({ ...filter, key: v || undefined })}
            style={{ width: 200 }}
          />
          <Button
            onClick={() => {
              const next = { attrType: 1, catelogId: filter.catelogId };
              setFilter(next);
              pl.query(next);
            }}
          >
            重置
          </Button>
          <Button type="primary" ghost onClick={() => open(undefined, 'add')}>
            新增
          </Button>
          <Button danger disabled={!selected.length} onClick={() => doDelete(selected)}>
            批量删除
          </Button>
        </Space>
        <Table<Attr>
          rowKey="attrId"
          size="small"
          loading={pl.loading}
          columns={columns}
          dataSource={pl.list}
          pagination={paginationProps(pl)}
          rowSelection={{
            selectedRowKeys: selected,
            onChange: (keys) => setSelected(keys as number[]),
          }}
          scroll={{ x: 900 }}
        />
      </Card>
      {formNode}
    </Flex>
  );
};

export default BaseAttrPage;
