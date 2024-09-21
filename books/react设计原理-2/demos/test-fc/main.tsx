import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Children = ({ children }) => {
  const now = performance.now();
  while (performance.now() - now < 4) {}
  useEffect(() => {
    console.log('child mount');
    return () => {
      console.log('child destory');
    };
  }, []);

  return <div>{children}</div>;
};

const App = () => {
  const [visible, setVisible] = useState(true);
  const [num, update] = useState(100);

  useEffect(() => {
    console.log('parent mount');

    return () => {
      console.log('parent destory');
    };
  }, []);

  return (
    <div
      onClick={() => {
        setVisible(!visible);
      }}
    >
      button
      {visible && <Children>{num}</Children>}
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
