import * as React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const [state, setState] = React.useState(0);

  return (
    <div
      onClick={() => {
        setState(state => state + 1);
      }}
    >
      {state}
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
