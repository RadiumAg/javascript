import { useEffect, useState } from 'react';
import {
  Button, Card, Checkbox, Col, Form, Input, message, Modal, Radio, Row, Space, Table, Tag
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { apiGet, apiPost, assertOk } from '@/api/http';
import type { R, SysRole, SysUser } from '@/types';
import { isEmail, isMobile } from '@/utils';
import { useAuthStore } from '@/store/auth';
import { paginationProps, usePageList } from '@/hooks/usePageList';

interface UserForm {
  userName: string;
  password?: string;
  comfirmPassword?: string;
  email: string;
  mobile: string;
  roleIdList: number[];
  status: number;
}

function UserModal({
  open, editId, roles, onClose, onSuccess
}: {
  open: boolean;
  editId?: number;
  roles: SysRole[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form] = Form.useForm<UserForm>();
  const [saving, setSaving] = useState(false);
  const [salt, setSalt] = useState<string>('');
  const isEdit = !!editId;

  // 对应 user-add-or-update.vue init(id)：编辑时回填 info，salt 随表单一并提交供后端重新散列
  useEffect(() => {
    if (!open) return;
    form.resetFields();
    setSalt('');
    if (editId) {
      void apiGet<R & { user?: SysUser }>(`/sys/user/info/${editId}`).then((data) => {
        if (assertOk(data) && data.user) {
          setSalt(data.user.salt ?? '');
          form.setFieldsValue({
            userName: data.user.username,
            email: data.user.email,
            mobile: data.user.mobile,
            roleIdList: data.user.roleIdList ?? [],
            status: data.user.status
          });
        }
      });
    } else {
      form.setFieldsValue({ status: 1, roleIdList: [] });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const data = await apiPost('/sys/user/' + (isEdit ? 'update' : 'save'), {
        userId: editId,
        username: values.userName,
        password: values.password || undefined,
        salt,
        email: values.email,
        mobile: values.mobile,
        status: values.status,
        roleIdList: values.roleIdList
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
      title={isEdit ? '修改用户' : '新增用户'}
      open={open}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={saving}
      destroyOnHidden
      width={640}
    >
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
        <Form.Item name="userName" label="用户名" rules={[{ required: true, message: '用户名不能为空' }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: !isEdit, message: '密码不能为空' },
            { min: 6, message: '长度不能少于 6 个字符' }
          ]}
        >
          <Input.Password autoComplete="off" placeholder={isEdit ? '留空表示不修改密码' : ''} />
        </Form.Item>
        <Form.Item
          name="comfirmPassword"
          label="确认密码"
          dependencies={['password']}
          rules={[
            {
              validator: (_, value) => {
                if (!isEdit && !value) return Promise.reject(new Error('确认密码不能为空'));
                if (value && form.getFieldValue('password') !== value)
                  return Promise.reject(new Error('两次密码输入不一致'));
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input.Password autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '邮箱不能为空' },
            { validator: (_, v) => (!v || isEmail(v) ? Promise.resolve() : Promise.reject(new Error('邮箱格式不正确'))) }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="mobile"
          label="手机号"
          rules={[
            { required: true, message: '手机号不能为空' },
            { validator: (_, v) => (!v || isMobile(v) ? Promise.resolve() : Promise.reject(new Error('手机号格式不正确'))) }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="roleIdList" label="所属角色" rules={[{ required: true, message: '必须选择用户角色' }]}>
          <Checkbox.Group>
            <Space wrap>
              {roles.map((r) => (
                <Checkbox key={r.roleId} value={r.roleId}>
                  {r.roleName}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item name="status" label="状态" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value={1}>正常</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}

/** 对应 views/modules/sys/user.vue */
export default function UserPage() {
  const isAuth = useAuthStore((s) => s.isAuth);
  const [username, setUsername] = useState('');
  const pl = usePageList<SysUser>('/sys/user/list', { username: username || undefined });
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<{ open: boolean; id?: number }>({ open: false });
  const [roles, setRoles] = useState<SysRole[]>([]);

  const openModal = (id?: number) => {
    void apiGet<R & { list?: SysRole[] }>('/sys/role/select').then((data) => {
      if (assertOk(data)) {
        setRoles((data.list as SysRole[]) ?? []);
        setModal({ open: true, id });
      }
    });
  };

  const doDelete = (ids: number[]) => {
    Modal.confirm({
      title: '提示',
      content: `确定进行[${ids.length === 1 ? '单条' : '批量'}删除]操作? id=${ids.join(',')}`,
      onOk: async () => {
        const data = await apiPost('/sys/user/delete', ids, { raw: true });
        if (assertOk(data)) {
          message.success('操作成功');
          setSelected([]);
          pl.refresh();
        }
      }
    });
  };

  const columns: ColumnsType<SysUser> = [
    { title: 'ID', dataIndex: 'userId', width: 80 },
    { title: '用户名', dataIndex: 'username' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '手机号', dataIndex: 'mobile' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (v: number) => (v === 0 ? <Tag color="error">禁用</Tag> : <Tag color="success">正常</Tag>)
    },
    { title: '创建时间', dataIndex: 'createTime', width: 180 },
    {
      title: '操作',
      width: 150,
      render: (_, row) => (
        <Space>
          {isAuth('sys:user:update') && (
            <Button size="small" onClick={() => openModal(row.userId)}>
              修改
            </Button>
          )}
          {isAuth('sys:user:delete') && (
            <Button size="small" danger onClick={() => doDelete([row.userId])}>
              删除
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Space style={{ marginBottom: 12 }} wrap>
          <Input
            placeholder="用户名"
            allowClear
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onPressEnter={() => pl.query({ username: username || undefined })}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={() => pl.query({ username: username || undefined })}>
            查询
          </Button>
          {isAuth('sys:user:save') && (
            <Button type="primary" ghost onClick={() => openModal()}>
              新增
            </Button>
          )}
          {isAuth('sys:user:delete') && (
            <Button danger disabled={!selected.length} onClick={() => doDelete(selected)}>
              批量删除
            </Button>
          )}
        </Space>
        <Card styles={{ body: { padding: 0 } }}>
          <Table
            rowKey="userId"
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
      <UserModal
        open={modal.open}
        editId={modal.id}
        roles={roles}
        onClose={() => setModal({ open: false })}
        onSuccess={pl.refresh}
      />
    </Row>
  );
}
