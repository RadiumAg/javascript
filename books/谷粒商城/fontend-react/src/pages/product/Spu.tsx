import { useMemo, useState, type FC } from 'react';
import { Button, Card, Input, Select, Space, Table, Tag } from 'antd';
import { useMemoizedFn, useMount } from 'ahooks';
import { useNavigate } from 'react-router-dom';
import { assertOk, gulimallApi } from '@/api';
import { confirm, message } from '@/api/feedback';
import { paginationProps, usePageList } from '@/hooks/usePageList';
import type { CategoryNode, SpuItem } from '@/types';
import { CategoryTreeSelect } from './CategoryTreeSelect';

type Filter = { key?: string; status?: number; brandId?: number; catalogId?: number };

/** 对齐教程 spu 管理页：分类/品牌/状态/检索 表单 + spuinfo 表格（上架、删除） */
const SpuPage: FC = () => {
  const [filter, setFilter] = useState<Filter>({});
  const navigate = useNavigate();
  const pl = usePageList<SpuItem>(gulimallApi.spuList, filter);
  const [selected, setSelected] = useState<number[]>([]);
  const [names, setNames] = useState<{ cat: Map<number, string>; brand: Map<number, string> }>({
    cat: new Map(),
    brand: new Map(),
  });

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
      setNames((s) => ({ ...s, cat: map }));
    });
    gulimallApi.brandList({ page: 1, limit: 500 }).then((res) => {
      if (res.code !== 0) return;
      const map = new Map<number, string>();
      for (const b of res.page?.list ?? []) map.set(b.brandId, b.name);
      setNames((s) => ({ ...s, brand: map }));
    });
  });

  const productUp = useMemoizedFn((row: SpuItem) => {
    confirm({
      title: '提示',
      content: `确定上架「${row.spuName}」?`,
      onOk: async () => {
        const res = await gulimallApi.spuUpdate({ id: row.id, publishStatus: 1 });
        if (assertOk(res)) {
          message.success('上架成功');
          pl.refresh();
        }
      },
    });
  });

  const doDelete = useMemoizedFn((ids: number[]) => {
    confirm({
      title: '提示',
      content: `确定删除 ${ids.length} 个商品?（只删 spu_info，SKU 等关联表暂不清理）`,
      onOk: async () => {
        const res = await gulimallApi.spuDelete(ids);
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
      { title: '商品id', dataIndex: 'id', width: 90 },
      { title: '商品名称', dataIndex: 'spuName', width: 200, ellipsis: true },
      { title: '描述', dataIndex: 'spuDescription', width: 160, ellipsis: true, render: (v?: string) => v || '-' },
      {
        title: '分类',
        dataIndex: 'catalogId',
        width: 120,
        render: (v: number) => names.cat.get(v) ?? v,
      },
      {
        title: '品牌',
        dataIndex: 'brandId',
        width: 120,
        render: (v: number) => names.brand.get(v) ?? v,
      },
      { title: '重量(kg)', dataIndex: 'weight', width: 90 },
      {
        title: '上架状态',
        dataIndex: 'publishStatus',
        width: 100,
        render: (v: number) =>
          v === 1 ? <Tag color="green">已上架</Tag> : <Tag color="orange">下架</Tag>,
      },
      { title: '创建时间', dataIndex: 'createTime', width: 160 },
      {
        title: '操作',
        width: 150,
        fixed: 'right' as const,
        render: (_: unknown, row: SpuItem) => (
          <Space>
            {row.publishStatus !== 1 && (
              <Button size="small" type="link" onClick={() => productUp(row)}>
                上架
              </Button>
            )}
            <Button size="small" type="link" danger onClick={() => doDelete([row.id])}>
              删除
            </Button>
          </Space>
        ),
      },
    ],
    [names, productUp, doDelete],
  );

  const search = (patch: Filter) => {
    setFilter(patch);
    pl.query(patch);
  };

  return (
    <Card size="small" style={{ margin: 12 }} title={<>{`商品列表`} <Tag color="blue">{pl.total} 条</Tag></>}>
      <Space style={{ marginBottom: 12 }} wrap>
        <CategoryTreeSelect
          style={{ width: 200 }}
          value={filter.catalogId}
          onChange={(v) => setFilter((f) => ({ ...f, catalogId: v }))}
        />
        <Select
          style={{ width: 160 }}
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="品牌"
          value={filter.brandId}
          onChange={(v) => setFilter((f) => ({ ...f, brandId: v }))}
          options={[...names.brand.entries()].map(([id, name]) => ({ value: id, label: name }))}
        />
        <Select
          style={{ width: 120 }}
          allowClear
          placeholder="状态"
          value={filter.status}
          onChange={(v) => setFilter((f) => ({ ...f, status: v }))}
          options={[
            { value: 0, label: '下架' },
            { value: 1, label: '上架' },
          ]}
        />
        <Input.Search
          placeholder="商品名称 / 商品id"
          allowClear
          style={{ width: 200 }}
          value={filter.key}
          onChange={(e) => setFilter((f) => ({ ...f, key: e.target.value || undefined }))}
          onSearch={(v) => search({ ...filter, key: v || undefined })}
        />
        <Button type="primary" onClick={() => search(filter)}>
          查询
        </Button>
        <Button
          onClick={() => {
            search({});
          }}
        >
          重置
        </Button>
        <Button type="primary" ghost onClick={() => navigate('/product/spuadd')}>
          发布商品
        </Button>
        <Button danger disabled={!selected.length} onClick={() => doDelete(selected)}>
          批量删除
        </Button>
      </Space>
      <Table<SpuItem>
        rowKey="id"
        size="small"
        loading={pl.loading}
        columns={columns}
        dataSource={pl.list}
        pagination={paginationProps(pl)}
        rowSelection={{
          selectedRowKeys: selected,
          onChange: (keys) => setSelected(keys as number[]),
        }}
        scroll={{ x: 1100 }}
      />
    </Card>
  );
};

export default SpuPage;
