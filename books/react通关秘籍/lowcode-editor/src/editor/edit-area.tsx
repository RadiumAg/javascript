import React, { Component } from 'react';
import { useComponentsStore } from './stores/components';

const EditorArea: React.FC = () => {
  const { components, addComponent } = useComponentsStore();

  React.useEffect(() => {
    addComponent({
      id: 222,
      name: 'Container',
      props: {},
      children: [],
    });
  }, []);

  return (
    <div>
      <pre>{JSON.stringify(components, null, 2)}</pre>
    </div>
  );
};

function renderComponent(components: Component[]) {}

export default EditorArea;
