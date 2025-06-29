const supportSymbol = typeof Symbol === 'function';

export const REACT_ELEMENT_TYPE = supportSymbol
  ? Symbol.for('react.element')
  : 0xeac7;

export const REACT_FRAGMENT_TYPE = supportSymbol
  ? Symbol.for('react.fragment')
  : 0x3acb;
