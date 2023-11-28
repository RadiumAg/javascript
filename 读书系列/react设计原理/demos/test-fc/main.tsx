import * as React from 'react';
import ReactDOM from 'react-dom';

const Child = () => {
  const [state, setState] = React.useState(1);
  window.setState = setState
  return <div>{state}</div>;
};

const App = () => {
  return <Child />;
};

ReactDOM.createRoot(document.querySelector('#root')).render(<App />);
