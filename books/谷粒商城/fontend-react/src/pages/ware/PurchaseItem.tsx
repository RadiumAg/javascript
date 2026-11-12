import { useState, type FC } from 'react';
import { Button, Card, Input, Modal, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemoizedFn } from 'ahooks';
import { assertOk, gulimallApi } from '@/api';
import { confirm, message } from '@/api/feedback';
import { paginationProps, usePageList } from '@/hooks/usePageList';
import type { Purchase, PurchaseDetail } from '@/types';
import { DETAIL_STATUS, statusOptions, statusTag } from './constants';
import { useCreateOrEditPurchaseDetailForm } from './useCreateOrEditPurchaseDetailForm';
import { useWareOptions } from './useWareOptions';

type Filter = { key?: string; status?: number; wareId?: number };

const PurchaseItemPage: FC = () => {
  const [filter, setFilter] = useState<Filter>({});
  const pl = usePageList<PurchaseDetail>(gulimallApi.purchaseDetailList, filter);
  const [selected, setSelected] = useState<number[]>([]);
  const { options, wareName } = useWareOptions();

  const [mergeOpen, setMergeOpen] = useState(false);
  const [mergePurchaseId, setMergePurchaseId] = useState<number | undefined>();
  const [unreceived, setUnreceived] = useState<Purchase[]>([]);

  const { formNode, onOpen: open } = useCreateOrEditPurchaseDetailForm({
    wareOptions: options,
    onOk: async (values, { record, type }) => {
      const res =
        type === 'add'
          ? await gulimallApi.purchaseDetailSave(values)
          : await gulimallApi.purchaseDetailUpdate({ ...values, id: record!.id });
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
      content: `确定删除 ${ids.length} 条采购需求? id=${ids.join(',')}`,
      onOk: async () => {
        const res = await gulimallApi.purchaseDetailDelete(ids);
        if (assertOk(res)) {
          message.success('删除成功');
          setSelected([]);
          pl.refresh();
        }
      },
    });
  });

  const openMerge = useMemoizedFn(() => {
    setMergePurchaseId(undefined);
    gulimallApi.purchaseUnreceiveList({ page: 1, limit: 500 }).then((res) => {
      if (res.code === 0) setUnreceived(res.page?.list ?? []);
    });
    setMergeOpen(true);
  });

  const doMerge = useMemoizedFn(async () => {
    const res = await gulimallApi.purchaseMerge({
      purchaseId: mergePurchaseId,
      items: selected,
    });
    if (assertOk(res)) {
      message.success(mergePurchaseId ? `已合并到采购单 ${mergePurchaseId}` : '已新建采购单并合并');
      setMergeOpen(false);
      setSelected([]);
      pl.refresh();
    }
  });

  const onMergeOk = useMemoizedFn(() => {
    if (mergePurchaseId) {
      void doMerge();
      return;
    }
    confirm({
      title: '提示',
      content: '没有选择任何【采购单】，将自动创建新单进行合并。确认吗？',
      onOk: doMerge,
    });
  });

  const columns: ColumnsType<PurchaseDetail> = [
    { title: 'id', dataIndex: 'id', width: 80 },
    { title: '采购单id', dataIndex: 'purchaseId', width: 100, render: (v?: number) => v ?? '-' },
    { title: '采购商品id', dataIndex: 'skuId', width: 110 },
    { title: '采购数量', dataIndex: 'skuNum', width: 100 },
    { title: '采购金额', dataIndex: 'skuPrice', width: 120, render: (v?: number) => v ?? '-' },
    { title: '仓库', dataIndex: 'wareId', width: 140, render: (v: number) => wareName(v) },
    {
      title: '状态',
      dataIndex: 'status',
      width: 110,
      render: (v: number) => statusTag(DETAIL_STATUS, v),
    },
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
          采购需求 <Tag color="blue">{pl.total} 条</Tag>
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
          style={{ width: 150 }}
        />
        <Select
          placeholder="状态"
          allowClear
          value={filter.status}
          onChange={(v) => setFilter((f) => ({ ...f, status: v }))}
          options={statusOptions(DETAIL_STATUS)}
          style={{ width: 130 }}
        />
        <Input.Search
          placeholder="采购单id / skuId"
          allowClear
          value={filter.key}
          onChange={(e) => setFilter((f) => ({ ...f, key: e.target.value || undefined }))}
          onSearch={(v) => pl.query({ ...filter, key: v || undefined })}
          style={{ width: 180 }}
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
        <Button disabled={!selected.length} onClick={openMerge}>
          合并整单
        </Button>
        <Button danger disabled={!selected.length} onClick={() => doDelete(selected)}>
          批量删除
        </Button>
      </Space>
      <Table<PurchaseDetail>
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
        scroll={{ x: 1000 }}
      />
      {formNode}
      <Modal
        title={`合并到整单（已选 ${selected.length} 条需求）`}
        open={mergeOpen}
        onOk={onMergeOk}
        onCancel={() => setMergeOpen(false)}
        okText="确定"
        cancelText="取消"
        destroyOnHidden
      >
        <Select
          placeholder="不选则自动新建采购单"
          allowClear
          showSearch
          optionFilterProp="label"
          value={mergePurchaseId}
          onChange={setMergePurchaseId}
          style={{ width: '100%' }}
          options={unreceived.map((p) => ({
            value: p.id,
            label: `#${p.id} ${p.assigneeName ?? '未分配'}${p.phone ? `：${p.phone}` : ''}`,
          }))}
        />
      </Modal>
    </Card>
  );
};

export default PurchaseItemPage;
