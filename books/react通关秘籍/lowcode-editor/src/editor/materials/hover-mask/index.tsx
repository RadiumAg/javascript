import React from 'react';
import { createPortal } from 'react-dom';
import { getComponentById, useComponentsStore } from '../../stores/components';

interface HoverMaskProps {
  containerClassName?: string;
  componentId: number;
}

const HoverMask: React.FC<HoverMaskProps> = (props) => {
  const { containerClassName, componentId } = props;
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
    const labelLeft = left - containerLeft + width;
    let labelTop = top - containerTop + container.scrollTop;

    if (labelTop <= 0) {
      labelTop -= -20;
    }

    setPosition({
      left: left - containerLeft + container.scrollLeft,
      top: top - containerTop + container.scrollTop,
      width,
      height,
      labelLeft,
      labelTop,
    });
  }

  React.useEffect(() => {
    updatePosition();
  }, [componentId]);

  const el = React.useMemo(() => {
    const el = document.createElement('div');
    el.className = 'wrapper';

    const container = document.querySelector(`.${containerClassName}`);
    container?.appendChild(el);
    return el;
  }, []);

  const curComponent = React.useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId]);

  return createPortal(
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
    >
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
            whiteSpace: 'nowrap',
            backgroundColor: 'blue',
          }}
        >
          {curComponent?.name}
        </div>
      </div>

      <div className="portal-wrapper"></div>
    </div>,
    el
  );
};

export default HoverMask;
