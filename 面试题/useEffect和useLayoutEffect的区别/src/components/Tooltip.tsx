import { useRef, useLayoutEffect, useState, type FC, useEffect } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer';

interface TooltipProps {
  children: React.ReactNode;
  targetRect: DOMRect | null;
}

const Tooltip: FC<TooltipProps> = ({ children, targetRect }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // useLayoutEffect(() => {
  //   if (ref.current) {
  //     const start = Date.now();
  //     while (Date.now() - start < 10000) {}
  //     const { height } = ref.current.getBoundingClientRect();
  //     setTooltipHeight(height);
  //     console.log('Measured tooltip height: ' + height);
  //   }
  // }, []);

  useEffect(() => {
    if (ref.current) {
      const start = Date.now();
      while (Date.now() - start < 10000) {}
      const { height } = ref.current.getBoundingClientRect();
      setTooltipHeight(height);
      console.log('Measured tooltip height: ' + height);
    }
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;

  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
};

export default Tooltip;
