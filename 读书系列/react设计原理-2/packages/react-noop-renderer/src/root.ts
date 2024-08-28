import {
  createContainer,
  updateContainer,
} from 'react-reconciler/src/fiberReconciler';
import { ReactElement } from 'shared/ReactTypes';
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
  };
}

function getChildren(parent: Container | Instance) {
  if (parent) {
    return parent.children;
  }

  return null;
}
