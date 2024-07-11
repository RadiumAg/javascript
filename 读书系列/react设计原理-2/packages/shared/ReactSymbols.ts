const supportSymbol = typeof Symbol === 'function';

export const REACT_ELEMENT_TYPE = supportSymbol
  ? Symbol.for('react.element')
  : 0xeac7;
