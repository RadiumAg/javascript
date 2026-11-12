import { useState, type FC } from 'react';
import { Button, Card, Input, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemoizedFn } from 'ahooks';
import { useSearchParams } from 'react-router-dom';
import { assertOk, gulimallApi } from '@/api';
import { confirm, message } from '@/api/feedback';
import { paginationProps, usePageList } from '@/hooks/usePageList';
import type { WareSku } from '@/types';
import { useCreateOrEditWareSkuForm } from './useCreateOrEditWareSkuForm';
import { useWareOptions } from './useWareOptions';

type Filter = { skuId?: string; wareId?: number };

const WareSkuPage: FC = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>({
    skuId: searchParams.get('skuId') || undefined,
  });
  const pl = usePageList<WareSku>(gulimallApi.wareSkuList, filter);
  const [selected, setSelected] = useState<number[]>([]);
  const { options, wareName } = useWareOptions();

  const { formNode, onOpen: open } = useCreateOrEditWareSkuForm({
    wareOptions: options,
    onOk: async (values, { record, type }) => {
      const res =
        type === 'add'
          ? await gulimallApi.wareSkuSave(values)
          : await gulimallApi.wareSkuUpdate({ ...values, id: record!.id });
      if (res.code !== 0) {
        message.error(res.msg || (type === 'add' ? '新增失败' : '修改失败'));
        return false;
      }
      message.success(type === 'add' ? '新增成功' : '修改成功');
      pl.refresh();
    },
  });

  const doDelete = useMemoizedFn((ids: number[]) => {
    confirm({
      title: '提示',
      content: `确定删除 ${ids.length} 条库存记录? id=${ids.join(',')}`,
      onOk: async () => {
        const res = await gulimallApi.wareSkuDelete(ids);
        if (assertOk(res)) {
          message.success('删除成功');
          setSelected([]);
          pl.refresh();
        }
      },
    });
  });

  const columns: ColumnsType<WareSku> = [
    { title: 'id', dataIndex: 'id', width: 80 },
    { title: 'skuId', dataIndex: 'skuId', width: 90 },
    { title: '仓库', dataIndex: 'wareId', width: 140, render: (v: number) => wareName(v) },
    { title: '库存数', dataIndex: 'stock', width: 100 },
    { title: 'sku名称', dataIndex: 'skuName', ellipsis: true },
    { title: '锁定库存', dataIndex: 'stockLocked', width: 100 },
    {
      title: '操作',
      width: 160,
      render: (_, row) => (
        <Space>
          <Button size="small" onClick={() => open(row, 'edit')}>
            修改
          </Button>
          <Button size="small" danger onClick={() => doDelete([row.id])}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      size="small"
      style={{ margin: 12 }}
      title={
        <>
          商品库存 <Tag color="blue">{pl.total} 条</Tag>
        </>
      }
    >
      <Space style={{ marginBottom: 12 }} wrap>
        <Select
          placeholder="仓库"
          allowClear
          showSearch
          optionFilterProp="label"
          value={filter.wareId}
          onChange={(v) => setFilter((f) => ({ ...f, wareId: v }))}
          options={options}
          style={{ width: 160 }}
        />
        <Input.Search
          placeholder="skuId"
          allowClear
          value={filter.skuId}
          onChange={(e) => setFilter((f) => ({ ...f, skuId: e.target.value || undefined }))}
          onSearch={(v) => pl.query({ ...filter, skuId: v || undefined })}
          style={{ width: 160 }}
        />
        <Button type="primary" onClick={() => pl.query(filter)}>
          查询
        </Button>
        <Button
          onClick={() => {
            setFilter({});
            pl.query({});
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
      <Table<WareSku>
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
        scroll={{ x: 900 }}
      />
      {formNode}
    </Card>
  );
};

export default WareSkuPage;
