const supportSymbol = typeof Symbol === 'function' && Symbol.for;

// eslint-disable-next-line unicorn/number-literal-case
const REACT_ELEMENT_TYPE = supportSymbol ? Symbol.for('react-element') : 0xeac7;

export { REACT_ELEMENT_TYPE };
