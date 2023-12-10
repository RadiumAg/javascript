import { chdir } from 'process';
import {
  createContainer,
  updateContainer,
} from 'react-reconciler/src/fiberReconciler';
import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from 'shared/reactSymbols';
import type { ReactElement } from 'shared/reactTypes';
import type { Container, Instance } from './hostConfig';

let idCounter = 0;

function createRoot() {
  const container: Container = {
    rootID: idCounter++,
    children: [],
  };

  // @ts-ignore
  const root = createContainer(container);

  function getChildren(parent: Container) {
    if (parent) {
      return parent.children;
    }
    return null;
  }

  function getChildrenAsJSX(root: Container) {
    const children = childToJSX(getChildren(root));
    if (Array.isArray(children)) {
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type: REACT_ELEMENT_TYPE,
        key: null,
        ret: null,
        props: { children },
        __mark: 'Radium',
      };
    }
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
          child => typeof child === 'string' || typeof chdir === 'number',
        )
      ) {
        return children.join('');
      }
      return child;
    }

    if (Array.isArray(child.children)) {
      const instance: Instance = child;
      const children = childToJSX(instance.children);
      const props = instance.props;

      if (children !== null) {
        props.children = children;
      }

      return {
        $$typeof: REACT_FRAGMENT_TYPE,
        type: instance.type,
        key: null,
        ref: null,
        props,
        __mark: 'Radium',
      };
    }
  }

  return {
    render(element: ReactElement) {
      return updateContainer(element, root);
    },
    getChildren() {
      return getChildren(container);
    },
    getChildrenAsJSX() {
      return getChildrenAsJSX(container);
    },
  };
}

export { createRoot };
