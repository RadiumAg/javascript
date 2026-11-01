import { useToggle } from 'ahooks';
import { Form, Input, InputNumber, Modal, Radio } from 'antd';
import { useRef } from 'react';
import type { Brand } from '@/types';

type Operation = 'edit' | 'add';
type Options = {
  /** 返回 false 表示保存失败，弹窗保持打开 */
  onOk?: (
    formValue: FieldType,
    ctx: { record?: Brand; type: Operation },
  ) => Promise<any> | any;
};

/** 表单只编辑业务字段；brandId 由 ctx.record 提供，不要塞进表单 store */
type FieldType = Omit<Brand, 'brandId'>;

const useCreateOrEditBrandForm = (options: Options) => {
  const { onOk } = options;
  const [open, toggle] = useToggle();
  const [form] = Form.useForm<FieldType>();
  const operationRef = useRef<Operation>(undefined);
  const recordRef = useRef<Brand>(undefined);

  const formNode = (
    <Modal
      title={operationRef.current === 'edit' ? '修改品牌' : '新增品牌'}
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
        initialValues={{ showStatus: 1, sort: 0 }}
      >
        <Form.Item<FieldType>
          label="品牌名"
          name="name"
          rules={[{ required: true, message: '品牌名不能为空' }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item<FieldType> label="Logo" name="logo">
          <Input autoComplete="off" placeholder="图片 URL" />
        </Form.Item>
        <Form.Item<FieldType> label="描述" name="descript">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item<FieldType> label="显示状态" name="showStatus">
          <Radio.Group
            options={[
              { label: '显示', value: 1 },
              { label: '隐藏', value: 0 },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="首字母"
          name="firstLetter"
          rules={[{ pattern: /^[A-Za-z]$/, message: '单个大小写字母' }]}
        >
          <Input autoComplete="off" maxLength={1} />
        </Form.Item>
        <Form.Item<FieldType> label="排序" name="sort">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );

  return {
    formNode,
    onOpen: (record?: Brand, type: Operation = 'add') => {
      recordRef.current = record;
      operationRef.current = type;
      form.resetFields();
      if (type === 'edit' && record) {
        form.setFieldsValue(record);
      }
      toggle.set(true);
    },
    onClose: () => {
      toggle.set(false);
      form.resetFields();
    },
  };
};

export { useCreateOrEditBrandForm };
