import { REACT_ELEMENT_TYPE } from 'shared/reactSymbols';
import type { ElementType, Key, Props, Ref, Type } from 'shared/reactTypes';

const ReactElement = (type: Type, key: Key, ref: Ref, props: Props) => {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    key,
    ref,
    props,
    __mark: '',
  };

  return element;
};

const jsx = (
  type: ElementType,
  config: Record<string, any>,
  ...maybeChildren: any[]
) => {
  let key: Key = null;
  let ref: Ref = null;
  const props: Props = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const prop in config) {
    const val = config[prop];

    if (prop === 'key') {
      if (key !== undefined) {
        key = ` ${val}`;
      }
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

  const maybeChildrenLength = maybeChildren.length;
  if (maybeChildren) {
    if (maybeChildrenLength === 1) {
      props.children = maybeChildren[0];
    } else {
      props.children = maybeChildren;
    }
  }

  return ReactElement(type, key, ref, props);
};

const jsxDev = jsx;
export { ReactElement, jsx, jsxDev };
