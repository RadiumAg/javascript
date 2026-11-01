import React, { FC, HTMLAttributes, useMemo, useRef, useState } from 'react';
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
import { gulimallApi } from '@/api';
import type { CategoryNode } from '@/types';
import { useMemoizedFn, useMount } from 'ahooks';
import { TableRowSelection } from 'antd/es/table/interface';
import { useCreateOrEditCategoryForm } from './useCreateOrEditCategoryForm';
import {
  flattenCatIds,
  findNodePath,
  getListByPath,
  isSameParent,
  updateListByPath,
} from './util';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

const Category: FC = () => {
  const [rows, setRows] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const selectedRowKeys = useRef<React.Key[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const loadingData = useMemoizedFn(() => {
    setLoading(true);
    gulimallApi
      .categoryTree()
      .then((res) => {
        if (res.code !== 0) {
          setError(res.msg || '请求失败');
          return;
        }
        setError('');
        setRows(res.data ?? []);
      })
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  });

  const { formNode, onOpen: open } = useCreateOrEditCategoryForm({
    onOk: async ({ name }, { record, type }) => {
      if (type === 'add') {
        const res = await gulimallApi.categorySave({
          name,
          parentCid: record.catId,
          catLevel: record.catLevel + 1,
          showStatus: 1,
        });
        if (res.code !== 0) {
          notificationApi.error({ title: res.msg || '新增失败' });
          return false;
        }
        notificationApi.success({ title: '新增成功' });
        loadingData();
      }

      if (type === 'edit') {
        const res = await gulimallApi.categoryUpdate({
          name,
          catId: record.catId,
          showStatus: 1,
        });
        if (res.code !== 0) {
          notificationApi.error({ title: res.msg || '修改失败' });
          return false;
        }
        notificationApi.success({ title: '修改成功' });
        loadingData();
      }
    },
  });

  const rowSelection: TableRowSelection<CategoryNode> = {
    onChange: (newSelectedRowKeys: React.Key[]) => {
      selectedRowKeys.current = newSelectedRowKeys;
    },
  };
  const handleAppendClick = useMemoizedFn((record: CategoryNode) => {
    open(record, 'add');
  });
  const handleEditClick = useMemoizedFn((record: CategoryNode) => {
    open(record, 'edit');
  });
  const handleDeleteClick = useMemoizedFn(async (record: CategoryNode) => {
    try {
      const res = await gulimallApi.categoryDelete([record.catId]);
      if (res.code !== 0) {
        notificationApi.error({ title: res.msg || '删除失败' });
        return;
      }
      notificationApi.success({ title: '删除成功' });
      loadingData();
    } catch (e) {
      if (e instanceof Error) notificationApi.error({ title: e.message });
    }
  });
  const handleDragEnd = useMemoizedFn(
    async ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return;
      const activeLoc = findNodePath(rows, active.id);
      const overLoc = findNodePath(rows, over.id);
      if (
        !activeLoc ||
        !overLoc ||
        !isSameParent(activeLoc.parentPath, overLoc.parentPath)
      ) {
        return;
      }
      const parentList = getListByPath(rows, activeLoc.parentPath);
      const newParent = arrayMove(parentList, activeLoc.index, overLoc.index);
      setRows(updateListByPath(rows, activeLoc.parentPath, newParent));
      setSaving(true);
      try {
        await gulimallApi.categorySortBatch(newParent);
      } catch (e) {
        notificationApi.error({
          title: '排序保存失败',
          description: e instanceof Error ? e.message : String(e),
        });
        loadingData();
      } finally {
        setSaving(false);
      }
    },
  );

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
            <span onPointerDown={(e) => e.stopPropagation()}>
              <Space>
                {record.catLevel <= 2 && (
                  <Button type="text" onClick={() => handleAppendClick(record)}>
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

                <Button type="text" onClick={() => handleEditClick(record)}>
                  修改
                </Button>
              </Space>
            </span>
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
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={flattenCatIds(rows)}
          strategy={verticalListSortingStrategy}
        >
          <Table<CategoryNode>
            rowKey="catId"
            size="small"
            components={{ body: { row: Row } }}
            loading={loading || saving}
            columns={columns}
            dataSource={rows}
            rowSelection={rowSelection}
            pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
          />
        </SortableContext>
      </DndContext>
      {contextHolder}
      {formNode}
    </Card>
  );
};

type RowProps = HTMLAttributes<HTMLTableRowElement> & {
  'data-row-key'?: string | number;
};

const Row: React.FC<RowProps> = (props) => {
  const { children, style, 'data-row-key': rowKey, ...rest } = props;
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({ id: rowKey ?? '' });

  const mergedStyle: React.CSSProperties = {
    ...style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <tr
      ref={setNodeRef}
      style={mergedStyle}
      data-row-key={rowKey}
      {...attributes}
      {...listeners}
      {...rest}
    >
      {children}
    </tr>
  );
};

export default Category;
