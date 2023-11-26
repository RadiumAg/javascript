import { ReactElement } from 'shared/reactTypes';
import ReactDOM from 'react-dom/index';

function renderIntoContainer(element: ReactElement) {
  const div = document.createElement('div');
  ReactDOM.createRoot(div).render(element);
}

export { renderIntoContainer };
