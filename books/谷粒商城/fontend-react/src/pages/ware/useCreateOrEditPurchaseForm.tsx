import { useRef } from 'react';
import { useToggle } from 'ahooks';
import { Form, InputNumber, Modal, Select } from 'antd';
import type { Purchase } from '@/types';

type Operation = 'edit' | 'add';
type FieldType = Pick<Purchase, 'priority' | 'wareId'>;
type Options = {
  wareOptions: { value: number; label: string }[];
  /** 返回 false 表示保存失败，弹窗保持打开 */
  onOk?: (
    formValue: FieldType,
    ctx: { record?: Purchase; type: Operation },
  ) => Promise<any> | any;
};

/** 采购人由「分配」写入，状态由流程推进，表单只管优先级和仓库 */
const useCreateOrEditPurchaseForm = (options: Options) => {
  const { onOk, wareOptions } = options;
  const [open, toggle] = useToggle();
  const [form] = Form.useForm<FieldType>();
  const operationRef = useRef<Operation>(undefined);
  const recordRef = useRef<Purchase>(undefined);

  const formNode = (
    <Modal
      title={operationRef.current === 'edit' ? '修改采购单' : '新增采购单'}
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
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ priority: 1 }}
      >
        <Form.Item<FieldType>
          label="优先级"
          name="priority"
          rules={[{ required: true, message: '优先级不能为空' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item<FieldType> label="仓库" name="wareId">
          <Select
            options={wareOptions}
            placeholder="请选择仓库"
            allowClear
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  return {
    formNode,
    onOpen: (record?: Purchase, type: Operation = 'add') => {
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

export { useCreateOrEditPurchaseForm };
