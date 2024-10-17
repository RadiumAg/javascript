import React from 'react';
import { useComponentsStore } from '../../stores/components';
import { Tree } from 'antd';

const Outline: React.FC = () => {
  const { components, setCurComponentId } = useComponentsStore();

  return (
    <Tree
      treeData={components as any}
      showLine
      defaultExpandAll
      fieldNames={{ title: 'desc', key: 'id' }}
      onSelect={([selectedKey]) => {
        setCurComponentId(selectedKey as number);
      }}
    ></Tree>
  );
};

export default Outline;
