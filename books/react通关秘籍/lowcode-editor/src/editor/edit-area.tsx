import React from 'react';
import HoverMask from './materials/hover-mask';
import { Component, useComponentsStore } from './stores/components';
import { useComponentConfigStore } from './stores/component-config';

const EditorArea: React.FC = () => {
  const [hoverComponentId, setHoverComponentId] = React.useState<number>();
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const handleMouseOver: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const path = e.nativeEvent.composedPath();

    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement;

      const componentId = ele.dataset.componentId;
      if (componentId) {
        setHoverComponentId(+componentId);
        return;
      }
    }
  };

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
    <div
      className="h-[100%] edit-area"
      onMouseOver={handleMouseOver}
      onMouseLeave={() => {
        setHoverComponentId(undefined);
      }}
    >
      {/* <pre>{JSON.stringify(components, null, 2)}</pre> */}
      {renderComponent(components)}
      {hoverComponentId && (
        <HoverMask
          containerClassName="edit-area"
          componentId={hoverComponentId}
        />
      )}
    </div>
  );
};

export default EditorArea;
