import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Children = () => {
  const [state, setState] = useState(1);

  console.log('children udpate');

  return <div onClick={() => setState(state + 1)}>{state}</div>;
};

const App = () => {
  console.log('parent udpate');
  // useEffect(() => {
  //   console.log('parent mount');

  //   return () => {
  //     console.log('parent destory');
  //   };
  // }, []);

  return (
    <div>
      <Children></Children>
      {/* {visible && <Children>{num}</Children>} */}
      {/* <ul>
        {new Array(num).fill(0).map((_, i) => {
          return <Children key={i}>{i}</Children>;
        })}
      </ul> */}
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
