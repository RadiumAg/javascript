import React from 'react';
import './index.scss';

interface MaskProps {
  element?: HTMLElement;
  container?: HTMLElement;
  renderMaskContent?: (element: React.ReactNode) => React.ReactNode;
}

const Mask: React.FC<MaskProps> = (props) => {
  const { element, renderMaskContent, container } = props;

  const [style, setStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    if (!element) {
      return;
    }

    element.scrollIntoView({
      block: 'center',
      inline: 'center',
    });

    const style = getMaskStyle(
      element,
      container! || document.documentElement!
    );

    setStyle(style);
  }, [element, container]);

  const getContent = () => {
    if (!renderMaskContent) {
      return null;
    }

    return renderMaskContent(
      <div
        className="mask-content"
        style={{ width: '100%', height: '100%' }}
      ></div>
    );
  };

  return (
    <div style={style} className="mask">
      {getContent()}
    </div>
  );
};

/**
 * 获取container的信息
 *
 * @param {HTMLElement} element target element
 * @param {HTMLElement} container
 * @return {*}
 */
function getMaskStyle(element: HTMLElement, container: HTMLElement) {
  if (!element) {
    return {};
  }

  const { height, width, left, top } = element.getBoundingClientRect();

  const elementTopWithScroll = container.scrollTop + top;
  const elementLeftWithScroll = container.scrollLeft + left;

  console.log(height, top);

  return {
    width: container.scrollWidth,
    height: container.scrollHeight,
    borderTopWidth: Math.max(elementTopWithScroll, 0),
    borderLeftWidth: Math.max(elementLeftWithScroll, 0),
    borderBottomWidth: Math.max(
      container.scrollHeight - height - elementTopWithScroll,
      0
    ),
    borderRightWidth: Math.max(
      container.scrollWidth - width - elementLeftWithScroll,
      0
    ),
  };
}

export default Mask;
