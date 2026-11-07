import { useState, type Key } from 'react';
import { Alert, Modal, Spin, Transfer } from 'antd';
import type { TransferDirection } from 'antd/es/transfer';
import { useMemoizedFn, useMount } from 'ahooks';
import { gulimallApi } from '@/api';
import { message } from '@/api/feedback';
import type { Attr, AttrGroup } from '@/types';

type Props = {
  attrGroup: AttrGroup;
  onClose: () => void;
  /** 关联发生变化后通知外层刷新分组列表 */
  onChanged: () => void;
};

type Item = { key: number; title: string; description?: string };

const toItem = (a: Attr): Item => ({
  key: a.attrId,
  title: a.attrName,
  description: a.valueSelect,
});

/**
 * 关联属性穿梭框。左侧候选 = 该分类下未进任何分组的基本属性，右侧 = 本组已关联的。
 * 一个属性最多属于一个分组，所以已在别的组里的属性不会出现在候选中。
 */
export function AttrGroupRelationModal({ attrGroup, onClose, onChanged }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [targetKeys, setTargetKeys] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useMemoizedFn(async () => {
    setLoading(true);
    setError('');
    try {
      const [related, free] = await Promise.all([
        gulimallApi.attrGroupRelationAttrs(attrGroup.attrGroupId),
        gulimallApi.attrGroupNoRelationAttrs(attrGroup.catelogId),
      ]);
      if (related.code !== 0 || free.code !== 0) {
        setError(related.msg || free.msg || '关联属性加载失败');
        return;
      }
      const relatedAttrs = related.data ?? [];
      setItems([...relatedAttrs, ...(free.data ?? [])].map(toItem));
      setTargetKeys(relatedAttrs.map((a) => a.attrId));
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  });

  useMount(() => void load());

  const handleChange = useMemoizedFn(
    async (next: Key[], direction: TransferDirection, moveKeys: Key[]) => {
      const prev = targetKeys;
      setTargetKeys(next as number[]);
      setSaving(true);
      try {
        const relations = moveKeys.map((k) => ({
          attrId: Number(k),
          attrGroupId: attrGroup.attrGroupId,
        }));
        const res =
          direction === 'right'
            ? await gulimallApi.attrGroupRelationSave(relations)
            : await gulimallApi.attrGroupRelationDelete(relations);
        if (res.code !== 0) {
          message.error(res.msg || (direction === 'right' ? '关联失败' : '取消关联失败'));
          setTargetKeys(prev);
          return;
        }
        message.success(direction === 'right' ? '关联成功' : '已取消关联');
        onChanged();
        await load();
      } catch (e) {
        message.error(String(e));
        setTargetKeys(prev);
      } finally {
        setSaving(false);
      }
    },
  );

  return (
    <Modal
      title={`关联属性 - ${attrGroup.attrGroupName}`}
      open
      width={760}
      footer={null}
      onCancel={onClose}
      destroyOnHidden
    >
      <Spin spinning={loading || saving}>
        {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} />}
        <Transfer<Item>
          dataSource={items}
          targetKeys={targetKeys}
          onChange={handleChange}
          render={(item) => <span title={item.description}>{item.title}</span>}
          titles={['可关联', '已关联']}
          showSearch
          styles={{ section: { width: '46%', height: 360 } }}
        />
      </Spin>
    </Modal>
  );
}