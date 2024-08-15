import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Children = () => {
  const [state, setState] = useState(false);

  const liArray = state
    ? [<li key="1">1</li>, <li key="2">2</li>, <li key="3">3</li>]
    : [<li key="3">3</li>, <li key="2">2</li>, <li key="1">1</li>];

  return (
    <div
      onClick={() => {
        setState(!state);
      }}
    >
      {liArray}
    </div>
  );
};

const App = () => {
  return <Children />;
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
