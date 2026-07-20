import React, { Suspense, use } from 'react';
import ReactDOM from 'react-dom';

// Suspense 是个 symbol，TS 不能直接当 JSX 标签，cast any 规避 demo 类型限制
const SuspenseBoundary: any = Suspense;

// 缓存 Promise —— 关键：必须是稳定引用，否则每次渲染都 new 一个 → 永远挂起
let cachedPromise: Promise<string> | null = null;
function fetchData(): Promise<string> {
  if (cachedPromise === null) {
    console.log('%c发起异步请求...', 'color:orange');
    cachedPromise = new Promise((resolve) => {
      setTimeout(() => resolve('异步数据加载完成 ✅'), 2000);
    });
  }
  return cachedPromise;
}

const Content = () => {
  console.log('%cContent 尝试渲染', 'color:blue');
  // use 读取 Promise：pending 时抛出挂起，resolve 后返回数据
  const data = use(fetchData()) as string;
  console.log('%cContent 拿到数据: ' + data, 'color:green');
  return <p>{data}</p>;
};

const App = () => {
  return (
    <div>
      <p>Suspense Demo（约 2 秒后加载完成）</p>
      <SuspenseBoundary fallback={<p>⏳ Loading...</p>}>
        <Content />
      </SuspenseBoundary>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
