import React from 'react';
import { useComponentsStore } from '../../stores/components';
import { Segmented } from 'antd';
import ComponentAttr from './component-attr';
import ComponentStyle from './component-style';

const Setting: React.FC = () => {
  const { curComponentId } = useComponentsStore();
  const [key, setKey] = React.useState('属性');

  if (!curComponentId) return null;

  return (
    <div>
      <Segmented
        value={key}
        onChange={setKey}
        block
        options={['属性', '样式', '事件']}
      ></Segmented>

      <div className="pt-[20px]">{key === '属性' && <ComponentAttr />}</div>
      <div className="pt-[20px]">{key === '样式' && <ComponentStyle />}</div>
    </div>
  );
};

export default Setting;
