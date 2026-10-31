import { useEffect, useState } from 'react';
import { message, confirm } from '@/api/feedback';
import { Button, Card, Col, Form, Input, Modal, Row, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { apiGet, apiPost, assertOk } from '@/api/http';
import type { R, SysConfig } from '@/types';
import { paginationProps, usePageList } from '@/hooks/usePageList';

function ConfigModal({
  open, editId, onClose, onSuccess
}: {
  open: boolean;
  editId?: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form] = Form.useForm<{ paramKey: string; paramValue: string; remark?: string }>();
  const [saving, setSaving] = useState(false);
  const isEdit = !!editId;

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (editId) {
      void apiGet<R & { config?: SysConfig }>(`/sys/config/info/${editId}`).then((data) => {
        if (assertOk(data) && data.config) {
          form.setFieldsValue({
            paramKey: data.config.paramKey,
            paramValue: data.config.paramValue,
            remark: data.config.remark
          });
        }
      });
    }
  }, [open, editId, form]);

  const submit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const data = await apiPost('/sys/config/' + (isEdit ? 'update' : 'save'), {
        id: editId,
        ...values
      });
      if (assertOk(data)) {
        message.success('操作成功');
        onClose();
        onSuccess();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={isEdit ? '修改参数配置' : '新增参数配置'}
      open={open}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={saving}
      destroyOnHidden
    >
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        <Form.Item name="paramKey" label="参数名" rules={[{ required: true, message: '参数名不能为空' }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="paramValue" label="参数值" rules={[{ required: true, message: '参数值不能为空' }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

/** 对应 views/modules/sys/config.vue（原版按钮无 isAuth 控制，后端强制校验；这里对齐原版始终显示） */
export default function ConfigPage() {
  const [paramKey, setParamKey] = useState('');
  const pl = usePageList<SysConfig>('/sys/config/list', { paramKey: paramKey || undefined });
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<{ open: boolean; id?: number }>({ open: false });

  const doDelete = (ids: number[]) => {
    confirm({
      title: '提示',
      content: `确定进行[${ids.length === 1 ? '单条' : '批量'}删除]操作? id=${ids.join(',')}`,
      onOk: async () => {
        const data = await apiPost('/sys/config/delete', ids, { raw: true });
        if (assertOk(data)) {
          message.success('操作成功');
          setSelected([]);
          pl.refresh();
        }
      }
    });
  };

  const columns: ColumnsType<SysConfig> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '参数名', dataIndex: 'paramKey' },
    { title: '参数值', dataIndex: 'paramValue' },
    { title: '备注', dataIndex: 'remark' },
    {
      title: '操作',
      width: 150,
      render: (_, row) => (
        <Space>
          <Button size="small" onClick={() => setModal({ open: true, id: row.id })}>
            修改
          </Button>
          <Button size="small" danger onClick={() => doDelete([row.id])}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Space style={{ marginBottom: 12 }} wrap>
          <Input
            placeholder="参数名"
            allowClear
            value={paramKey}
            onChange={(e) => setParamKey(e.target.value)}
            onPressEnter={() => pl.query({ paramKey: paramKey || undefined })}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={() => pl.query({ paramKey: paramKey || undefined })}>
            查询
          </Button>
          <Button type="primary" ghost onClick={() => setModal({ open: true })}>
            新增
          </Button>
          <Button danger disabled={!selected.length} onClick={() => doDelete(selected)}>
            批量删除
          </Button>
        </Space>
        <Card styles={{ body: { padding: 0 } }}>
          <Table
            rowKey="id"
            size="middle"
            loading={pl.loading}
            columns={columns}
            dataSource={pl.list}
            pagination={paginationProps(pl)}
            rowSelection={{
              selectedRowKeys: selected,
              onChange: (keys) => setSelected(keys as number[])
            }}
          />
        </Card>
      </Col>
      <ConfigModal
        open={modal.open}
        editId={modal.id}
        onClose={() => setModal({ open: false })}
        onSuccess={pl.refresh}
      />
    </Row>
  );
}
