import React, { useState, memo } from 'react';
import ReactDOM from 'react-dom';

// ① memo 包裹、且不接收任何 props 的组件
//    父组件无论怎么更新，它都应该命中 bailout，不会打印 render
const ExpensiveCpn: any = memo(function ExpensiveCpn() {
  console.log('%cExpensiveCpn render', 'color:red');
  return <p>ExpensiveCpn（若无 render 日志说明 memo 生效）</p>;
});

// ② memo 包裹、接收 num prop 的组件
//    只有 num 变化时才会重新渲染（浅比较生效）
const NumShow: any = memo(function NumShow({ num }: { num: number }) {
  console.log('%cNumShow render, num =' + num, 'color:blue');
  return <p>num = {num}</p>;
});

const App = () => {
  const [num, setNum] = useState(0);
  const [count, setCount] = useState(0);

  console.log('%cApp render, num=' + num + ' count=' + count, 'color:green');

  return (
    <div>
      <div onClick={() => setNum((n: number) => n + 1)}>
        【点我】num + 1（NumShow 会重渲染，ExpensiveCpn 不会）
      </div>
      <div onClick={() => setCount((c: number) => c + 1)}>
        【点我】count + 1（NumShow、ExpensiveCpn 都不会重渲染）
      </div>
      <p>App count = {count}</p>
      <NumShow num={num} />
      <ExpensiveCpn />
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
