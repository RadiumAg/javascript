import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

interface MyLazyLoadProps {
  className?: string;
  style?: CSSProperties;
  placeholder?: ReactNode;
  offset: number | string;
  width?: number | string;
  height?: number | string;
  onContentVisible?: () => void;
  children: ReactNode;
}

const MyLazyLoad: React.FC<MyLazyLoadProps> = (props) => {
  const {
    className = '',
    style,
    offset = 0,
    width,
    height,
    onContentVisible,
    placeholder,
    children,
  } = props;

  const elementObserver = useRef<IntersectionObserver>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const styles = { height, width, ...style };

  function lazyLoadHandler(entries: IntersectionObserverEntry[]) {
    const [entry] = entries;
    const { isIntersecting } = entry;
    if (isIntersecting) {
      setVisible(true);
      onContentVisible?.();

      const node = containerRef.current;
      if (node && node instanceof HTMLElement) {
        elementObserver.current?.unobserve(node);
      }
    }
  }

  useEffect(() => {
    const options = {
      rootMargin: typeof offset === 'number' ? `${offset}px` : offset || '0px',
      threshold: 0,
    };

    elementObserver.current = new IntersectionObserver(
      lazyLoadHandler,
      options
    );

    const node = containerRef.current;
    if (node instanceof HTMLElement) {
      elementObserver.current.observe(node);
    }

    return () => {
      if (node && node instanceof HTMLHRElement) {
        elementObserver.current?.unobserve(node);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={className} style={styles}>
      {visible ? children : placeholder}
    </div>
  );
};

export default MyLazyLoad;
