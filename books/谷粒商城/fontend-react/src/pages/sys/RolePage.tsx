import { useEffect, useState } from 'react';
import { message, confirm } from '@/api/feedback';
import { Button, Card, Col, Form, Input, Modal, Row, Space, Table, Tree } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { assertOk, renrenApi } from '@/api';
import type { MenuNode, SysRole } from '@/types';
import { treeDataTranslate } from '@/utils';
import { useAuthStore } from '@/store/auth';
import { paginationProps, usePageList } from '@/hooks/usePageList';

/** 与 Element UI 版一致的哨兵值：区分 menuIdList 中“全选”与“半选”父节点（SPEC D5） */
const SENTINEL = -666666;

interface TreeCheckInfo {
  checked: number[];
  halfChecked: number[];
}

function RoleModal({
  open, editId, menuTree, onClose, onSuccess
}: {
  open: boolean;
  editId?: number;
  menuTree: MenuNode[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form] = Form.useForm<{ roleName: string; remark?: string }>();
  const [check, setCheck] = useState<TreeCheckInfo>({ checked: [], halfChecked: [] });
  const [saving, setSaving] = useState(false);
  const isEdit = !!editId;

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    setCheck({ checked: [], halfChecked: [] });
    if (editId) {
      void renrenApi.roleInfo(editId).then((data) => {
        if (assertOk(data) && data.role) {
          form.setFieldsValue({ roleName: data.role.roleName, remark: data.role.remark });
          // 编辑回填：以哨兵为界，前半是选中项（Element setCheckedKeys 同款语义，父节点由 Tree 自动半选/全选）
          const list = data.role.menuIdList ?? [];
          const idx = list.indexOf(SENTINEL);
          const checked = (idx >= 0 ? list.slice(0, idx) : list).filter((id) => id !== SENTINEL);
          setCheck({ checked, halfChecked: [] });
        }
      });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const payload = {
        roleId: editId,
        roleName: values.roleName,
        remark: values.remark,
        // 原版编码：[...全选中, 哨兵, ...半选中父节点]，整份写入 sys_role_menu
        menuIdList: [...check.checked, SENTINEL, ...check.halfChecked]
      };
      const data = isEdit ? await renrenApi.roleUpdate(payload) : await renrenApi.roleSave(payload);
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
      title={isEdit ? '修改角色' : '新增角色'}
      open={open}
      onCancel={onClose}
      onOk={submit}
      confirmLoading={saving}
      destroyOnHidden
      width={640}
    >
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
        <Form.Item name="roleName" label="角色名称" rules={[{ required: true, message: '角色名称不能为空' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="菜单权限" extra="说明：取消勾选全部子节点，则父节点也自动取消">
          <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: 8, maxHeight: 320, overflow: 'auto' }}>
            <Tree
              checkable
              selectable={false}
              defaultExpandAll
              treeData={menuTree as any}
              fieldNames={{ title: 'name', key: 'menuId', children: 'children' }}
              checkedKeys={check.checked}
              onCheck={(checkedKeys, info) => {
                const checked = (Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked) as number[];
                setCheck({ checked, halfChecked: (info as any).halfCheckedKeys as number[] });
              }}
            />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

/** 对应 views/modules/sys/role.vue */
export default function RolePage() {
  const isAuth = useAuthStore((s) => s.isAuth);
  const [roleName, setRoleName] = useState('');
  const pl = usePageList<SysRole>(renrenApi.roleList, { roleName: roleName || undefined });
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<{ open: boolean; id?: number }>({ open: false });
  const [menuTree, setMenuTree] = useState<MenuNode[]>([]);

  // /sys/menu/list 返回裸数组（无 code 信封）——SPEC D3
  const openModal = (id?: number) => {
    void renrenApi.menuList().then((arr) => {
      setMenuTree(treeDataTranslate(arr ?? [], 'menuId'));
      setModal({ open: true, id });
    });
  };

  const doDelete = (ids: number[]) => {
    confirm({
      title: '提示',
      content: `确定进行[${ids.length === 1 ? '单条' : '批量'}删除]操作? id=${ids.join(',')}`,
      onOk: async () => {
        const data = await renrenApi.roleDelete(ids);
        if (assertOk(data)) {
          message.success('操作成功');
          setSelected([]);
          pl.refresh();
        }
      }
    });
  };

  const columns: ColumnsType<SysRole> = [
    { title: 'ID', dataIndex: 'roleId', width: 80 },
    { title: '角色名称', dataIndex: 'roleName' },
    { title: '备注', dataIndex: 'remark' },
    { title: '创建时间', dataIndex: 'createTime', width: 180 },
    {
      title: '操作',
      width: 150,
      render: (_, row) => (
        <Space>
          {isAuth('sys:role:update') && (
            <Button size="small" onClick={() => openModal(row.roleId)}>
              修改
            </Button>
          )}
          {isAuth('sys:role:delete') && (
            <Button size="small" danger onClick={() => doDelete([row.roleId])}>
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
            placeholder="角色名称"
            allowClear
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            onPressEnter={() => pl.query({ roleName: roleName || undefined })}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={() => pl.query({ roleName: roleName || undefined })}>
            查询
          </Button>
          {isAuth('sys:role:save') && (
            <Button type="primary" ghost onClick={() => openModal()}>
              新增
            </Button>
          )}
          {isAuth('sys:role:delete') && (
            <Button danger disabled={!selected.length} onClick={() => doDelete(selected)}>
              批量删除
            </Button>
          )}
        </Space>
        <Card styles={{ body: { padding: 0 } }}>
          <Table
            rowKey="roleId"
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
      <RoleModal
        open={modal.open}
        editId={modal.id}
        menuTree={menuTree}
        onClose={() => setModal({ open: false })}
        onSuccess={pl.refresh}
      />
    </Row>
  );
}
