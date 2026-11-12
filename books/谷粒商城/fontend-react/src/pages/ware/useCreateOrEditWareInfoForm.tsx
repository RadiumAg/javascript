import { useRef } from 'react';
import { useToggle } from 'ahooks';
import { Form, Input, Modal } from 'antd';
import type { WareInfo } from '@/types';

type Operation = 'edit' | 'add';
type FieldType = Omit<WareInfo, 'id'>;
type Options = {
  /** 返回 false 表示保存失败，弹窗保持打开 */
  onOk?: (
    formValue: FieldType,
    ctx: { record?: WareInfo; type: Operation },
  ) => Promise<any> | any;
};

const useCreateOrEditWareInfoForm = (options: Options) => {
  const { onOk } = options;
  const [open, toggle] = useToggle();
  const [form] = Form.useForm<FieldType>();
  const operationRef = useRef<Operation>(undefined);
  const recordRef = useRef<WareInfo>(undefined);

  const formNode = (
    <Modal
      title={operationRef.current === 'edit' ? '修改仓库' : '新增仓库'}
      onOk={async () => {
        const values = await form.validateFields();
        const result = await onOk?.(values, {
          record: recordRef.current,
          type: operationRef.current!,
        });
        if (result !== false) {
          toggle.set(false);
          form.resetFields();
        }
      }}
      onCancel={() => {
        toggle.set(false);
        form.resetFields();
      }}
      open={open}
      destroyOnHidden
    >
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        <Form.Item<FieldType>
          label="仓库名"
          name="name"
          rules={[{ required: true, message: '仓库名不能为空' }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item<FieldType>
          label="仓库地址"
          name="address"
          rules={[{ required: true, message: '仓库地址不能为空' }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item<FieldType> label="区域编码" name="areacode">
          <Input autoComplete="off" maxLength={6} />
        </Form.Item>
      </Form>
    </Modal>
  );

  return {
    formNode,
    onOpen: (record?: WareInfo, type: Operation = 'add') => {
      recordRef.current = record;
      operationRef.current = type;
      form.resetFields();
      if (type === 'edit' && record) {
        form.setFieldsValue(record);
      }
      toggle.set(true);
    },
  };
};

export { useCreateOrEditWareInfoForm };
