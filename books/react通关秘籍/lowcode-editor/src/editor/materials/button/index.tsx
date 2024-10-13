import React from 'react';
import { Button as AntButton } from 'antd';
import { ButtonType } from 'antd/es/button';
import { CommonComponentProps } from '../../interface';

export interface ButtonProps {
  text: string;
  type: ButtonType;
}

const Button: React.FC<CommonComponentProps> = (props) => {
  const { id, type, text, styles } = props;

  return (
    <AntButton data-component-id={id} type={type} style={styles}>
      {text}
    </AntButton>
  );
};

export default Button;
