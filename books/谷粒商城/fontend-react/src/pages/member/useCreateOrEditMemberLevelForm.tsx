import { useRef } from 'react';
import { useToggle } from 'ahooks';
import { Form, Input, InputNumber, Modal, Switch } from 'antd';
import type { MemberLevel } from '@/types';

type Operation = 'edit' | 'add';
type Options = {
  /** 返回 false 表示保存失败，弹窗保持打开 */
  onOk?: (
    formValue: FieldType,
    ctx: { record?: MemberLevel; type: Operation },
  ) => Promise<any> | any;
};

type FieldType = Omit<MemberLevel, 'id'>;

/** 0/1 <-> Switch */
const BitSwitch = ({
  value,
  onChange,
}: {
  value?: number;
  onChange?: (v: number) => void;
}) => <Switch checked={value === 1} onChange={(c) => onChange?.(c ? 1 : 0)} />;

const useCreateOrEditMemberLevelForm = (options: Options) => {
  const { onOk } = options;
  const [open, toggle] = useToggle();
  const [form] = Form.useForm<FieldType>();
  const operationRef = useRef<Operation>(undefined);
  const recordRef = useRef<MemberLevel>(undefined);

  const formNode = (
    <Modal
      title={operationRef.current === 'edit' ? '修改会员等级' : '新增会员等级'}
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
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        initialValues={{ growthPoint: 0, commentGrowthPoint: 0, defaultStatus: 0, priviledgeFreeFreight: 0, priviledgeMemberPrice: 0, priviledgeBirthday: 0 }}
      >
        <Form.Item<FieldType>
          label="等级名称"
          name="name"
          rules={[{ required: true, message: '等级名称不能为空' }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item<FieldType> label="成长值" name="growthPoint">
          <InputNumber min={0} precision={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item<FieldType> label="默认等级" name="defaultStatus">
          <BitSwitch />
        </Form.Item>
        <Form.Item<FieldType> label="免运费标准" name="freeFreightPoint">
          <InputNumber min={0} precision={2} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item<FieldType> label="评价成长值" name="commentGrowthPoint">
          <InputNumber min={0} precision={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item<FieldType> label="免邮特权" name="priviledgeFreeFreight">
          <BitSwitch />
        </Form.Item>
        <Form.Item<FieldType> label="会员价特权" name="priviledgeMemberPrice">
          <BitSwitch />
        </Form.Item>
        <Form.Item<FieldType> label="生日特权" name="priviledgeBirthday">
          <BitSwitch />
        </Form.Item>
        <Form.Item<FieldType> label="备注" name="note">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );

  return {
    formNode,
    onOpen: (record?: MemberLevel, type: Operation = 'add') => {
      recordRef.current = record;
      operationRef.current = type;
      form.resetFields();
      if (type === 'edit' && record) form.setFieldsValue(record);
      toggle.set(true);
    },
    onClose: () => {
      toggle.set(false);
      form.resetFields();
    },
  };
};

export { useCreateOrEditMemberLevelForm };
