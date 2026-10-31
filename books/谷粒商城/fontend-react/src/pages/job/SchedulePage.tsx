import { useEffect, useState } from 'react';
import { message, confirm } from '@/api/feedback';
import { Alert, Button, Card, Col, Form, Input, Modal, Row, Space, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { assertOk, renrenApi } from '@/api';
import type { ScheduleJob, ScheduleJobLog } from '@/types';
import { useAuthStore } from '@/store/auth';
import { paginationProps, usePageList } from '@/hooks/usePageList';

function JobModal({
  open, editId, onClose, onSuccess
}: {
  open: boolean;
  editId?: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form] = Form.useForm<{ beanName: string; params?: string; cronExpression: string; remark?: string }>();
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const isEdit = !!editId;

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    setStatus(undefined);
    if (editId) {
      void renrenApi.scheduleInfo(editId).then((data) => {
        if (assertOk(data) && data.schedule) {
          setStatus(data.schedule.status);
          form.setFieldsValue({
            beanName: data.schedule.beanName,
            params: data.schedule.params,
            cronExpression: data.schedule.cronExpression,
            remark: data.schedule.remark
          });
        }
      });
    }
  }, [open, editId, form]);

  const submit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      // 对应 SPEC：create 不带 status（服务端强制 NORMAL）；update 携带原 status
      const payload = {
        jobId: editId,
        ...values,
        status: isEdit ? status : undefined
      };
      const data = isEdit ? await renrenApi.scheduleUpdate(payload) : await renrenApi.scheduleSave(payload);
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
      title={isEdit ? '修改定时任务' : '新增定时任务'}
      open={open}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={saving}
      destroyOnHidden
    >
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        <Form.Item name="beanName" label="bean名称" rules={[{ required: true, message: 'bean名称不能为空' }]}>
          <Input placeholder="spring bean名称, 如: testTask" autoComplete="off" />
        </Form.Item>
        <Form.Item name="params" label="参数">
          <Input.TextArea rows={2} placeholder="参数" />
        </Form.Item>
        <Form.Item name="cronExpression" label="cron表达式" rules={[{ required: true, message: 'cron表达式不能为空' }]}>
          <Input placeholder="如: 0 0 12 * * ?" autoComplete="off" />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function LogModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [jobId, setJobId] = useState('');
  const [list, setList] = useState<ScheduleJobLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const doQuery = async (p = page, l = limit, jid = jobId) => {
    setLoading(true);
    try {
      const data = await renrenApi.scheduleLogList({
        page: p,
        limit: l,
        jobId: jid || undefined
      });
      if (data && data.code === 0 && data.page) {
        setList(data.page.list ?? []);
        setTotal(data.page.totalCount ?? 0);
      } else {
        assertOk(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setPage(1);
      void doQuery(1, limit, jobId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const show = async (row: ScheduleJobLog) => {
    if (row.status === 0) return;
    const data = await renrenApi.scheduleLogInfo(row.logId);
    Modal.error({ title: '错误信息', content: <pre style={{ whiteSpace: 'pre-wrap' }}>{data.log?.error}</pre> });
  };

  const columns: ColumnsType<ScheduleJobLog> = [
    { title: '日志ID', dataIndex: 'logId', width: 80 },
    { title: '任务ID', dataIndex: 'jobId', width: 80 },
    { title: 'bean名称', dataIndex: 'beanName' },
    { title: '参数', dataIndex: 'params', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (v: number, row) =>
        v === 0 ? (
          <Tag color="success">成功</Tag>
        ) : (
          <Tag color="error" style={{ cursor: 'pointer' }} onClick={() => void show(row)}>
            失败
          </Tag>
        )
    },
    { title: '耗时(毫秒)', dataIndex: 'times', width: 100 },
    { title: '执行时间', dataIndex: 'createTime', width: 180 }
  ];

  const handlePageChange = (p: number, l: number) => {
    const np = l !== limit ? 1 : p;
    setPage(np);
    setLimit(l);
    void doQuery(np, l);
  };

  return (
    <Modal title="定时任务 - 日志列表" open={open} onCancel={onClose} footer={null} width="75%" destroyOnHidden>
      <Space style={{ marginBottom: 12 }}>
        <Input
          placeholder="任务ID"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          onPressEnter={() => {
            setPage(1);
            void doQuery(1, limit, jobId);
          }}
          style={{ width: 160 }}
          allowClear
        />
        <Button type="primary" onClick={() => { setPage(1); void doQuery(1, limit); }}>
          查询
        </Button>
      </Space>
      <Table
        rowKey="logId"
        size="middle"
        loading={loading}
        columns={columns}
        dataSource={list}
        scroll={{ y: 420 }}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showTotal: (t) => `共 ${t} 条`,
          onChange: handlePageChange
        }}
      />
    </Modal>
  );
}

/** 对应 views/modules/job/schedule.vue；status: 0=正常 1=暂停（与用户状态相反，SPEC D10） */
export default function SchedulePage() {
  const isAuth = useAuthStore((s) => s.isAuth);
  const [beanName, setBeanName] = useState('');
  const pl = usePageList<ScheduleJob>(renrenApi.scheduleList, { beanName: beanName || undefined });
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<{ open: boolean; id?: number }>({ open: false });
  const [logOpen, setLogOpen] = useState(false);

  const batch = (action: 'delete' | 'pause' | 'resume' | 'run', label: string, ids: number[]) => {
    confirm({
      title: '提示',
      content: `确定进行[id=${ids.join(',')}]进行[${label}]操作?`,
      onOk: async () => {
        const data = await renrenApi.scheduleAction(action, ids);
        if (assertOk(data)) {
          message.success('操作成功');
          if (action === 'delete') setSelected([]);
          pl.refresh();
        }
      }
    });
  };

  const columns: ColumnsType<ScheduleJob> = [
    { title: 'ID', dataIndex: 'jobId', width: 80 },
    { title: 'bean名称', dataIndex: 'beanName' },
    { title: '参数', dataIndex: 'params', ellipsis: true },
    { title: 'cron表达式', dataIndex: 'cronExpression', ellipsis: true },
    { title: '备注', dataIndex: 'remark', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (v: number) => (v === 0 ? <Tag color="success">正常</Tag> : <Tag color="error">暂停</Tag>)
    },
    {
      title: '操作',
      width: 300,
      render: (_, row) => (
        <Space size={4} wrap>
          {isAuth('sys:schedule:update') && (
            <Button size="small" type="link" onClick={() => setModal({ open: true, id: row.jobId })}>
              修改
            </Button>
          )}
          {isAuth('sys:schedule:delete') && (
            <Button size="small" type="link" danger onClick={() => batch('delete', '删除', [row.jobId])}>
              删除
            </Button>
          )}
          {isAuth('sys:schedule:pause') && (
            <Button size="small" type="link" onClick={() => batch('pause', '暂停', [row.jobId])}>
              暂停
            </Button>
          )}
          {isAuth('sys:schedule:resume') && (
            <Button size="small" type="link" onClick={() => batch('resume', '恢复', [row.jobId])}>
              恢复
            </Button>
          )}
          {isAuth('sys:schedule:run') && (
            <Button size="small" type="link" onClick={() => batch('run', '立即执行', [row.jobId])}>
              立即执行
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Alert
          style={{ marginBottom: 12 }}
          type="info"
          showIcon
          message="定时任务在后端 Quartz 与数据库双侧同步；「立即执行」只触发一次，不改变 cron 与状态。"
        />
        <Space style={{ marginBottom: 12 }} wrap>
          <Input
            placeholder="bean名称"
            allowClear
            value={beanName}
            onChange={(e) => setBeanName(e.target.value)}
            onPressEnter={() => pl.query({ beanName: beanName || undefined })}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={() => pl.query({ beanName: beanName || undefined })}>
            查询
          </Button>
          {isAuth('sys:schedule:save') && (
            <Button type="primary" ghost onClick={() => setModal({ open: true })}>
              新增
            </Button>
          )}
          {isAuth('sys:schedule:delete') && (
            <Button danger disabled={!selected.length} onClick={() => batch('delete', '删除', selected)}>
              批量删除
            </Button>
          )}
          {isAuth('sys:schedule:pause') && (
            <Button danger disabled={!selected.length} onClick={() => batch('pause', '暂停', selected)}>
              批量暂停
            </Button>
          )}
          {isAuth('sys:schedule:resume') && (
            <Button danger disabled={!selected.length} onClick={() => batch('resume', '恢复', selected)}>
              批量恢复
            </Button>
          )}
          {isAuth('sys:schedule:run') && (
            <Button danger disabled={!selected.length} onClick={() => batch('run', '立即执行', selected)}>
              批量立即执行
            </Button>
          )}
          {isAuth('sys:schedule:log') && (
            <Tooltip title="查看任务执行日志">
              <Button onClick={() => setLogOpen(true)}>日志列表</Button>
            </Tooltip>
          )}
        </Space>
        <Card styles={{ body: { padding: 0 } }}>
          <Table
            rowKey="jobId"
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
      <JobModal
        open={modal.open}
        editId={modal.id}
        onClose={() => setModal({ open: false })}
        onSuccess={pl.refresh}
      />
      <LogModal open={logOpen} onClose={() => setLogOpen(false)} />
    </Row>
  );
}
