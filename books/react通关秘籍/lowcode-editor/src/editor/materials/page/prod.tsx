import React from 'react';
import { CommonComponentProps } from '../../interface';

const Page: React.FC<React.PropsWithChildren<CommonComponentProps>> = (
  props
) => {
  const { styles, children } = props;

  return (
    <div style={{ ...styles }} className="p-[20px] h-[100%] box-border">
      {children}
    </div>
  );
};

export default Page;
