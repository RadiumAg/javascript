import { useState, type FC } from 'react';
import { Button, Card, Input, Modal, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemoizedFn } from 'ahooks';
import { assertOk, gulimallApi, renrenApi } from '@/api';
import { confirm, message } from '@/api/feedback';
import { paginationProps, usePageList } from '@/hooks/usePageList';
import type { Purchase, SysUser } from '@/types';
import { PURCHASE_STATUS, statusOptions, statusTag } from './constants';
import PurchaseItemsDrawer from './PurchaseItemsDrawer';
import { useCreateOrEditPurchaseForm } from './useCreateOrEditPurchaseForm';
import { useWareOptions } from './useWareOptions';

type Filter = { key?: string; status?: number };

const PurchasePage: FC = () => {
  const [filter, setFilter] = useState<Filter>({});
  const pl = usePageList<Purchase>(gulimallApi.purchaseList, filter);
  const [selected, setSelected] = useState<number[]>([]);
  const { options, wareName } = useWareOptions();

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignRow, setAssignRow] = useState<Purchase>();
  const [assigneeId, setAssigneeId] = useState<number>();
  const [users, setUsers] = useState<SysUser[]>([]);

  const [drawer, setDrawer] = useState<{ purchase?: Purchase; editable: boolean }>({
    editable: false,
  });

  const { formNode, onOpen: open } = useCreateOrEditPurchaseForm({
    wareOptions: options,
    onOk: async (values, { record, type }) => {
      const res =
        type === 'add'
          ? await gulimallApi.purchaseSave(values)
          : await gulimallApi.purchaseUpdate({ ...values, id: record!.id });
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
      content: `确定删除 ${ids.length} 张采购单? id=${ids.join(',')}`,
      onOk: async () => {
        const res = await gulimallApi.purchaseDelete(ids);
        if (assertOk(res)) {
          message.success('删除成功');
          setSelected([]);
          pl.refresh();
        }
      },
    });
  });

  const doReceived = useMemoizedFn((ids: number[]) => {
    confirm({
      title: '提示',
      content: `确定领取 ${ids.length} 张采购单? 单内需求将转为正在采购`,
      onOk: async () => {
        const res = await gulimallApi.purchaseReceived(ids);
        if (assertOk(res)) {
          message.success('领取成功');
          setSelected([]);
          pl.refresh();
        }
      },
    });
  });

  const openAssign = useMemoizedFn((row: Purchase) => {
    setAssignRow(row);
    setAssigneeId(row.assigneeId);
    renrenApi.userList({ page: 1, limit: 500 }).then((res) => {
      if (res.code === 0) setUsers(res.page?.list ?? []);
    });
    setAssignOpen(true);
  });

  const doAssign = useMemoizedFn(async () => {
    const user = users.find((u) => u.userId === assigneeId);
    if (!assignRow || !user) {
      message.warning('请选择采购人员');
      return;
    }
    const res = await gulimallApi.purchaseUpdate({
      id: assignRow.id,
      assigneeId: user.userId,
      assigneeName: user.username,
      phone: user.mobile,
      status: 1,
    });
    if (assertOk(res)) {
      message.success('分配成功');
      setAssignOpen(false);
      pl.refresh();
    }
  });

  const columns: ColumnsType<Purchase> = [
    { title: '采购单id', dataIndex: 'id', width: 90 },
    { title: '采购人名', dataIndex: 'assigneeName', width: 110, render: (v?: string) => v ?? '-' },
    { title: '联系方式', dataIndex: 'phone', width: 130, render: (v?: string) => v ?? '-' },
    { title: '优先级', dataIndex: 'priority', width: 80 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: number) => statusTag(PURCHASE_STATUS, v),
    },
    { title: '仓库', dataIndex: 'wareId', width: 120, render: (v?: number) => wareName(v) },
    { title: '总金额', dataIndex: 'amount', width: 120, render: (v?: number) => v ?? '-' },
    { title: '创建日期', dataIndex: 'createTime', width: 170 },
    { title: '更新日期', dataIndex: 'updateTime', width: 170 },
    {
      title: '操作',
      width: 300,
      fixed: 'right',
      render: (_, row) => (
        <Space wrap size={4}>
          {(row.status === 0 || row.status === 1) && (
            <>
              <Button size="small" onClick={() => openAssign(row)}>
                分配
              </Button>
              <Button size="small" onClick={() => doReceived([row.id])}>
                领取
              </Button>
            </>
          )}
          {row.status === 2 && (
            <Button
              size="small"
              type="primary"
              onClick={() => setDrawer({ purchase: row, editable: true })}
            >
              完成
            </Button>
          )}
          <Button size="small" onClick={() => setDrawer({ purchase: row, editable: false })}>
            明细
          </Button>
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
          采购单 <Tag color="blue">{pl.total} 条</Tag>
        </>
      }
    >
      <Space style={{ marginBottom: 12 }} wrap>
        <Select
          placeholder="状态"
          allowClear
          value={filter.status}
          onChange={(v) => setFilter((f) => ({ ...f, status: v }))}
          options={statusOptions(PURCHASE_STATUS)}
          style={{ width: 130 }}
        />
        <Input.Search
          placeholder="采购单id / 采购人名"
          allowClear
          value={filter.key}
          onChange={(e) => setFilter((f) => ({ ...f, key: e.target.value || undefined }))}
          onSearch={(v) => pl.query({ ...filter, key: v || undefined })}
          style={{ width: 200 }}
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
        <Button disabled={!selected.length} onClick={() => doReceived(selected)}>
          批量领取
        </Button>
        <Button danger disabled={!selected.length} onClick={() => doDelete(selected)}>
          批量删除
        </Button>
      </Space>
      <Table<Purchase>
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
        scroll={{ x: 1500 }}
      />
      {formNode}
      <Modal
        title={`分配采购人员（采购单 #${assignRow?.id}）`}
        open={assignOpen}
        onOk={doAssign}
        onCancel={() => setAssignOpen(false)}
        okText="确定"
        cancelText="取消"
        destroyOnHidden
      >
        <Select
          placeholder="请选择采购人员"
          showSearch
          optionFilterProp="label"
          value={assigneeId}
          onChange={setAssigneeId}
          style={{ width: '100%' }}
          options={users.map((u) => ({
            value: u.userId,
            label: `${u.username}${u.mobile ? `（${u.mobile}）` : ''}`,
          }))}
        />
      </Modal>
      <PurchaseItemsDrawer
        open={!!drawer.purchase}
        purchase={drawer.purchase}
        editable={drawer.editable}
        wareName={wareName}
        onClose={() => setDrawer({ editable: false })}
        onDone={() => pl.refresh()}
      />
    </Card>
  );
};

export default PurchasePage;
