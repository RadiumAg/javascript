import { useState, useRef, type FC } from 'react';
import Tooltip from './Tooltip';

interface ButtonWithTooltipProps {
  tooltipContent: string;
  children: React.ReactNode;
}

const ButtonWithTooltip: FC<ButtonWithTooltipProps> = ({
  tooltipContent,
  children,
}) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const showTooltip = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTargetRect(rect);
    }
  };

  const hideTooltip = () => {
    setTargetRect(null);
  };

  return (
    <div className="button-with-tooltip">
      <button
        ref={buttonRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </button>
      {targetRect && (
        <Tooltip targetRect={targetRect}>{tooltipContent}</Tooltip>
      )}
    </div>
  );
};

export default ButtonWithTooltip;
