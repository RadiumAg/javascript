import React from 'react';
import { Button as AntButton } from 'antd';
import { ButtonType } from 'antd/es/button';

export interface ButtonProps {
  text: string;
  type: ButtonType;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { type, text } = props;

  return <AntButton type={type}>{text}</AntButton>;
};

export default Button;
