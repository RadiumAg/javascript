import {
  createContainer,
  updateContainer,
} from 'react-reconciler/src/fiberReconciler';
import { initEvent } from './systemEvent';
import type { ReactElement } from 'shared/reactTypes';
import type { Container } from './hostConfig';

function createRoot(container: Container) {
  const root = createContainer(container);

  return {
    render(element: ReactElement) {
      initEvent(container, 'click');
      updateContainer(element, root);
    },
  };
}

export { createRoot };
