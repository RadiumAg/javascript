import React from 'react';
import { Button as AntButton } from 'antd';
import { ButtonType } from 'antd/es/button';
import { CommonComponentProps } from '../../interface';

export interface ButtonProps {
  text: string;
  type: ButtonType;
}

const Button: React.FC<CommonComponentProps> = (props) => {
  const { id, type, text, styles, ...otherProps } = props;

  return (
    <AntButton
      data-component-id={id}
      type={type}
      style={styles}
      {...otherProps}
    >
      {text}
    </AntButton>
  );
};

export default Button;
