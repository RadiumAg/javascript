import ReactDOM from '../../react设计原理/dist/node_modules/react-dom';
import react from '../../react设计原理/dist/node_modules/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  react.createElement('h1', {
    children: react.createElement('span', { children: 3 }),
  })
);
