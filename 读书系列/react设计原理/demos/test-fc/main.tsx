import React from 'react';
import ReactDOM from 'react-dom';

const Child = () => {
  return <div>11111</div>;
};

const App = () => {
  return <Child />;
};

ReactDOM.createRoot(document.querySelector('#root')).render(<App />);
