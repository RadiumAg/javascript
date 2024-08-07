import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Children = () => {
  const [state, setState] = useState('0');

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
  return <Children />;
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
