import React from 'react';

const Container: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <div className="border-[1px] border-[#000] min-h-[100px] p-[20px]">
      {children}
    </div>
  );
};

export default Container;
