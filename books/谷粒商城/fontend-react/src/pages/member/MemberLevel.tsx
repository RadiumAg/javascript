import { useState, type FC } from 'react';
import { Button, Card, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemoizedFn } from 'ahooks';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { assertOk, gulimallApi } from '@/api';
import { confirm, message } from '@/api/feedback';
import { paginationProps, usePageList } from '@/hooks/usePageList';
import type { MemberLevel } from '@/types';
import { useCreateOrEditMemberLevelForm } from './useCreateOrEditMemberLevelForm';

const flag = (on: boolean) =>
  on ? (
    <CheckCircleFilled style={{ color: '#52c41a' }} />
  ) : (
    <CloseCircleFilled style={{ color: '#bfbfbf' }} />
  );

const MemberLevelPage: FC = () => {
  const pl = usePageList<MemberLevel>(gulimallApi.memberLevelList, {});
  const [selected, setSelected] = useState<number[]>([]);

  const { formNode, onOpen: open } = useCreateOrEditMemberLevelForm({
    onOk: async (values, { record, type }) => {
      const res =
        type === 'add'
          ? await gulimallApi.memberLevelSave(values)
          : await gulimallApi.memberLevelUpdate({ ...values, id: record!.id });
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
      content: `确定删除 ${ids.length} 个会员等级? id=${ids.join(',')}`,
      onOk: async () => {
        const res = await gulimallApi.memberLevelDelete(ids);
        if (assertOk(res)) {
          message.success('删除成功');
          setSelected([]);
          pl.refresh();
        }
      },
    });
  });

  const columns: ColumnsType<MemberLevel> = [
    { title: '等级Id', dataIndex: 'id', width: 80 },
    {
      title: '等级名称',
      dataIndex: 'name',
      width: 130,
      render: (v: string, row) => (
        <Space size={4}>
          {v}
          {row.defaultStatus === 1 && <Tag color="gold">默认</Tag>}
        </Space>
      ),
    },
    { title: '成长值', dataIndex: 'growthPoint', width: 90 },
    { title: '免运费标准', dataIndex: 'freeFreightPoint', width: 110 },
    { title: '评价成长值', dataIndex: 'commentGrowthPoint', width: 100 },
    { title: '免邮特权', dataIndex: 'priviledgeFreeFreight', width: 90, align: 'center', render: (v: number) => flag(v === 1) },
    { title: '会员价特权', dataIndex: 'priviledgeMemberPrice', width: 100, align: 'center', render: (v: number) => flag(v === 1) },
    { title: '生日特权', dataIndex: 'priviledgeBirthday', width: 90, align: 'center', render: (v: number) => flag(v === 1) },
    { title: '备注', dataIndex: 'note', ellipsis: true },
    {
      title: '操作',
      width: 150,
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
          会员等级 <Tag color="blue">{pl.total} 条</Tag>
        </>
      }
    >
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" ghost onClick={() => open(undefined, 'add')}>
          新增
        </Button>
        <Button danger disabled={!selected.length} onClick={() => doDelete(selected)}>
          批量删除
        </Button>
      </Space>
      <Table<MemberLevel>
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

export default MemberLevelPage;
