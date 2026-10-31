import { FC, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  notification,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { microGet, microPost } from '@/api/http';
import type { R } from '@/types';
import { useMemoizedFn, useMount } from 'ahooks';
import { TableRowSelection } from 'antd/es/table/interface';

/** gulimall-product 的 /gulimallproduct/category/list/tree 返回嵌套树，字段与 CategoryEntity 对齐 */
interface CategoryNode {
  catId: number;
  name: string;
  parentCid: number;
  catLevel: number;
  showStatus: number;
  productCount: number;
  children?: CategoryNode[];
}

const Category: FC = () => {
  const [rows, setRows] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const selectedRowKeys = useRef<React.Key[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    selectedRowKeys.current = newSelectedRowKeys;
  };

  const rowSelection: TableRowSelection<CategoryNode> = {
    onChange: onSelectChange,
  };

  const handleAppendClick = useMemoizedFn(() => {});

  const handleDeleteClick = useMemoizedFn((record: CategoryNode) => {
    microPost('/gulimallproduct/category/delete', [record.catId], {
      raw: true,
    })
      .then(() => {
        notificationApi.success({ message: '删除成功' });
        loadingData();
      })
      .catch((e) => {
        if (e instanceof Error) notificationApi.error({ message: e.message });
      });
  });

  const loadingData = useMemoizedFn(() => {
    setLoading(true);
    microGet<R & { data?: CategoryNode[] }>(
      '/gulimallproduct/category/list/tree',
    )
      .then((res) => {
        if (res.code !== 0) {
          setError(res.msg || '请求失败');
          return;
        }
        setRows(res.data ?? []);
      })
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  });

  const columns: ColumnsType<CategoryNode> = useMemo(
    () => [
      { title: '分类Id', dataIndex: 'catId', width: 110 },
      { title: '分类名', dataIndex: 'name' },
      { title: '父分类Id', dataIndex: 'parentCid', width: 110 },
      { title: '层级', dataIndex: 'catLevel', width: 80 },
      { title: '商品数', dataIndex: 'productCount', width: 100 },
      {
        title: '显示状态',
        dataIndex: 'showStatus',
        width: 110,
        render: (v: number) =>
          v === 1 ? <Tag color="green">显示</Tag> : <Tag>隐藏</Tag>,
      },
      {
        title: '操作',
        render: (_, record) => {
          return (
            <Space>
              {record.catLevel <= 2 && (
                <Button type="text" onClick={handleAppendClick}>
                  插入
                </Button>
              )}
              {record.children && record.children?.length === 0 && (
                <Popconfirm
                  title="警告·"
                  description="确认删除么"
                  onConfirm={() => {
                    handleDeleteClick(record);
                  }}
                >
                  <Button danger type="text">
                    删除
                  </Button>
                </Popconfirm>
              )}
            </Space>
          );
        },
      },
    ],
    [],
  );

  useMount(() => {
    loadingData();
  });

  return (
    <Card
      size="small"
      style={{ margin: 12 }}
      title={
        <>
          商品分类 <Tag color="blue">{rows.length} 个一级分类</Tag>
        </>
      }
    >
      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          style={{ marginBottom: 12 }}
        />
      )}
      <Table<CategoryNode>
        rowKey="catId"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={rows}
        rowSelection={rowSelection}
        pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
      />
      {contextHolder}
    </Card>
  );
};

export default Category;
