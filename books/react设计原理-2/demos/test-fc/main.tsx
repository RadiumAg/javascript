import React, { useState, memo, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';

// createContext 创建 context；cast any 规避 demo 的 JSX 类型限制
const CountContext: any = createContext(0);

// 关键：中间层用 memo 包裹、且不接收 props。
// 正常情况下 count 变化时 Middle 会 bailout（不 render）。
// 但 Consumer 消费了 context，propagateContextChange 应让更新“穿透”memo 到达 Consumer。
const Middle: any = memo(function Middle() {
  console.log('%cMiddle render', 'color:orange');
  return <Consumer />;
});

const Consumer = () => {
  const count = useContext(CountContext) as number;
  console.log('%cConsumer render, count=' + count, 'color:purple');
  return <p>Consumer 读到的 count = {count}</p>;
};

const App = () => {
  const [count, setCount] = useState(0);

  console.log('%cApp render, count=' + count, 'color:green');

  return (
    <div>
      <div onClick={() => setCount((c: number) => c + 1)}>
        【点我】count + 1（Consumer 应更新，Middle 不应 render）
      </div>
      <CountContext.Provider value={count}>
        <Middle />
      </CountContext.Provider>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
