import { ReactElement } from 'shared/reactTypes';
import ReactDOM from 'react-dom';

function renderIntoDocument(element: ReactElement) {
  const div = document.createElement('div');
  ReactDOM.createRoot(div).render(element);
  return element;
}

export { renderIntoDocument };
