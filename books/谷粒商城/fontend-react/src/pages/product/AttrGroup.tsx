import { useState, type FC } from 'react';
import { Button, Card, Flex, Input, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemoizedFn } from 'ahooks';
import { assertOk, gulimallApi } from '@/api';
import { confirm, message } from '@/api/feedback';
import { ImageUpload } from '@/components/ImageUpload';
import { paginationProps, usePageList } from '@/hooks/usePageList';
import type { AttrGroup, CategoryNode } from '@/types';
import { CategoryTree } from './CategoryTree';
import { AttrGroupRelationModal } from './AttrGroupRelationModal';
import { useCreateOrEditAttrGroupForm } from './useCreateOrEditAttrGroupForm';

type Filter = { catelogId?: number; key?: string };

const AttrGroupPage: FC = () => {
  const [filter, setFilter] = useState<Filter>({});
  const [catName, setCatName] = useState('');
  const pl = usePageList<AttrGroup>(gulimallApi.attrGroupList, filter);
  const [selected, setSelected] = useState<number[]>([]);
  const [relationGroup, setRelationGroup] = useState<AttrGroup>();

  const { formNode, onOpen: open } = useCreateOrEditAttrGroupForm({
    defaultCatelogId: filter.catelogId,
    onOk: async (values, { record, type }) => {
      const res =
        type === 'add'
          ? await gulimallApi.attrGroupSave(values)
          : await gulimallApi.attrGroupUpdate({ ...values, attrGroupId: record!.attrGroupId });
      if (res.code !== 0) {
        message.error(res.msg || (type === 'add' ? '新增失败' : '修改失败'));
        return false;
      }
      message.success(type === 'add' ? '新增成功' : '修改成功');
      pl.refresh();
    },
  });

  const handleSelectCat = useMemoizedFn((catId?: number, node?: CategoryNode) => {
    const next = { ...filter, catelogId: catId };
    setFilter(next);
    setCatName(node?.name ?? '');
    setSelected([]);
    pl.query(next);
  });

  const doDelete = useMemoizedFn((ids: number[]) => {
    confirm({
      title: '提示',
      content: `确定删除 ${ids.length} 个分组? 组内属性关联会一并清除（属性本身保留）。id=${ids.join(',')}`,
      onOk: async () => {
        const res = await gulimallApi.attrGroupDelete(ids);
        if (assertOk(res)) {
          message.success('删除成功');
          setSelected([]);
          pl.refresh();
        }
      },
    });
  });

  const columns: ColumnsType<AttrGroup> = [
    { title: '分组Id', dataIndex: 'attrGroupId', width: 90 },
    { title: '组名', dataIndex: 'attrGroupName', width: 160 },
    { title: '所属分类Id', dataIndex: 'catelogId', width: 110 },
    { title: '排序', dataIndex: 'sort', width: 70 },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 70,
      render: (v?: string) => <ImageUpload value={v} />,
    },
    { title: '描述', dataIndex: 'descript', ellipsis: true },
    {
      title: '操作',
      width: 220,
      render: (_, row) => (
        <Space>
          <Button size="small" type="primary" ghost onClick={() => setRelationGroup(row)}>
            关联属性
          </Button>
          <Button size="small" onClick={() => open(row, 'edit')}>
            修改
          </Button>
          <Button size="small" danger onClick={() => doDelete([row.attrGroupId])}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Flex gap={12} align="stretch" style={{ margin: 12 }}>
      <div style={{ width: 260, flexShrink: 0 }}>
        <CategoryTree selectedCatId={filter.catelogId} onSelect={handleSelectCat} />
      </div>
      <Card
        size="small"
        style={{ flex: 1, minWidth: 0 }}
        title={
          <>
            属性分组 {catName && <Tag>{catName}</Tag>}
            <Tag color="blue">{pl.total} 条</Tag>
          </>
        }
      >
        <Space style={{ marginBottom: 12 }} wrap>
          <Input.Search
            placeholder="组名 / 组id"
            allowClear
            value={filter.key}
            onChange={(e) => setFilter((f) => ({ ...f, key: e.target.value || undefined }))}
            onSearch={(v) => pl.query({ ...filter, key: v || undefined })}
            style={{ width: 200 }}
          />
          <Button
            onClick={() => {
              setFilter({ catelogId: filter.catelogId });
              pl.query({ catelogId: filter.catelogId });
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
        <Table<AttrGroup>
          rowKey="attrGroupId"
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
      </Card>
      {formNode}
      {relationGroup && (
        <AttrGroupRelationModal
          attrGroup={relationGroup}
          onClose={() => setRelationGroup(undefined)}
          onChanged={() => pl.refresh()}
        />
      )}
    </Flex>
  );
};

export default AttrGroupPage;