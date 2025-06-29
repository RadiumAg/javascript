import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Children = () => {
  const [state, setState] = useState(1);

  return (
    <div
      onClick={() => {
        setState(state + 1);
      }}
    >
      {state}
    </div>
  );
};

const App = () => {
  const [state, setState] = useState(false);

  const children = state
    ? [<div key={1}>1</div>, <div key={2}>2</div>, <div key={3}>3</div>]
    : [<div key={3}>3</div>, <div key={2}>2</div>, <div key={1}>1</div>];

  return (
    <div
      onClick={() => {
        setState(!state);
      }}
    >
      {/* <Children /> */}
      {children}
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
