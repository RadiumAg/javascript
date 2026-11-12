import { useState, type FC } from 'react';
import { Button, Card, Input, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemoizedFn } from 'ahooks';
import { assertOk, gulimallApi } from '@/api';
import { confirm, message } from '@/api/feedback';
import { paginationProps, usePageList } from '@/hooks/usePageList';
import type { WareInfo } from '@/types';
import { useCreateOrEditWareInfoForm } from './useCreateOrEditWareInfoForm';

type Filter = { key?: string };

const WareInfoPage: FC = () => {
  const [filter, setFilter] = useState<Filter>({});
  const pl = usePageList<WareInfo>(gulimallApi.wareInfoList, filter);
  const [selected, setSelected] = useState<number[]>([]);

  const { formNode, onOpen: open } = useCreateOrEditWareInfoForm({
    onOk: async (values, { record, type }) => {
      const res =
        type === 'add'
          ? await gulimallApi.wareInfoSave(values)
          : await gulimallApi.wareInfoUpdate({ ...values, id: record!.id });
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
      content: `确定删除 ${ids.length} 个仓库? id=${ids.join(',')}`,
      onOk: async () => {
        const res = await gulimallApi.wareInfoDelete(ids);
        if (assertOk(res)) {
          message.success('删除成功');
          setSelected([]);
          pl.refresh();
        }
      },
    });
  });

  const columns: ColumnsType<WareInfo> = [
    { title: '仓库id', dataIndex: 'id', width: 100 },
    { title: '仓库名', dataIndex: 'name', width: 200 },
    { title: '仓库地址', dataIndex: 'address', ellipsis: true },
    { title: '区域编码', dataIndex: 'areacode', width: 120 },
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
          仓库维护 <Tag color="blue">{pl.total} 条</Tag>
        </>
      }
    >
      <Space style={{ marginBottom: 12 }} wrap>
        <Input.Search
          placeholder="仓库名 / 仓库id"
          allowClear
          value={filter.key}
          onChange={(e) => setFilter((f) => ({ ...f, key: e.target.value || undefined }))}
          onSearch={(v) => pl.query({ ...filter, key: v || undefined })}
          style={{ width: 220 }}
        />
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
      <Table<WareInfo>
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
      />
      {formNode}
    </Card>
  );
};

export default WareInfoPage;
