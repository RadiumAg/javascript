import { FC, useState } from 'react';
import {
  Button,
  Card,
  Image,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { assertOk, gulimallApi } from '@/api';
import { confirm, message } from '@/api/feedback';
import type { Brand } from '@/types';
import { useMemoizedFn, useMount } from 'ahooks';
import { useCreateOrEditBrandForm } from './useCreateOrEditBrandForm';
import { paginationProps, usePageList } from '@/hooks/usePageList';

type Filter = { name?: string; showStatus?: number; firstLetter?: string };

const BrandPage: FC = () => {
  const [filter, setFilter] = useState<Filter>({});
  const pl = usePageList<Brand>(gulimallApi.brandList, filter);
  const [selected, setSelected] = useState<number[]>([]);

  useMount(() => void pl.refresh());

  const { formNode, onOpen: open } = useCreateOrEditBrandForm({
    onOk: async (values, { record, type }) => {
      const res =
        type === 'add'
          ? await gulimallApi.brandSave(values)
          : await gulimallApi.brandUpdate({
              ...values,
              brandId: record!.brandId,
            });
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
      content: `确定进行[${ids.length === 1 ? '单条' : '批量'}删除]操作? id=${ids.join(',')}`,
      onOk: async () => {
        const res = await gulimallApi.brandDelete(ids);
        if (assertOk(res)) {
          message.success('删除成功');
          setSelected([]);
          pl.refresh();
        }
      },
    });
  });

  const columns: ColumnsType<Brand> = [
    { title: '品牌Id', dataIndex: 'brandId', width: 100 },
    { title: '品牌名', dataIndex: 'name', width: 160 },
    {
      title: 'Logo',
      dataIndex: 'logo',
      width: 80,
      render: (v?: string) =>
        v ? <Image src={v} width={40} height={40} /> : '-',
    },
    { title: '描述', dataIndex: 'descript', ellipsis: true },
    {
      title: '显示状态',
      dataIndex: 'showStatus',
      width: 100,
      render: (v: number) =>
        v === 1 ? <Tag color="green">显示</Tag> : <Tag>隐藏</Tag>,
    },
    { title: '首字母', dataIndex: 'firstLetter', width: 80 },
    { title: '排序', dataIndex: 'sort', width: 80 },
    {
      title: '操作',
      width: 160,
      render: (_, row) => (
        <Space>
          <Button size="small" onClick={() => open(row, 'edit')}>
            修改
          </Button>
          <Button size="small" danger onClick={() => doDelete([row.brandId])}>
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
          品牌管理 <Tag color="blue">{pl.total} 条</Tag>
        </>
      }
    >
      <Space style={{ marginBottom: 12 }} wrap>
        <Input
          placeholder="品牌名"
          allowClear
          value={filter.name}
          onChange={(e) =>
            setFilter((f) => ({ ...f, name: e.target.value || undefined }))
          }
          onPressEnter={() => pl.query(filter)}
          style={{ width: 160 }}
        />
        <Select
          placeholder="显示状态"
          allowClear
          value={filter.showStatus}
          onChange={(v) => setFilter((f) => ({ ...f, showStatus: v }))}
          options={[
            { label: '显示', value: 1 },
            { label: '隐藏', value: 0 },
          ]}
          style={{ width: 120 }}
        />
        <Input
          placeholder="首字母"
          allowClear
          maxLength={1}
          value={filter.firstLetter}
          onChange={(e) =>
            setFilter((f) => ({
              ...f,
              firstLetter: e.target.value || undefined,
            }))
          }
          onPressEnter={() => pl.query(filter)}
          style={{ width: 100 }}
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
      <Table<Brand>
        rowKey="brandId"
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

export default BrandPage;
