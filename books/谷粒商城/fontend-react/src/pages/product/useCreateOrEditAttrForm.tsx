import { useRef } from 'react';
import { useToggle } from 'ahooks';
import { Form, Input, Modal, Select, Space, Switch } from 'antd';
import { ImageUpload } from '@/components/ImageUpload';
import type { Attr } from '@/types';
import { CategoryTreeSelect } from './CategoryTreeSelect';

type Operation = 'edit' | 'add';
type Options = {
  /** 新增时默认填左树选中的分类 */
  defaultCatelogId?: number;
  /** 1=基本属性（规格参数） 0=销售属性 */
  attrType: number;
  /** 返回 false 表示保存失败，弹窗保持打开 */
  onOk?: (
    formValue: FieldType,
    ctx: { record?: Attr; type: Operation },
  ) => Promise<any> | any;
};

/** 表单只编辑业务字段；attrId 由 ctx.record 提供 */
type FieldType = Omit<Attr, 'attrId'>;

/** 0/1 <-> Switch */
const BitSwitch = ({
  value,
  onChange,
}: {
  value?: number;
  onChange?: (v: number) => void;
}) => <Switch checked={value === 1} onChange={(c) => onChange?.(c ? 1 : 0)} />;

/** 值类型：只能单个值 / 允许多个值 */
const ValueTypeSwitch = ({
  value,
  onChange,
}: {
  value?: number;
  onChange?: (v: number) => void;
}) => (
  <Space>
    <span style={{ color: value === 1 ? undefined : '#1677ff' }}>只能单个值</span>
    <Switch checked={value === 1} onChange={(c) => onChange?.(c ? 1 : 0)} />
    <span style={{ color: value === 1 ? '#1677ff' : undefined }}>允许多个值</span>
  </Space>
);

/** 可选值：库里是分号串，编辑时拆成 tags */
const ValueSelectTags = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (v: string) => void;
}) => (
  <Select
    mode="tags"
    style={{ width: '100%' }}
    placeholder="输入后回车添加可选值"
    tokenSeparators={[',', ';', '，', '；']}
    value={value ? value.split(/[;,，；]/).filter(Boolean) : []}
    onChange={(arr: string[]) => onChange?.(arr.join(';'))}
  />
);

const useCreateOrEditAttrForm = (options: Options) => {
  const { onOk, defaultCatelogId, attrType } = options;
  const [open, toggle] = useToggle();
  const [form] = Form.useForm<FieldType>();
  const operationRef = useRef<Operation>(undefined);
  const recordRef = useRef<Attr>(undefined);

  const formNode = (
    <Modal
      title={operationRef.current === 'edit' ? '修改属性' : '新增属性'}
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
        initialValues={{ searchType: 0, valueType: 0, enable: 1, showDesc: 0 }}
      >
        <Form.Item<FieldType>
          label="属性名"
          name="attrName"
          rules={[{ required: true, message: '属性名不能为空' }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item<FieldType>
          label="所属分类"
          name="catelogId"
          rules={[{ required: true, message: '请选择所属分类' }]}
        >
          <CategoryTreeSelect />
        </Form.Item>
        <Form.Item<FieldType> label="可检索" name="searchType">
          <BitSwitch />
        </Form.Item>
        <Form.Item<FieldType> label="值类型" name="valueType">
          <ValueTypeSwitch />
        </Form.Item>
        <Form.Item<FieldType> label="可选值" name="valueSelect">
          <ValueSelectTags />
        </Form.Item>
        <Form.Item<FieldType> label="图标" name="icon">
          <ImageUpload />
        </Form.Item>
        <Form.Item<FieldType> label="启用" name="enable">
          <BitSwitch />
        </Form.Item>
        <Form.Item<FieldType> label="快速展示" name="showDesc">
          <BitSwitch />
        </Form.Item>
      </Form>
    </Modal>
  );

  return {
    formNode,
    onOpen: (record?: Attr, type: Operation = 'add') => {
      recordRef.current = record;
      operationRef.current = type;
      form.resetFields();
      if (type === 'edit' && record) {
        form.setFieldsValue(record);
      } else {
        form.setFieldsValue({
          attrType,
          ...(defaultCatelogId !== undefined ? { catelogId: defaultCatelogId } : {}),
        });
      }
      toggle.set(true);
    },
    onClose: () => {
      toggle.set(false);
      form.resetFields();
    },
  };
};

export { useCreateOrEditAttrForm };
