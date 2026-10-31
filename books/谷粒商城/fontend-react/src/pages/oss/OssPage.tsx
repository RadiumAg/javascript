import { useState } from 'react';
import { message, confirm } from '@/api/feedback';
import { Button, Card, Col, Form, Input, Modal, Radio, Row, Space, Table, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { InboxOutlined } from '@ant-design/icons';
import { API_BASE, apiGet, apiPost, assertOk, getToken } from '@/api/http';
import type { CloudStorageConfig, R, SysOss } from '@/types';
import { paginationProps, usePageList } from '@/hooks/usePageList';

const TYPE_NAMES: Record<string, string[]> = {
  qiniu: ['qiniuDomain', 'qiniuPrefix', 'qiniuAccessKey', 'qiniuSecretKey', 'qiniuBucketName'],
  aliyun: ['aliyunDomain', 'aliyunPrefix', 'aliyunEndPoint', 'aliyunAccessKeyId', 'aliyunAccessKeySecret', 'aliyunBucketName'],
  qcloud: ['qcloudDomain', 'qcloudPrefix', 'qcloudAppId', 'qcloudSecretId', 'qcloudSecretKey', 'qcloudBucketName', 'qcloudRegion']
};

function OssConfigModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm<CloudStorageConfig>();
  const [saving, setSaving] = useState(false);
  const type = Form.useWatch('type', form);

  const load = async () => {
    const data = await apiGet<R & { config?: CloudStorageConfig }>('/sys/oss/config');
    if (assertOk(data)) {
      // 原版：未配置过时 dataForm 直接置空对象
      form.setFieldsValue((data.config ?? {}) as Partial<CloudStorageConfig>);
    }
  };

  const submit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      // 保存整个表单（含未展开的其它组字段），与 Vue 版一致
      const data = await apiPost('/sys/oss/saveConfig', { ...form.getFieldsValue(true), ...values });
      if (assertOk(data)) {
        message.success('操作成功');
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  const group = (keys: string[], labels: string[], extra?: Record<string, string>) =>
    keys.map((k, i) => (
      <Form.Item
        key={k}
        name={k}
        label={labels[i]}
        extra={extra?.[k]}
        rules={k.endsWith('Domain') || k.endsWith('Prefix') ? [] : undefined}
      >
        {k === 'qcloudAppId' ? <Input type="number" /> : <Input autoComplete="off" />}
      </Form.Item>
    ));

  return (
    <Modal
      title="云存储配置"
      open={open}
      onCancel={onClose}
      afterOpenChange={(v) => {
        if (v) void load();
      }}
      onOk={submit}
      confirmLoading={saving}
      destroyOnHidden
      width={640}
    >
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        <Form.Item name="type" label="存储类型" rules={[{ required: true, message: '请选择存储类型' }]}>
          <Radio.Group
            onChange={() => {
              // 切换类型时清空其它类型字段，避免把空串提交给后端分组校验
              const keep = new Set(['type', ...(TYPE_NAMES[
                ({ 1: 'qiniu', 2: 'aliyun', 3: 'qcloud' } as Record<number, string>)[Number(form.getFieldValue('type'))] ?? 'qiniu'
              ])]);
              const all: Record<string, undefined> = {};
              [...TYPE_NAMES.qiniu, ...TYPE_NAMES.aliyun, ...TYPE_NAMES.qcloud].forEach((k) => {
                if (!keep.has(k)) all[k] = undefined;
              });
              form.setFieldsValue(all);
            }}
          >
            <Radio value={1}>七牛云存储</Radio>
            <Radio value={2}>阿里云OSS</Radio>
            <Radio value={3}>腾讯云COS</Radio>
          </Radio.Group>
        </Form.Item>
        {type === 1 &&
          group(TYPE_NAMES.qiniu, ['域名', '路径前缀', 'AccessKey', 'SecretKey', '空间名'], {
            qiniuDomain: '例: http://qny.renren.io'
          })}
        {type === 2 &&
          group(TYPE_NAMES.aliyun, ['域名', '路径前缀', 'Endpoint', 'AccessKeyId', 'AccessKeySecret', '空间名'], {
            aliyunDomain: '例: http://aliyun.renren.io:8880'
          })}
        {type === 3 &&
          group(TYPE_NAMES.qcloud, ['域名', '路径前缀', 'AppId', 'SecretId', 'SecretKey', '空间名', '地域(Region)'], {
            qcloudDomain: '例: http://qcloud.renren.io'
          })}
      </Form>
    </Modal>
  );
}

function OssUploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [fileList, setFileList] = useState<any[]>([]);
  const acceptTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  return (
    <Modal
      title="上传文件"
      open={open}
      footer={null}
      destroyOnHidden
      onCancel={onClose}
    >
      <p style={{ color: '#999' }}>只支持 jpg、png、gif 格式的图片</p>
      <Upload.Dragger
        name="file"
        multiple
        accept=".jpg,.jpeg,.png,.gif"
        action={`${API_BASE}/sys/oss/upload?token=${encodeURIComponent(getToken())}`}
        fileList={fileList}
        beforeUpload={(file) => {
          if (!acceptTypes.includes(file.type)) {
            message.error('只支持jpg、png、gif格式的图片！');
            return Upload.LIST_IGNORE;
          }
          return file;
        }}
        onChange={({ file, fileList: fl }) => {
          if (file.status === 'done') {
            const res = file.response as R | undefined;
            if (res && res.code !== 0) message.error(res.msg || '上传失败');
          }
          setFileList(fl);
        }}
        onRemove={(file) => setFileList((fl) => fl.filter((f) => f.uid !== file.uid))}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到这里上传</p>
      </Upload.Dragger>
    </Modal>
  );
}

/** 对应 views/modules/oss/oss.vue（原版按钮无 isAuth，后端统一 sys:oss:all，SPEC D13） */
export default function OssPage() {
  const pl = usePageList<SysOss>('/sys/oss/list', {});
  const [selected, setSelected] = useState<number[]>([]);
  const [configOpen, setConfigOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const doDelete = (ids: number[]) => {
    confirm({
      title: '提示',
      content: `确定进行[${ids.length === 1 ? '单条' : '批量'}删除]操作? id=${ids.join(',')}`,
      onOk: async () => {
        const data = await apiPost('/sys/oss/delete', ids, { raw: true });
        if (assertOk(data)) {
          message.success('操作成功');
          setSelected([]);
          pl.refresh();
        }
      }
    });
  };

  const columns: ColumnsType<SysOss> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'URL地址', dataIndex: 'url', ellipsis: true },
    { title: '创建时间', dataIndex: 'createDate', width: 180 },
    {
      title: '操作',
      width: 100,
      render: (_, row) => (
        <Button size="small" danger onClick={() => doDelete([row.id])}>
          删除
        </Button>
      )
    }
  ];

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Space style={{ marginBottom: 12 }} wrap>
          <Button onClick={() => setConfigOpen(true)}>云存储配置</Button>
          <Button type="primary" onClick={() => setUploadOpen(true)}>
            上传文件
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
      <OssConfigModal open={configOpen} onClose={() => setConfigOpen(false)} />
      <OssUploadModal
        open={uploadOpen}
        onClose={() => {
          setUploadOpen(false);
          pl.refresh(); // 对应 Vue 版 close 时 emit refreshDataList
        }}
      />
    </Row>
  );
}
