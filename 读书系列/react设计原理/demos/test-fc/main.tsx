import * as React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const [state, setState] = React.useState([
    { a: 1, key: 1 },
    { a: 2, key: 2 },
  ]);
  const children = state.map(item => <div key={item.key}>{item.a}</div>);

  return (
    <div
      onClick={() => {
        setState(() => {
          const newState = [...state];
          return newState.reverse();
        });
      }}
    >
      {children}
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
