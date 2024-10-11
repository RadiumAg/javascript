import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Space, Popconfirm, Dropdown } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { getComponentById, useComponentsStore } from '../../stores/components';

interface SelectedMaskProps {
  componentId: number;
  containerClassName: string;
  portalWrapperClassName: string;
}

const SelectedMask: React.FC<SelectedMaskProps> = (props) => {
  const { containerClassName, portalWrapperClassName, componentId } = props;
  const { components, curComponentId, deleteComponent, setCurComponentId } =
    useComponentsStore();
  const [position, setPosition] = React.useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });
  const curComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId]);

  const parentComponents = React.useMemo(() => {
    const parentComponents = [];
    let component = curComponent;

    while (component?.parentId) {
      component = getComponentById(component.parentId, components);
      parentComponents.push(component!);
    }

    return parentComponents;
  }, [curComponent]);

  React.useEffect(() => {
    updatePosition();
  }, [curComponent, components]);

  function updatePosition() {
    if (!componentId) return;

    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    const node = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    const { top, left, width, height } = node.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect();

    let labelTop = top - containerTop + container.scrollTop;
    const labelLeft = left - containerLeft + width;

    if (labelTop <= 0) {
      labelTop -= 20;
    }

    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollLeft,
      width,
      height,
      labelTop,
      labelLeft,
    });
  }

  const el = useMemo(() => {
    return document.querySelector(`.${portalWrapperClassName}`)!;
  }, []);

  const handleDelete = () => {
    deleteComponent(curComponentId!);
    setCurComponentId(null);
  };

  return createPortal(
    <>
      <div
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          border: '1px dashed blue',
          pointerEvents: 'none',
          width: position.width,
          height: position.height,
          zIndex: 12,
          borderRadius: 4,
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: '14px',
          zIndex: 13,
          display: !position.width || position.width < 10 ? 'none' : 'inline',
          transform: 'translate(-100%, -100%)',
        }}
      >
        <Space>
          <Dropdown
            menu={{
              items: parentComponents.map((item) => ({
                key: item.id,
                label: item.name,
              })),
              onClick: (event) => {
                const { key } = event;
                console.log(key);
                setCurComponentId(+key);
              },
            }}
          >
            <div
              style={{
                padding: '0 8px',
                backgroundColor: 'blue',
                borderRadius: 4,
                color: '#fff',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {curComponent?.name}
            </div>
          </Dropdown>
          {curComponentId !== 1 && (
            <div style={{ padding: '0 8px', backgroundColor: 'blue' }}>
              <Popconfirm
                disabled={parentComponents.length === 0}
                title="确认删除？"
                okText={'确认'}
                cancelText={'取消'}
                onConfirm={handleDelete}
              >
                <DeleteOutlined style={{ color: '#fff' }} />
              </Popconfirm>
            </div>
          )}
        </Space>
      </div>
    </>,
    el
  );
};

export default SelectedMask;
