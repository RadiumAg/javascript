import { CSSProperties, FC, ReactNode } from 'react';

interface MyLazyLoadProps {
  className?: string;
  style?: CSSProperties;
  placeholder?: ReactNode;
  offset?: string | number;
  width?: number | string;
}

const MyLazyLoad: FC = () => {};
