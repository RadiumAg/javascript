import { Form, Input, InputNumber, Select } from 'antd';
import React from 'react';
import { useComponentsStore } from '../../stores/components';
import {
  useComponentConfigStore,
  ComponentSetter,
  ComponentConfig,
} from '../../stores/component-config';

const ComponentAttr: React.FC = () => {
  const [form] = Form.useForm();

  const { curComponentId, curComponent, updateComponentProps } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  React.useEffect(() => {
    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent?.props });
  }, [curComponent]);

  if (!curComponentId || !curComponent) return null;

  function renderFormElement(setting: ComponentSetter) {
    const { type, options } = setting;

    if (type === 'select') {
      return <Select options={options} />;
    } else if (type === 'input') {
      return <Input />;
    } else if (type === 'inputNumber') {
      return <InputNumber />;
    }
  }

  function valueChange(changeValues: ComponentConfig) {
    if (curComponentId) {
      updateComponentProps(curComponentId, changeValues);
    }
  }

  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label="组件id">
        <Input value={curComponent.id} disabled />
      </Form.Item>

      <Form.Item label="组件名称">
        <Input value={curComponent.name} disabled />
      </Form.Item>

      <Form.Item label="组件描述">
        <Input value={curComponent.desc} disabled />
      </Form.Item>
      {componentConfig[curComponent.name].setter?.map((setter) => (
        <Form.Item key={setter.name} name={setter.name} label={setter.label}>
          {renderFormElement(setter)}
        </Form.Item>
      ))}
    </Form>
  );
};

export default ComponentAttr;
