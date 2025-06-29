// ReactElement

import {
  REACT_ELEMENT_TYPE,
  REACT_FRAGMENT_TYPE,
} from '../../shared/ReactSymbols';
import { ElementType, Key, Props, Ref, Type } from '../../shared/ReactTypes';

const ReactElement = function (type: Type, key: Key, ref: Ref, props: Props) {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mrak: 'Radium',
  };

  return element;
};

export const Fragment = REACT_FRAGMENT_TYPE;

export const jsx = function (
  type: ElementType,
  config: Record<string, any>,
  key: string | number | null = null
  // ...maybechildren: any[]
) {
  const props: Props = {};
  let ref: Ref = null;

  // eslint-disable-next-line no-restricted-syntax
  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key' && val !== undefined) {
      key = `${val}`;
      continue;
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }

  // const maybechildrenLength = maybechildren.length;

  // if (maybechildrenLength && props.children === 0) {
  //   if (maybechildrenLength === 1) {
  //     props.children = maybechildren[0];
  //   } else {
  //     props.children = maybechildren;
  //   }
  // }

  return ReactElement(type, key, ref, props);
};

export const jsxDEV = jsx;
