import React from 'react';
import { Component, useComponentsStore } from './stores/components';
import { useComponentConfigStore } from './stores/component-config';

const EditorArea: React.FC = () => {
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  function renderComponent(components: Component[]): React.ReactNode[] {
    const componentMap = components.map<React.ReactNode>((component) => {
      const config = componentConfig?.[component.name];

      if (!config?.component) {
        return null;
      }

      return React.createElement(
        config.component,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          ...config.defaultProps,
          ...config.props,
        },
        renderComponent(component.children || [])
      ) as React.ReactNode;
    });

    return componentMap;
  }

  return (
    <div className="h-[100%]">
      {/* <pre>{JSON.stringify(components, null, 2)}</pre> */}
      {renderComponent(components)}
    </div>
  );
};

export default EditorArea;
