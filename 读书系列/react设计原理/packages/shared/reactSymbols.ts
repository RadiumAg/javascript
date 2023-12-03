const supportSymbol = typeof Symbol === 'function' && Symbol.for;

// eslint-disable-next-line unicorn/number-literal-case
const REACT_ELEMENT_TYPE = supportSymbol ? Symbol.for('react.element') : 0xeac7;
const REACT_FRAGEMENT_TYPE = supportSymbol
  ? Symbol.for('react.fragement')
  : // eslint-disable-next-line unicorn/number-literal-case
    0xeacb;

export { REACT_ELEMENT_TYPE, REACT_FRAGEMENT_TYPE };
