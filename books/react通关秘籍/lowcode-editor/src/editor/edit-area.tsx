import React, { MouseEventHandler } from 'react';
import { Component, useComponentsStore } from './stores/components';
import { useComponentConfigStore } from './stores/component-config';
import HoverMask from './components/hover-mask';
import SelectedMask from './components/selecteed-mask';

const EditorArea: React.FC = () => {
  const {
    components,
    curComponentId: currentComponentId,
    setCurComponentId,
  } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [hoverComponentId, setHoverComponentId] = React.useState<number>();

  const handleMouseOver: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const path = e.nativeEvent.composedPath();

    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement;

      const componentId = ele?.dataset?.componentId;
      if (componentId) {
        setHoverComponentId(+componentId);
        return;
      }
    }
  };

  const handleClick: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath();

    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement;

      const componentId = ele?.dataset?.componentId;
      if (componentId) {
        setCurComponentId(+componentId);
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
      onClick={handleClick}
    >
      {/* <pre>{JSON.stringify(components, null, 2)}</pre> */}
      {renderComponent(components)}
      {hoverComponentId && hoverComponentId !== currentComponentId && (
        <HoverMask
          portalWrapperClassName="portal-wrapper"
          containerClassName="edit-area"
          componentId={hoverComponentId}
        />
      )}
      {currentComponentId && (
        <SelectedMask
          portalWrapperClassName="portal-wrapper"
          containerClassName="edit-area"
          componentId={currentComponentId}
        />
      )}
      <div className="portal-wrapper"></div>
    </div>
  );
};

export default EditorArea;
