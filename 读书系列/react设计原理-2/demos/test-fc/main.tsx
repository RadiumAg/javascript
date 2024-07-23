import React from 'react';
import ReactDOM from 'react-dom';

const Children = () => {
  return <div>test-a</div>;
};

const App = () => {
  return <Children />;
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
