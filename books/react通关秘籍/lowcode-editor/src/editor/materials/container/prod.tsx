import React from 'react';
import { CommonComponentProps } from '../../interface';
const Container: React.FC<React.PropsWithChildren<CommonComponentProps>> = (
  props
) => {
  const { id, styles, children } = props;

  return (
    <div style={styles} className={`min-h-[100px] p-[20px]`}>
      {children}
    </div>
  );
};

export default Container;
