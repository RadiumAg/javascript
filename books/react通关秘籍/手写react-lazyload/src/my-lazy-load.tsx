import { CSSProperties, ReactNode, useRef, useState } from 'react';

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  
  const styles = {height, width, ...style};
  
  return <div ref={containerRef} className={className} style={styles}>
    {visible ? children : placeholder}
  </div>
};

export default MyLazyLoad;
