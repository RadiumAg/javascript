import React from 'react';
import { createPortal } from 'react-dom';
import { getComponentById, useComponentsStore } from '../../stores/components';

interface HoverMaskProps {
  componentId: number;
  containerClassName?: string;
  portalWrapperClassName: string;
}

const HoverMask: React.FC<HoverMaskProps> = (props) => {
  const { containerClassName, portalWrapperClassName, componentId } = props;
  const { components } = useComponentsStore();

  const [position, setPosition] = React.useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });

  function updatePosition() {
    if (!componentId) return;

    const container = document.querySelector(`.${containerClassName}`);

    if (!container) return;

    const node = document.querySelector(`[data-component-id="${componentId}"]`);

    if (!node) return;

    const { left, top, width, height } = node.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect();

    let labelTop = top - containerTop + container.scrollTop;
    const labelLeft = left - containerLeft + width;

    if (labelTop <= 0) {
      labelTop -= -20;
    }

    setPosition({
      width,
      height,
      labelLeft,
      labelTop,
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollLeft,
    });
  }

  React.useEffect(() => {
    updatePosition();
  }, [componentId]);

  const el = React.useMemo(() => {
    return document.querySelector(`.${portalWrapperClassName}`)!;
  }, []);

  const curComponent = React.useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId]);

  return createPortal(
    <>
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          border: '1px dashed blue',
          pointerEvents: 'none',
          left: position.left,
          top: position.top,
          width: position.width,
          height: position.height,
          zIndex: 12,
          borderRadius: 4,
          boxSizing: 'border-box',
        }}
      ></div>
      <div
        style={{
          zIndex: 13,
          fontSize: '14px',
          position: 'absolute',
          top: position.labelTop,
          left: position.labelLeft,
          transform: 'translate(-100%, -100%)',
          display: !position.width || position.width < 10 ? 'none' : 'inline',
        }}
      >
        <div
          style={{
            color: '#fff',
            padding: '0 8px',
            borderRadius: 4,
            cursor: 'pointer',
            width: 'min-content',
            whiteSpace: 'nowrap',
            backgroundColor: 'blue',
          }}
        >
          {curComponent?.name}
        </div>
      </div>
    </>,
    el
  );
};

export default HoverMask;
