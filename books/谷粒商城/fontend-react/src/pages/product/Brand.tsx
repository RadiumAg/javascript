import { FC, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { assertOk, gulimallApi } from '@/api';
import { confirm, message } from '@/api/feedback';
import type { Brand } from '@/types';
import { useMemoizedFn, useMount } from 'ahooks';
import type { BrandPayload } from '@/api/gulimall';
import { paginationProps, usePageList } from '@/hooks/usePageList';

type Filter = { name?: string; showStatus?: number; firstLetter?: string };

function BrandModal({
  open,
  record,
  onClose,
  onSuccess,
}: {
  open: boolean;
  record?: Brand;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form] = Form.useForm<BrandPayload>();
  const [saving, setSaving] = useState(false);
  const isEdit = !!record;

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.setFieldsValue({ showStatus: 1, sort: 0 });
    }
  }, [open, record, form]);

  const submit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const payload: BrandPayload = isEdit
        ? { ...values, brandId: record!.brandId }
        : values;
      const res = isEdit
        ? await gulimallApi.brandUpdate(payload)
        : await gulimallApi.brandSave(payload);
      if (assertOk(res)) {
        message.success(isEdit ? '修改成功' : '新增成功');
        onClose();
        onSuccess();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={isEdit ? '修改品牌' : '新增品牌'}
      open={open}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={saving}
      destroyOnHidden
    >
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        <Form.Item
          name="name"
          label="品牌名"
          rules={[{ required: true, message: '品牌名不能为空' }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="logo" label="Logo">
          <Input autoComplete="off" placeholder="图片 URL" />
        </Form.Item>
        <Form.Item name="descript" label="描述">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="showStatus" label="显示状态">
          <Radio.Group
            options={[
              { label: '显示', value: 1 },
              { label: '隐藏', value: 0 },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="firstLetter"
          label="首字母"
          rules={[
            { pattern: /^[A-Za-z]$/, message: '单个大小写字母' },
          ]}
        >
          <Input autoComplete="off" maxLength={1} />
        </Form.Item>
        <Form.Item name="sort" label="排序">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

const BrandPage: FC = () => {
  const [filter, setFilter] = useState<Filter>({});
  const pl = usePageList<Brand>(gulimallApi.brandList, filter);
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<{ open: boolean; record?: Brand }>({
    open: false,
  });

  useMount(() => void pl.refresh());

  const doDelete = useMemoizedFn((ids: number[]) => {
    confirm({
      title: '提示',
      content: `确定进行[${ids.length === 1 ? '单条' : '批量'}删除]操作? id=${ids.join(',')}`,
      onOk: async () => {
        const res = await gulimallApi.brandDelete(ids);
        if (assertOk(res)) {
          message.success('删除成功');
          setSelected([]);
          pl.refresh();
        }
      },
    });
  });

  const columns: ColumnsType<Brand> = [
    { title: '品牌Id', dataIndex: 'brandId', width: 100 },
    { title: '品牌名', dataIndex: 'name', width: 160 },
    {
      title: 'Logo',
      dataIndex: 'logo',
      width: 80,
      render: (v?: string) =>
        v ? <Image src={v} width={40} height={40} /> : '-',
    },
    { title: '描述', dataIndex: 'descript', ellipsis: true },
    {
      title: '显示状态',
      dataIndex: 'showStatus',
      width: 100,
      render: (v: number) =>
        v === 1 ? <Tag color="green">显示</Tag> : <Tag>隐藏</Tag>,
    },
    { title: '首字母', dataIndex: 'firstLetter', width: 80 },
    { title: '排序', dataIndex: 'sort', width: 80 },
    {
      title: '操作',
      width: 160,
      render: (_, row) => (
        <Space>
          <Button size="small" onClick={() => setModal({ open: true, record: row })}>
            修改
          </Button>
          <Button size="small" danger onClick={() => doDelete([row.brandId])}>
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
          品牌管理 <Tag color="blue">{pl.total} 条</Tag>
        </>
      }
    >
      <Space style={{ marginBottom: 12 }} wrap>
        <Input
          placeholder="品牌名"
          allowClear
          value={filter.name}
          onChange={(e) =>
            setFilter((f) => ({ ...f, name: e.target.value || undefined }))
          }
          onPressEnter={() => pl.query(filter)}
          style={{ width: 160 }}
        />
        <Select
          placeholder="显示状态"
          allowClear
          value={filter.showStatus}
          onChange={(v) => setFilter((f) => ({ ...f, showStatus: v }))}
          options={[
            { label: '显示', value: 1 },
            { label: '隐藏', value: 0 },
          ]}
          style={{ width: 120 }}
        />
        <Input
          placeholder="首字母"
          allowClear
          maxLength={1}
          value={filter.firstLetter}
          onChange={(e) =>
            setFilter((f) => ({
              ...f,
              firstLetter: e.target.value || undefined,
            }))
          }
          onPressEnter={() => pl.query(filter)}
          style={{ width: 100 }}
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
        <Button type="primary" ghost onClick={() => setModal({ open: true })}>
          新增
        </Button>
        <Button danger disabled={!selected.length} onClick={() => doDelete(selected)}>
          批量删除
        </Button>
      </Space>
      <Table<Brand>
        rowKey="brandId"
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
      <BrandModal
        open={modal.open}
        record={modal.record}
        onClose={() => setModal({ open: false })}
        onSuccess={pl.refresh}
      />
    </Card>
  );
};

export default BrandPage;
