// ReactDom.createRoot(root).render(<App/>)
import {
  createContainer,
  updateContainer,
} from 'react-reconciler/src/fiberReconciler';
import { ReactElement } from 'shared/ReactTypes';
import { Container } from './hostConfig';

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
  };
}
