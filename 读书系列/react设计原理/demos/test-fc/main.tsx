import * as React from 'react';
import ReactDOM from 'react-dom';

const Child = () => {
  const [state, setState] = React.useState(1);

  // const ul =
  //   state % 2 === 0
  //     ? [<li key="1">1</li>, <li key="2">2</li>, <li key="3">3</li>]
  //     : [<li key="3">3</li>, <li key="2">2</li>, <li key="1">1</li>];

  return (
    <div
      onClickCapture={() => {
        setState(state => state + 1);
      }}
    >
      {state}
    </div>
  );
  // );

  // return (
  //   <>
  //     <div></div>
  //     <div></div>
  //   </>
  // );
};

const App = () => {
  const [state, setState] = React.useState(1);

  return (
    <div
      onClickCapture={() => {
        setState(state => state + 1);
      }}
    >
      {state}
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
