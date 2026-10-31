import { useToggle } from 'ahooks';
import { Form, Input, Modal } from 'antd';
import { useRef } from 'react';
import type { CategoryNode } from '@/types';

type Operation = 'edit' | 'add';
type Options = {
  /** 返回 false 表示保存失败，弹窗保持打开 */
  onOk?: (
    formValue: FieldType,
    ctx: { record: CategoryNode; type: Operation },
  ) => Promise<any> | any;
};

// 表单只编辑 name；catId/catLevel 等由 ctx.record 提供，不要塞进表单 store
type FieldType = Pick<CategoryNode, 'name'>;

const useCreateOrEditCategoryForm = (options: Options) => {
  const { onOk } = options;
  const [open, toggle] = useToggle();
  const [form] = Form.useForm<FieldType>();
  const operationRef = useRef<Operation>(undefined);
  const recordRef = useRef<CategoryNode>(undefined);

  const formNode = (
    <Modal
      title={operationRef.current === 'edit' ? '修改分类' : '添加分类'}
      onOk={async () => {
        const result = await onOk?.(form.getFieldsValue(), {
          record: recordRef.current!,
          type: operationRef.current!,
        });
        if (result !== false) {
          toggle.set(false);
          form.resetFields();
        }
      }}
      onCancel={() => {
        toggle.set(false);
      }}
      open={open}
    >
      <Form form={form}>
        <Form.Item<FieldType> label="分类名称" name="name">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );

  return {
    formNode,
    onOpen: (record: CategoryNode, type: Operation = 'add') => {
      recordRef.current = record;
      operationRef.current = type;
      form.resetFields();
      if (type === 'edit') {
        form.setFieldsValue({ name: record.name });
      }
      toggle.set(true);
    },
    onClose: () => {
      toggle.set(false);
    },
  };
};

export { useCreateOrEditCategoryForm as useCreateCategory };
