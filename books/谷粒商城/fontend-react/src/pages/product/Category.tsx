import React, { FC, HTMLAttributes, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Flex,
  Modal,
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
  attachAsChild,
  detachNode,
  findNodeByPath,
  findNodePath,
  flattenCatIds,
  getListByPath,
  isDescendantPath,
  isSameParent,
  pathOf,
  shiftSubtreeLevels,
  subtreeDepth,
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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();

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
      setSelectedRowKeys(newSelectedRowKeys);
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
      if (!activeLoc || !overLoc) return;

      const activePath = pathOf(activeLoc);
      const overPath = pathOf(overLoc);
      const activeNode = findNodeByPath(rows, activePath);
      const overNode = findNodeByPath(rows, overPath);
      if (!activeNode || !overNode) return;

      // 同父：仅重排 siblings
      if (isSameParent(activeLoc.parentPath, overLoc.parentPath)) {
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
        return;
      }

      // 跨父：前端先做同款校验，避免点了才吃 400
      if (isDescendantPath(activePath, overPath)) {
        notificationApi.warning({ title: '不能移动到自己的后代分类下' });
        return;
      }
      const newLevel = overNode.catLevel + 1;
      const maxDescendant = newLevel + subtreeDepth(activeNode) - 1;
      if (maxDescendant > 3) {
        notificationApi.warning({
          title: `移动后子树最深层级 ${maxDescendant}，超过 3 级上限`,
        });
        return;
      }

      // 乐观更新：摘出 -> 平移 catLevel/parentCid -> 挂到 over.children 末尾
      const [treeWithout, moved] = detachNode(rows, activePath);
      const overLocAfter = findNodePath(treeWithout, over.id);
      if (!overLocAfter) return;
      const levelDelta = newLevel - moved.catLevel;
      const movedNext = shiftSubtreeLevels(moved, levelDelta, overNode.catId);
      let nextTree = attachAsChild(
        treeWithout,
        overLocAfter.parentPath,
        movedNext,
      );
      // 双侧 sibling sort 与后端 move() 保持同步（0..n-1）
      const newSiblings = getListByPath(nextTree, overLocAfter.parentPath).map(
        (n, i) => ({ ...n, sort: i }),
      );
      nextTree = updateListByPath(
        nextTree,
        overLocAfter.parentPath,
        newSiblings,
      );
      const srcSiblings = getListByPath(nextTree, activeLoc.parentPath).map(
        (n, i) => ({ ...n, sort: i }),
      );
      nextTree = updateListByPath(nextTree, activeLoc.parentPath, srcSiblings);
      setRows(nextTree);

      setSaving(true);
      try {
        const res = await gulimallApi.categoryMove({
          draggedCatId: activeNode.catId,
          newParentCid: overNode.catId,
        });
        if (res.code !== 0) throw new Error(res.msg || '移动失败');
      } catch (e) {
        notificationApi.error({
          title: '移动保存失败',
          description: e instanceof Error ? e.message : String(e),
        });
        loadingData();
      } finally {
        setSaving(false);
      }
    },
  );
  const handleBatchDelete = useMemoizedFn(() => {
    modalApi.confirm({
      content: '确认删除么',
      onOk: () => {
        return gulimallApi
          .categoryDelete(selectedRowKeys as number[])
          .then(() => {
            notificationApi.success({ description: '删除成功' });
            loadingData();
          })
          .catch((e) => {
            notificationApi.error({
              title: '移动保存失败',
              description: e instanceof Error ? e.message : String(e),
            });
            loadingData();
          });
      },
    });
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
      <Space style={{ width: '100%' }} vertical>
        <Flex>
          <Button
            disabled={selectedRowKeys.length == 0}
            onClick={handleBatchDelete}
            danger
          >
            批量删除
          </Button>
        </Flex>

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
      </Space>
      {contextHolder}
      {formNode}
      {modalContextHolder}
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
