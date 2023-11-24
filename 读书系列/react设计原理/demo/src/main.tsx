import ReactDOM from 'react';
import react from 'react/client';

ReactDOM.createRoot(document.getElementById('root')).render(
  react.createElement('h1', {
    children: react.createElement('span', { children: 3 }),
  })
);
