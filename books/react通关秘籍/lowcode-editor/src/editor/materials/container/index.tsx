import React from 'react';
import { CommonComponentProps } from '../../interface';
import useMaterailDrop from '../../hooks/use-materail-drop';

const Container: React.FC<React.PropsWithChildren<CommonComponentProps>> = (
  props
) => {
  const { id, children } = props;

  const { canDrop, drop } = useMaterailDrop(['Button', 'Container'], id);

  return (
    <div
      ref={drop}
      data-component-id={id}
      className={`min-h-[100px] p-[20px] ${
        canDrop ? 'border-[1px] border-[#000]' : 'border-[1px] border-[#000]'
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
