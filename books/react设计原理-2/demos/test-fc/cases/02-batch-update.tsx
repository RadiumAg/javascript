import React, { useState } from 'react';

export const title = '一次 tick 内多次 setState';
export const note =
  '三次 setState 只重渲染一次：enqueueUpdate 拼环 + 微任务里统一消费';

let renderCount = 0;

const App = () => {
  const [count, setCount] = useState(0);
  renderCount += 1;

  return (
    <div>
      <p>
        count = {count}，render 次数 = {renderCount}
      </p>
      <button
        type="button"
        onClick={() => {
          setCount((c) => c + 1);
          setCount((c) => c + 2);
          setCount((c) => c + 3);
        }}
      >
        +6（点了只该多一次 render）
      </button>
      <button
        type="button"
        onClick={() => {
          renderCount = 0;
          setCount(0);
        }}
      >
        重置
      </button>
    </div>
  );
};

export default App;
