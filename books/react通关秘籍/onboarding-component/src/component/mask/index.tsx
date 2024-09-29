import React from 'react';

interface MaskProps {
  element: HTMLElement;
  container?: HTMLElement;
  renderMaskContent?: (element: HTMLElement) => React.ReactNode;
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

    const style = getMaskStyle(element, container);

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

function getMaskStyle(element: HTMLElement, container: HTMLElement) {
  if (!element) {
    return {};
  }

  const { height, width, left, top } = element.getBoundingClientRect();

  const elementTopWithScroll = container.scrollTop + top;
  const elementLeftWithScroll = container.scrollLeft + left;
}

export default Mask;
