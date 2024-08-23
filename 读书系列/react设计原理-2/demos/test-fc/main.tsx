import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Children = () => {
  const [count, setCount] = useState(0);

  return (
    <div
      onClick={() => {
        setCount(count => count + 1);
        setCount(count => count + 1);
        setCount(count => count + 1);
      }}
    >
      {count}
    </div>
  );
};

const App = () => {
  return <Children />;
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
