import { useRef } from 'react';
import { useToggle } from 'ahooks';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import type { WareSku } from '@/types';

type Operation = 'edit' | 'add';
type FieldType = Omit<WareSku, 'id'>;
type Options = {
  wareOptions: { value: number; label: string }[];
  /** 返回 false 表示保存失败，弹窗保持打开 */
  onOk?: (
    formValue: FieldType,
    ctx: { record?: WareSku; type: Operation },
  ) => Promise<any> | any;
};

const useCreateOrEditWareSkuForm = (options: Options) => {
  const { onOk, wareOptions } = options;
  const [open, toggle] = useToggle();
  const [form] = Form.useForm<FieldType>();
  const operationRef = useRef<Operation>(undefined);
  const recordRef = useRef<WareSku>(undefined);

  const formNode = (
    <Modal
      title={operationRef.current === 'edit' ? '修改库存' : '新增库存'}
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
        initialValues={{ stock: 0, stockLocked: 0 }}
      >
        <Form.Item<FieldType>
          label="skuId"
          name="skuId"
          rules={[{ required: true, message: 'skuId 不能为空' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item<FieldType>
          label="仓库"
          name="wareId"
          rules={[{ required: true, message: '请选择仓库' }]}
        >
          <Select options={wareOptions} placeholder="请选择仓库" showSearch optionFilterProp="label" />
        </Form.Item>
        <Form.Item<FieldType>
          label="库存数"
          name="stock"
          rules={[{ required: true, message: '库存数不能为空' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item<FieldType> label="sku名称" name="skuName" extra="留空则按 skuId 自动取商品名">
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item<FieldType> label="锁定库存" name="stockLocked">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );

  return {
    formNode,
    onOpen: (record?: WareSku, type: Operation = 'add') => {
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

export { useCreateOrEditWareSkuForm };
