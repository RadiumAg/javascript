import { useToggle } from 'ahooks';
import { Form, Input, Modal } from 'antd';
import { useRef } from 'react';
import type { CategoryNode } from '@/types';

type Options = {
  /** 返回 false 表示保存失败，弹窗保持打开 */
  onOk?: (
    formValue: FieldType,
    parent: CategoryNode | undefined,
  ) => Promise<any> | any;
};

type FieldType = {
  category?: string;
};

const useCreateCategoryForm = (options: Options) => {
  const { onOk } = options;
  const parentRef = useRef<CategoryNode | undefined>(undefined);
  const [open, toggle] = useToggle();
  const [form] = Form.useForm();

  const formNode = (
    <Modal
      title="添加类型"
      onOk={async () => {
        const result = await onOk?.(form.getFieldsValue() as FieldType, parentRef.current);
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
        <Form.Item<FieldType> label="分类名称" name="category">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );

  return {
    formNode,
    onOpen: (parent: CategoryNode) => {
      toggle.set(true);
      parentRef.current = parent;
    },
    onClose: () => {
      toggle.set(false);
    },
  };
};

export { useCreateCategoryForm as useCreateCategory };
