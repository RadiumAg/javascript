import { useEffect, useState, type FC } from 'react';
import { Button, Drawer, Radio, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { assertOk, gulimallApi } from '@/api';
import { message } from '@/api/feedback';
import type { Purchase, PurchaseDetail } from '@/types';
import { DETAIL_STATUS, statusTag } from './constants';

type Props = {
  open: boolean;
  purchase?: Purchase;
  /** true=完成采购（逐条选成功/失败并入库），false=只看明细 */
  editable?: boolean;
  wareName: (id?: number) => string;
  onClose: () => void;
  onDone: () => void;
};

/** 采购单明细抽屉：完成采购时逐条标记结果，成功的需求由后端入库 */
const PurchaseItemsDrawer: FC<Props> = ({
  open,
  purchase,
  editable,
  wareName,
  onClose,
  onDone,
}) => {
  const [items, setItems] = useState<PurchaseDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!open || !purchase) return;
    setLoading(true);
    gulimallApi
      .purchaseDetailList({ page: 1, limit: 500, purchaseId: purchase.id })
      .then((res) => {
        const list = res.code === 0 ? (res.page?.list ?? []) : [];
        setItems(list);
        setResults(Object.fromEntries(list.map((i) => [i.id, 3])));
      })
      .finally(() => setLoading(false));
  }, [open, purchase]);

  const submit = async () => {
    if (!purchase) return;
    if (!items.length) {
      message.warning('该采购单还没有采购需求');
      return;
    }
    setSubmitting(true);
    try {
      const res = await gulimallApi.purchaseDone({
        id: purchase.id,
        items: items.map((i) => ({ itemId: i.id, status: results[i.id] ?? 3 })),
      });
      if (assertOk(res)) {
        message.success('采购完成，成功的需求已入库');
        onDone();
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<PurchaseDetail> = [
    { title: '需求id', dataIndex: 'id', width: 80 },
    { title: 'skuId', dataIndex: 'skuId', width: 90 },
    { title: '采购数量', dataIndex: 'skuNum', width: 90 },
    { title: '采购金额', dataIndex: 'skuPrice', width: 110, render: (v?: number) => v ?? '-' },
    { title: '仓库', dataIndex: 'wareId', width: 120, render: (v: number) => wareName(v) },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: number) => statusTag(DETAIL_STATUS, v),
    },
    ...(editable
      ? [
          {
            title: '采购结果',
            width: 180,
            render: (_: unknown, row: PurchaseDetail) => (
              <Radio.Group
                value={results[row.id] ?? 3}
                onChange={(e) => setResults((r) => ({ ...r, [row.id]: e.target.value }))}
                options={[
                  { label: '成功', value: 3 },
                  { label: '失败', value: 4 },
                ]}
              />
            ),
          } as ColumnsType<PurchaseDetail>[number],
        ]
      : []),
  ];

  return (
    <Drawer
      title={
        <>
          {editable ? '完成采购' : '采购明细'} <Tag>采购单 #{purchase?.id}</Tag>
        </>
      }
      width={editable ? 860 : 720}
      open={open}
      onClose={onClose}
      destroyOnHidden
      extra={
        editable ? (
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" loading={submitting} onClick={submit}>
              确认完成
            </Button>
          </Space>
        ) : null
      }
    >
      <Table<PurchaseDetail>
        rowKey="id"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={items}
        pagination={false}
      />
    </Drawer>
  );
};

export default PurchaseItemsDrawer;
