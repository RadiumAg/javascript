import { useEffect, useState } from 'react';
import { message, confirm } from '@/api/feedback';
import { Button, Card, Form, Input, InputNumber, Modal, Radio, Space, Table, Tag, Tooltip, TreeSelect } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { apiGet, apiGetRaw, apiPost, assertOk } from '@/api/http';
import type { MenuNode, R } from '@/types';
import { treeDataTranslate } from '@/utils';
import { useAuthStore } from '@/store/auth';

const TYPE_LABELS = ['目录', '菜单', '按钮'];

interface MenuForm {
  type: number;
  name: string;
  parentId: number;
  url?: string;
  perms?: string;
  orderNum: number;
  icon?: string;
}

function MenuModal({
  open, editId, onClose, onSuccess
}: {
  open: boolean;
  editId?: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form] = Form.useForm<MenuForm>();
  const [parentTree, setParentTree] = useState<MenuNode[]>([]);
  const [saving, setSaving] = useState(false);
  const type = Form.useWatch('type', form);
  const isEdit = !!editId;

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    // /sys/menu/select：{code:0, menuList:[...]}（含合成根节点 menuId=0「一级菜单」），平铺数组再转树
    void apiGet<R & { menuList?: MenuNode[] }>('/sys/menu/select').then((data) => {
      if (assertOk(data)) {
        const tree = treeDataTranslate(data.menuList ?? [], 'menuId');
        setParentTree(tree);
        if (editId) {
          void apiGet<R & { menu?: MenuNode }>(`/sys/menu/info/${editId}`).then((d2) => {
            if (assertOk(d2) && d2.menu) {
              form.setFieldsValue({
                type: d2.menu.type,
                name: d2.menu.name,
                parentId: d2.menu.parentId,
                url: d2.menu.url,
                perms: d2.menu.perms,
                orderNum: d2.menu.orderNum ?? 0,
                icon: d2.menu.icon
              });
            }
          });
        } else {
          form.setFieldsValue({ type: 1, parentId: 0, orderNum: 0 });
        }
      }
    });
  }, [open, editId, form]);

  const submit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const data = await apiPost('/sys/menu/' + (isEdit ? 'update' : 'save'), {
        menuId: editId,
        type: values.type,
        name: values.name,
        parentId: values.parentId,
        url: values.url,
        perms: values.perms,
        orderNum: values.orderNum,
        icon: values.icon
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
      title={isEdit ? '修改菜单' : '新增菜单'}
      open={open}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={saving}
      destroyOnHidden
      width={640}
    >
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
        <Form.Item name="type" label="类型" rules={[{ required: true }]}>
          <Radio.Group
            options={TYPE_LABELS.map((label, i) => ({ label, value: i }))}
            optionType="button"
            onChange={(e) => {
              // 对齐 Vue 版：切换类型时清空上/下级相关字段
              form.setFieldsValue({ parentId: e.target.value === 2 ? form.getFieldValue('parentId') : 0 });
            }}
          />
        </Form.Item>
        <Form.Item name="name" label={`${TYPE_LABELS[type ?? 1]}名称`} rules={[{ required: true, message: '菜单名称不能为空' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="parentId"
          label="上级菜单"
          rules={[{ required: true, message: '上级菜单不能为空', type: 'number' }]}
        >
          <TreeSelect
            style={{ width: '100%' }}
            treeDefaultExpandAll
            placeholder="点击选择上级菜单"
            fieldNames={{ label: 'name', value: 'menuId', children: 'children' }}
            treeData={parentTree as any}
          />
        </Form.Item>
        {type === 1 && (
          <Form.Item
            name="url"
            label="菜单路由"
            rules={[{ required: true, message: '菜单URL不能为空' }]}
            extra="格式：模块/页面（如 sys/user），或 http(s):// 开头的外链（iframe 打开）"
          >
            <Input />
          </Form.Item>
        )}
        {type !== 0 && (
          <Form.Item name="perms" label="授权标识" extra="多个用逗号分隔，如 sys:user:list,sys:user:save">
            <Input />
          </Form.Item>
        )}
        {type !== 2 && (
          <Form.Item name="orderNum" label="排序号" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        )}
        {type !== 2 && (
          <Form.Item name="icon" label="菜单图标" extra="原 Vue 版为 svg 图标选择器；React 版直接填图标名，侧边栏未做映射时不显示">
            <Input />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

/** 对应 views/modules/sys/menu.vue（树表格，无分页无搜索） */
export default function MenuPage() {
  const isAuth = useAuthStore((s) => s.isAuth);
  const [tree, setTree] = useState<MenuNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; id?: number }>({ open: false });

  const load = async () => {
    setLoading(true);
    try {
      const arr = await apiGetRaw<MenuNode[]>('/sys/menu/list'); // 裸数组（SPEC D3），含 parentName
      setTree(treeDataTranslate(arr ?? [], 'menuId'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const doDelete = (row: MenuNode) => {
    confirm({
      title: '提示',
      content: `确定进行[单条删除]操作? id=${row.menuId}`,
      onOk: async () => {
        const data = await apiPost(`/sys/menu/delete/${row.menuId}`);
        if (assertOk(data)) {
          message.success('操作成功');
          void load();
        }
      }
    });
  };

  const columns: ColumnsType<MenuNode> = [
    { title: '名称', dataIndex: 'name', width: 200 },
    { title: '上级菜单', dataIndex: 'parentName', width: 120 },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 80,
      render: (v?: string) => v || '-'
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (v: number) =>
        v === 0 ? <Tag>目录</Tag> : v === 1 ? <Tag color="success">菜单</Tag> : <Tag color="blue">按钮</Tag>
    },
    { title: '排序号', dataIndex: 'orderNum', width: 80 },
    {
      title: '菜单URL',
      dataIndex: 'url',
      ellipsis: true,
      render: (v?: string) => (v ? <Tooltip title={v}>{v}</Tooltip> : '-')
    },
    {
      title: '授权标识',
      dataIndex: 'perms',
      ellipsis: true,
      render: (v?: string) => (v ? <Tooltip title={v}>{v}</Tooltip> : '-')
    },
    {
      title: '操作',
      width: 150,
      render: (_, row) => (
        <Space>
          {isAuth('sys:menu:update') && (
            <Button size="small" onClick={() => setModal({ open: true, id: row.menuId })}>
              修改
            </Button>
          )}
          {isAuth('sys:menu:delete') && (
            <Button size="small" danger onClick={() => doDelete(row)}>
              删除
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        {isAuth('sys:menu:save') && (
          <Button type="primary" onClick={() => setModal({ open: true })}>
            新增
          </Button>
        )}
      </Space>
      <Card styles={{ body: { padding: 0 } }}>
        <Table
          rowKey="menuId"
          size="middle"
          loading={loading}
          columns={columns}
          dataSource={tree}
          pagination={false}
          childrenColumnName="children"
        />
      </Card>
      <MenuModal
        open={modal.open}
        editId={modal.id}
        onClose={() => setModal({ open: false })}
        onSuccess={load}
      />
    </div>
  );
}
