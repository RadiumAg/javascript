import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Children = () => {
  useEffect(() => {
    console.log('child mount');
    return () => {
      console.log('child destory');
    };
  }, []);

  return <div>child</div>;
};

const App = () => {
  const [visible, setVisible] = useState(true);

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
      {visible && <Children />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
