import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Attr } from '@/types';

export const flag = (on: boolean) =>
  on ? (
    <CheckCircleFilled style={{ color: '#52c41a' }} />
  ) : (
    <CloseCircleFilled style={{ color: '#bfbfbf' }} />
  );

/** 可选值可能很长，只露第一个值，完整内容放 title */
export function ValueSelectCell({ value }: { value?: string }) {
  if (!value) return <span style={{ color: '#bfbfbf' }}>—</span>;
  const [first] = value.split(/[;,，；]/);
  const more = value.length > first.length;
  return (
    <Tag
      color="blue"
      title={value}
      style={{
        maxWidth: 120,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
      }}
    >
      {first}
      {more ? ' …' : ''}
    </Tag>
  );
}

/** 规格参数/销售属性/关联属性弹窗共用的属性列 */
export function buildAttrColumns(
  catNameOf: (id: number) => string,
): ColumnsType<Attr> {
  return [
    { title: '属性名', dataIndex: 'attrName', width: 130 },
    {
      title: '可检索',
      dataIndex: 'searchType',
      width: 80,
      align: 'center',
      render: (v: number) => flag(v === 1),
    },
    {
      title: '值类型',
      dataIndex: 'valueType',
      width: 90,
      align: 'center',
      render: (v: number) => (v === 1 ? <Tag color="cyan">多选</Tag> : <Tag>单选</Tag>),
    },
    { title: '图标', dataIndex: 'icon', width: 90, render: (v?: string) => v || '—' },
    {
      title: '可选值',
      dataIndex: 'valueSelect',
      width: 130,
      render: (v?: string) => <ValueSelectCell value={v} />,
    },
    {
      title: '启用',
      dataIndex: 'enable',
      width: 70,
      align: 'center',
      render: (v: number) => flag(v === 1),
    },
    {
      title: '所属分类',
      dataIndex: 'catelogId',
      width: 110,
      render: (v: number) => catNameOf(v),
    },
    {
      title: '快速展示',
      dataIndex: 'showDesc',
      width: 90,
      align: 'center',
      render: (v: number) => flag(v === 1),
    },
  ];
}
