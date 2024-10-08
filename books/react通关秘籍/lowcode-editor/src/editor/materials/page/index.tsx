import React from 'react';
import { CommonComponentProps } from '../../interface';
import useMaterailDrop from '../../hooks/use-materail-drop';

const Page: React.FC<React.PropsWithChildren<CommonComponentProps>> = (
  props
) => {
  const { id, children } = props;
  const { canDrop, drop } = useMaterailDrop(['Button', 'Container'], id);

  return (
    <div
      ref={drop}
      data-component-id={id}
      style={{ border: canDrop ? '2px solid blue' : 'none' }}
      className="p-[20px] h-[100%] box-border"
    >
      {children}
    </div>
  );
};

export default Page;
