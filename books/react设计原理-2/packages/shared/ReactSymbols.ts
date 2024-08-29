const supportSymbol = typeof Symbol === 'function';

export const REACT_ELEMENT_TYPE = supportSymbol
  ? Symbol.for('react.element')
  : 0xeac7;

export const REACT_FRAGEMENT_TYPE = supportSymbol
  ? Symbol.for('react.fragement')
  : 0x3acb;
