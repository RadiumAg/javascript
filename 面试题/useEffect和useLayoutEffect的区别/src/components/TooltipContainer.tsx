import type { FC } from 'react';
import './TooltipContainer.css';

interface TooltipContainerProps {
  x: number;
  y: number;
  contentRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

const TooltipContainer: FC<TooltipContainerProps> = ({
  x,
  y,
  contentRef,
  children,
}) => {
  return (
    <div
      className="tooltip-container"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }}
      ref={contentRef}
    >
      {children}
    </div>
  );
};

export default TooltipContainer;
