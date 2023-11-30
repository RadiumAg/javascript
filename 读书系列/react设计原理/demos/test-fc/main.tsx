import * as React from 'react';
import ReactDOM from 'react-dom';

const Child = () => {
  const [state, setState] = React.useState(1);
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
  return <Child />;
};

ReactDOM.createRoot(document.querySelector('#root')).render(<App />);
