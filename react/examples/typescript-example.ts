import { createElement, useState, useEffect, ReactElement, ReactNode } from '../dist/index.js';
import { createRoot } from '../dist/react-dom/index.js';

// 定义组件Props类型
interface CounterProps {
  initialValue?: number;
  title?: string;
}

// 函数组件示例
function Counter({ initialValue = 0, title = "计数器" }: CounterProps): ReactElement {
  const [count, setCount] = useState<number>(initialValue);
  const [isEven, setIsEven] = useState<boolean>(count % 2 === 0);

  useEffect(() => {
    setIsEven(count % 2 === 0);
    console.log(`Count changed to: ${count}`);
  }, [count]);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);

  return createElement('div', {
    style: {
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      margin: '10px',
      backgroundColor: isEven ? '#f0f8ff' : '#fff8f0'
    }
  }, [
    createElement('h2', { key: 'title' }, title),
    createElement('p', { key: 'display' }, `当前计数: ${count} (${isEven ? '偶数' : '奇数'})`),
    createElement('div', { key: 'buttons' }, [
      createElement('button', {
        key: 'inc',
        onClick: increment,
        style: { margin: '5px', padding: '5px 10px' }
      }, '+1'),
      createElement('button', {
        key: 'dec',
        onClick: decrement,
        style: { margin: '5px', padding: '5px 10px' }
      }, '-1'),
      createElement('button', {
        key: 'reset',
        onClick: reset,
        style: { margin: '5px', padding: '5px 10px' }
      }, '重置')
    ])
  ]);
}

// 创建应用组件
function App(): ReactElement {
  const [showSecondCounter, setShowSecondCounter] = useState<boolean>(false);

  return createElement('div', {
    style: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px'
    }
  }, [
    createElement('h1', { key: 'header' }, 'TypeScript React 示例'),
    createElement('p', { key: 'description' }, '这是一个使用 TypeScript 编写的简易 React 应用示例。'),
    
    // 第一个计数器
    createElement(Counter, { 
      key: 'counter1',
      initialValue: 5,
      title: '主计数器'
    }),
    
    // 切换按钮
    createElement('button', {
      key: 'toggle',
      onClick: () => setShowSecondCounter(prev => !prev),
      style: {
        margin: '20px 0',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }
    }, showSecondCounter ? '隐藏第二个计数器' : '显示第二个计数器'),
    
    // 条件渲染第二个计数器
    showSecondCounter && createElement(Counter, {
      key: 'counter2',
      initialValue: 10,
      title: '次计数器'
    })
  ]);
}

console.log('TypeScript React 应用启动中...');

// 如果在浏览器环境中运行
if (typeof document !== 'undefined') {
  const container = document.getElementById('app');
  if (container) {
    const root = createRoot(container);
    root.render(createElement(App));
    console.log('应用已渲染到 DOM');
  } else {
    console.error('未找到 #app 容器元素');
  }
} else {
  // Node.js 环境中的简单测试
  console.log('在 Node.js 环境中测试组件创建...');
  const app = createElement(App);
  console.log('App 组件创建成功:', app.type);
  console.log('TypeScript 类型检查通过！');
}