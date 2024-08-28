/* eslint-disable unicorn/no-lonely-if */
import {
  createContainer,
  updateContainer,
} from 'react-reconciler/src/fiberReconciler';
import { ReactElement } from 'shared/ReactTypes';
import { REACT_ELEMENT_TYPE, REACT_FRAGEMENT_TYPE } from 'shared/ReactSymbols';
import { Container, Instance } from './hostConfig';

let idCounter = 0;

export function createRoot() {
  const container: Container = {
    rootID: idCounter++,
    children: [],
  };

  const root = createContainer(container);

  return {
    render(element: ReactElement) {
      updateContainer(element, root);
    },

    getChildren() {
      return getChildren(container);
    },

    getChildrenAsJSX() {
      return getChildrenAsJSX(container);
    },
  };
}

function getChildrenAsJSX(root: Container) {
  const children = childToJSX(getChildren(root));
  if (Array.isArray(children)) {
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: REACT_FRAGEMENT_TYPE,
      key: null,
      ref: null,
      prop: { children },
      __mark: 'Radium',
    };
  }
  return children;
}

function childToJSX(child: any): any {
  if (typeof child === 'string' || typeof child === 'number') {
    return child;
  }

  if (Array.isArray(child)) {
    if (child.length === 0) {
      return null;
    }
    if (child.length === 1) {
      return childToJSX(child[0]);
    }

    const children = child.map(element => childToJSX(element));

    if (
      children.every(
        child => typeof child === 'string' || typeof child === 'number',
      )
    ) {
      return children.join('');
    }
    return children;
  }

  // Instance
  if (Array.isArray(child.children)) {
    const instance: Instance = child;
    const children = childToJSX(instance.children);
    const props = instance.props;

    if (children !== null) {
      props.children = children;
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: instance.type,
      key: null,
      ref: null,
      props,
      __mark: 'Radium',
    };
  }

  // TextInstance
  return child.text;
}

function getChildren(parent: Container | Instance) {
  if (parent) {
    return parent.children;
  }

  return null;
}
