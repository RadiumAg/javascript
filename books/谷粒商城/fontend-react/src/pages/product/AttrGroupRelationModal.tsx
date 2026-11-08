import { useMemo, useState } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Flex, Input, Modal, Table, Tag } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import { useMemoizedFn, useMount } from 'ahooks';
import { gulimallApi } from '@/api';
import { message } from '@/api/feedback';
import type { Attr, AttrGroup, CategoryNode } from '@/types';
import { buildAttrColumns } from './attrColumns';

type Props = {
  attrGroup: AttrGroup;
  onClose: () => void;
  /** 关联发生变化后通知外层刷新分组列表 */
  onChanged: () => void;
};

function collectCatNames(nodes: CategoryNode[], into: Map<number, string>) {
  for (const n of nodes) {
    into.set(n.catId, n.name);
    if (n.children?.length) collectCatNames(n.children, into);
  }
  return into;
}

/**
 * 分组 <-> 基本属性 的关联维护。
 * 一个属性最多属于一个分组，所以已在别的组里的属性不会出现在候选中。
 */
export function AttrGroupRelationModal({ attrGroup, onClose, onChanged }: Props) {
  const [related, setRelated] = useState<Attr[]>([]);
  const [free, setFree] = useState<Attr[]>([]);
  const [catNames, setCatNames] = useState<Map<number, string>>(new Map());
  const [selectedRelated, setSelectedRelated] = useState<number[]>([]);
  const [selectedFree, setSelectedFree] = useState<number[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [kw, setKw] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const columns = useMemo(
    () => buildAttrColumns((id) => catNames.get(id) ?? String(id)),
    [catNames],
  );

  const load = useMemoizedFn(async () => {
    setLoading(true);
    setError('');
    try {
      const [rel, noRel, tree] = await Promise.all([
        gulimallApi.attrGroupRelationAttrs(attrGroup.attrGroupId),
        gulimallApi.attrGroupNoRelationAttrs(attrGroup.catelogId),
        gulimallApi.categoryTree(),
      ]);
      if (rel.code !== 0 || noRel.code !== 0) {
        setError(rel.msg || noRel.msg || '关联属性加载失败');
        return;
      }
      setRelated(rel.data ?? []);
      setFree(noRel.data ?? []);
      if (tree.code === 0) setCatNames(collectCatNames(tree.data ?? [], new Map()));
      setSelectedRelated([]);
      setSelectedFree([]);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  });

  useMount(() => void load());

  const handleRemove = useMemoizedFn(async () => {
    setSaving(true);
    try {
      const relations = selectedRelated.map((attrId) => ({
        attrId,
        attrGroupId: attrGroup.attrGroupId,
      }));
      const res = await gulimallApi.attrGroupRelationDelete(relations);
      if (res.code !== 0) {
        message.error(res.msg || '取消关联失败');
        return;
      }
      message.success('已取消关联');
      onChanged();
      await load();
    } catch (e) {
      message.error(String(e));
    } finally {
      setSaving(false);
    }
  });

  const handleAdd = useMemoizedFn(async () => {
    setSaving(true);
    try {
      const relations = selectedFree.map((attrId) => ({
        attrId,
        attrGroupId: attrGroup.attrGroupId,
      }));
      const res = await gulimallApi.attrGroupRelationSave(relations);
      if (res.code !== 0) {
        message.error(res.msg || '关联失败');
        return;
      }
      message.success('关联成功');
      setAddOpen(false);
      setKw('');
      onChanged();
      await load();
    } catch (e) {
      message.error(String(e));
    } finally {
      setSaving(false);
    }
  });

  const relatedSelection: TableRowSelection<Attr> = {
    selectedRowKeys: selectedRelated,
    onChange: (keys) => setSelectedRelated(keys as number[]),
  };
  const freeSelection: TableRowSelection<Attr> = {
    selectedRowKeys: selectedFree,
    onChange: (keys) => setSelectedFree(keys as number[]),
  };

  const lower = kw.trim().toLowerCase();
  const freeRows = lower ? free.filter((a) => a.attrName.toLowerCase().includes(lower)) : free;

  return (
    <Modal
      title={`关联属性 - ${attrGroup.attrGroupName}`}
      open
      width={1000}
      footer={null}
      onCancel={onClose}
      destroyOnHidden
    >
      {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} />}
      <Flex gap={8} style={{ marginBottom: 12 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedFree([]);
            setKw('');
            setAddOpen(true);
          }}
        >
          添加关联
        </Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          disabled={selectedRelated.length === 0}
          loading={saving}
          onClick={handleRemove}
        >
          批量解除关联
        </Button>
      </Flex>
      <Table<Attr>
        rowKey="attrId"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={related}
        rowSelection={relatedSelection}
        pagination={{ pageSize: 5, showTotal: (t) => `已关联 ${t} 条` }}
        scroll={{ x: 800 }}
      />

      <Modal
        title="添加关联"
        open={addOpen}
        width={1000}
        onCancel={() => setAddOpen(false)}
        onOk={handleAdd}
        okText="保存"
        okButtonProps={{ disabled: selectedFree.length === 0, loading: saving }}
        destroyOnHidden
      >
        <Flex gap={8} style={{ marginBottom: 12 }}>
          <Input.Search
            placeholder="搜索属性名"
            allowClear
            style={{ width: 240 }}
            value={kw}
            onChange={(e) => setKw(e.target.value)}
          />
          <Tag color="blue">{freeRows.length} 个待选属性</Tag>
        </Flex>
        <Table<Attr>
          rowKey="attrId"
          size="small"
          loading={loading}
          columns={columns}
          dataSource={freeRows}
          rowSelection={freeSelection}
          pagination={{ pageSize: 5, showTotal: (t) => `共 ${t} 条` }}
          scroll={{ x: 800 }}
        />
      </Modal>
    </Modal>
  );
}
