import { Form, Input, InputNumber, Select } from 'antd';
import React, { CSSProperties, useState } from 'react';
import CssEditor from './css-editor';
import { debounce } from 'lodash-es';
import { useComponentsStore } from '../../stores/components';
import {
  ComponentSetter,
  useComponentConfigStore,
} from '../../stores/component-config';
import styleToObject from 'style-to-object';

const ComponentStyle: React.FC = () => {
  const [form] = Form.useForm();
  const [css, setCss] = useState<string>('.comp{\n\n}');
  const { curComponentId, curComponent, updateComponentStyles } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  React.useEffect(() => {
    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent?.styles });
  }, [curComponent]);

  if (!curComponentId || !curComponent) return null;

  function toCSSStr(css:Record<<string,any>) {
     const str = '.comp {\n';
     for(let key in css){
      let value = css[key];
      if(!value) {
        continue;
      }
      
     }
  }

  function renderFormElememt(setting: ComponentSetter) {
    const { type, options } = setting;

    if (type === 'select') {
      return <Select options={options} />;
    } else if (type === 'input') {
      return <Input />;
    } else if (type === 'inputNumber') {
      return <InputNumber />;
    }
  }

  const handleEditorChange = debounce((value: string | undefined) => {
    const css: Record<string, any> = {};

    if (!value) return;

    try {
      const cssStr = value
        .replace(/\/\*.*\*\//, '') // 去掉注释 /** */
        .replace(/(\.?[^{]+{)/, '') // 去掉 .comp {
        .replace('}', ''); // 去掉 }

      styleToObject(cssStr, (name, value) => {
        css[
          name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))
        ] = value;
      });

      console.log(css);
      updateComponentStyles(curComponentId, css);
    } catch (e) {}
  }, 500);

  const handleValueChange = (changeValues: CSSProperties) => {
    if (curComponentId) {
      updateComponentStyles(curComponentId, changeValues);
    }
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
      onValuesChange={handleValueChange}
    >
      {componentConfig[curComponent.name]?.styleSetter?.map((setter) => (
        <Form.Item key={setter.name} name={setter.name} label={setter.label}>
          {renderFormElememt(setter)}
        </Form.Item>
      ))}

      <div className="h-[200px] border-[1px] border-[#ccc]">
        <CssEditor
          value=".comp{\n\n}"
          onChange={handleEditorChange}
        ></CssEditor>
      </div>
    </Form>
  );
};

export default ComponentStyle;
