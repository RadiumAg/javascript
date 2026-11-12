import { useRef } from 'react';
import { useToggle } from 'ahooks';
import { Form, InputNumber, Modal, Select } from 'antd';
import type { PurchaseDetail } from '@/types';

type Operation = 'edit' | 'add';
type FieldType = Pick<PurchaseDetail, 'skuId' | 'skuNum' | 'wareId'>;
type Options = {
  wareOptions: { value: number; label: string }[];
  /** 返回 false 表示保存失败，弹窗保持打开 */
  onOk?: (
    formValue: FieldType,
    ctx: { record?: PurchaseDetail; type: Operation },
  ) => Promise<any> | any;
};

/** 采购金额由后端按 数量×商品单价 算，状态由流程推进，都不放进表单 */
const useCreateOrEditPurchaseDetailForm = (options: Options) => {
  const { onOk, wareOptions } = options;
  const [open, toggle] = useToggle();
  const [form] = Form.useForm<FieldType>();
  const operationRef = useRef<Operation>(undefined);
  const recordRef = useRef<PurchaseDetail>(undefined);

  const formNode = (
    <Modal
      title={operationRef.current === 'edit' ? '修改采购需求' : '新增采购需求'}
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
        initialValues={{ skuNum: 1 }}
      >
        <Form.Item<FieldType>
          label="采购商品id"
          name="skuId"
          rules={[{ required: true, message: 'skuId 不能为空' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item<FieldType>
          label="采购数量"
          name="skuNum"
          rules={[{ required: true, message: '采购数量不能为空' }]}
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
      </Form>
    </Modal>
  );

  return {
    formNode,
    onOpen: (record?: PurchaseDetail, type: Operation = 'add') => {
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

export { useCreateOrEditPurchaseDetailForm };
