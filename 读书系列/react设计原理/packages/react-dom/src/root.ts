import {
  createContainer,
  updateContainer,
} from 'react-reconciler/src/fiberReconciler';
import type { ReactElement } from 'shared/reactTypes';
import type { Container } from './hostConfig';

function createRoot(container: Container) {
  const root = createContainer(container);

  return {
    render(element: ReactElement) {
      updateContainer(element, root);
    },
  };
}

export { createRoot };
