import React, { useState } from 'react';
import { useEffect } from 'react';
import { useTransition } from 'react';
import ReactDOM from 'react-dom';

const Children = () => {
  return <div>children</div>;
};

const App = () => {
  const [state, setState] = useState(false);

  const children = state
    ? [<div key={1}>1</div>, <div key={2}>2</div>, <div key={3}>3</div>]
    : [<div key={3}>3</div>, <div key={2}>2</div>, <div key={1}>1</div>];

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.log('useEffect run');

    return () => {
      console.log('useEffect run destory');
    };
  }, [state]);

  return (
    <div
      id="container"
      onClick={() => {
        startTransition(() => {
          setState(!state);
        });
      }}
    >
      {children}
      {isPending}
      <Children />
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
