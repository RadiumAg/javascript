import { useRef, useState } from 'react';
import { useToggle } from 'ahooks';
import { AutoComplete, Form, Input, InputNumber, Modal } from 'antd';
import { gulimallApi } from '@/api';
import { ImageUpload } from '@/components/ImageUpload';
import type { AttrGroup } from '@/types';
import { CategoryTreeSelect } from './CategoryTreeSelect';

type Operation = 'edit' | 'add';
type Options = {
  /** 新增时默认填左树选中的分类 */
  defaultCatelogId?: number;
  /** 返回 false 表示保存失败，弹窗保持打开 */
  onOk?: (
    formValue: FieldType,
    ctx: { record?: AttrGroup; type: Operation },
  ) => Promise<any> | any;
};

/** 表单只编辑业务字段；attrGroupId 由 ctx.record 提供，不要塞进表单 store */
type FieldType = Omit<AttrGroup, 'attrGroupId'>;

const useCreateOrEditAttrGroupForm = (options: Options) => {
  const { onOk, defaultCatelogId } = options;
  const [open, toggle] = useToggle();
  const [form] = Form.useForm<FieldType>();
  const [nameOptions, setNameOptions] = useState<{ value: string }[]>([]);
  const [nameSearch, setNameSearch] = useState<string | null>(null);
  const operationRef = useRef<Operation>(undefined);
  const recordRef = useRef<AttrGroup>(undefined);

  const shownNameOptions =
    nameSearch === null
      ? nameOptions
      : nameOptions.filter((o) =>
          o.value.toLowerCase().includes(nameSearch.toLowerCase()),
        );

  // 组名候选来自 pms_attr_group 已有记录；新名字仍可手输
  const loadNameOptions = () => {
    gulimallApi
      .attrGroupList({ page: 1, limit: 500 })
      .then((res) => {
        if (res.code !== 0) return;
        const names = [
          ...new Set((res.page?.list ?? []).map((g) => g.attrGroupName)),
        ];
        setNameOptions(names.map((value) => ({ value })));
      })
      .catch(() => setNameOptions([]));
  };

  const formNode = (
    <Modal
      title={operationRef.current === 'edit' ? '修改属性分组' : '新增属性分组'}
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
        initialValues={{ sort: 0 }}
      >
        <Form.Item<FieldType>
          label="组名"
          name="attrGroupName"
          rules={[{ required: true, message: '组名不能为空' }]}
        >
          <AutoComplete
            options={shownNameOptions}
            placeholder="选已有组名或输入新组名"
            onSearch={setNameSearch}
            onOpenChange={(o) => {
              if (o) setNameSearch(null);
            }}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="所属分类"
          name="catelogId"
          rules={[{ required: true, message: '请选择所属分类' }]}
        >
          <CategoryTreeSelect />
        </Form.Item>
        <Form.Item<FieldType> label="排序" name="sort">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item<FieldType> label="描述" name="descript">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item<FieldType> label="组图标" name="icon">
          <ImageUpload />
        </Form.Item>
      </Form>
    </Modal>
  );

  return {
    formNode,
    onOpen: (record?: AttrGroup, type: Operation = 'add') => {
      recordRef.current = record;
      operationRef.current = type;
      form.resetFields();
      loadNameOptions();
      if (type === 'edit' && record) {
        form.setFieldsValue(record);
      } else if (defaultCatelogId !== undefined) {
        form.setFieldsValue({ catelogId: defaultCatelogId });
      }
      toggle.set(true);
    },
    onClose: () => {
      toggle.set(false);
      form.resetFields();
    },
  };
};

export { useCreateOrEditAttrGroupForm };
