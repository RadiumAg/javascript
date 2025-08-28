# 简易React实现

🚀 一个基于React 18源码实现的简易版React，包含并发特性、Hooks系统和完整的Fiber架构。

## ✨ 特性

### 🏗️ 核心架构
- ✅ **Fiber架构**: 完整的Fiber节点实现和双缓存机制
- ✅ **协调算法**: 高效的diff算法和子节点协调
- ✅ **更新队列**: 完整的更新调度和优先级管理
- ✅ **调度器**: 时间切片和任务调度系统

### ⚡ 并发特性
- ✅ **时间切片**: 可中断的渲染过程
- ✅ **startTransition**: 非阻塞的状态转换
- ✅ **useTransition**: 带pending状态的transition hook
- ✅ **useDeferredValue**: 延迟值更新
- ✅ **优先级系统**: 完整的Lane模型实现

### 🪝 Hooks系统
- ✅ **useState**: 状态管理Hook
- ✅ **useEffect**: 副作用处理Hook
- ✅ **useCallback**: 回调函数缓存Hook
- ✅ **useMemo**: 值缓存Hook  
- ✅ **useReducer**: 状态归约Hook
- ✅ **useContext**: 上下文消费Hook
- ✅ **useRef**: 引用Hook

### 🌐 ReactDOM
- ✅ **createRoot**: 现代的根节点API
- ✅ **render**: 渲染方法
- ✅ **并发渲染**: 支持时间切片的渲染
- ✅ **DOM操作**: 高效的DOM更新

### 🎯 React API
- ✅ **createElement**: 元素创建
- ✅ **Component/PureComponent**: 类组件
- ✅ **Fragment**: 片段组件
- ✅ **memo**: 组件缓存
- ✅ **forwardRef**: 引用转发
- ✅ **createContext**: 上下文创建

## 📁 项目结构

```
src/
├── types/                 # 核心类型定义
│   ├── constants.js      # React常量定义
│   ├── ReactElement.js   # ReactElement相关类型
│   ├── Fiber.js          # Fiber节点实现
│   └── UpdateQueue.js    # 更新队列系统
├── scheduler/            # 调度器实现
│   ├── Scheduler.js      # 核心调度逻辑
│   └── SchedulerPriorities.js # 优先级和Lane管理
├── reconciler/           # 协调器实现  
│   ├── ReactFiberWorkLoop.js # Fiber工作循环
│   ├── ReactFiberBeginWork.js # beginWork阶段
│   ├── ReactFiberCompleteWork.js # completeWork阶段
│   └── ReactChildFiber.js # 子节点协调算法
├── hooks/                # Hooks实现
│   ├── ReactFiberHooks.js # Hooks系统核心
│   └── ReactTransition.js # Transition特性
├── react-dom/            # ReactDOM实现
│   ├── ReactDOMRoot.js   # 根节点和渲染管理
│   └── index.js          # ReactDOM入口
└── index.js              # React主入口
```

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 运行测试
```bash
npm test
```

### 运行示例
```bash
# 命令行版本
node examples/complete-app.js

# 浏览器版本
open examples/index.html
```

## 🧪 测试

项目包含完整的测试套件：

```bash
# 运行所有测试
npm test

# 单独运行测试文件
node test/basic-api.test.js
node test/dom-rendering.test.js
```

测试覆盖：
- ✅ 基础API测试 (createElement, Component, Hooks)
- ✅ DOM渲染测试 (createRoot, render, 组件树)
- ✅ 并发特性测试 (startTransition, useTransition)
- ✅ 生命周期测试

## 📝 使用示例

### 基本用法

```javascript
import React, { useState, useEffect } from './src/index.js';
import ReactDOM from './src/react-dom/index.js';

function App() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  return React.createElement('div', null,
    React.createElement('h1', null, 'Simple React'),
    React.createElement('p', null, `Count: ${count}`),
    React.createElement('button', {
      onClick: () => setCount(count + 1)
    }, 'Increment')
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
```

### 并发特性

```javascript
import React, { useState, useTransition, startTransition } from './src/index.js';

function ConcurrentApp() {
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  
  const handleClick = () => {
    // 高优先级更新
    setCount(c => c + 1);
    
    // 低优先级更新
    startTransition(() => {
      // 重度计算任务
      heavyComputation();
    });
  };

  return React.createElement('div', null,
    React.createElement('p', null, `Count: ${count}`),
    isPending && React.createElement('p', null, 'Updating...'),
    React.createElement('button', { onClick: handleClick }, 'Update')
  );
}
```

## 🔧 核心实现原理

### Fiber架构
- 采用链表结构实现可中断渲染
- 双缓存机制实现无缝更新
- 优先级调度支持并发特性

### 调度系统  
- 基于MessageChannel的任务调度
- 时间切片防止主线程阻塞
- Lane模型实现优先级管理

### Hooks实现
- 基于链表的Hook状态管理
- 依赖项比较优化重渲染
- 渲染阶段更新检测

### 协调算法
- 高效的key-based diff算法
- 子节点列表优化
- 最小DOM操作

## 🎯 学习价值

这个项目是学习React源码的绝佳材料：

1. **完整性**: 覆盖React的所有核心概念
2. **现代性**: 基于React 18的并发特性
3. **可读性**: 简化但保持核心逻辑
4. **实用性**: 可以实际运行的代码

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License

## 🙏 致谢

感谢React团队为我们提供了如此优秀的库和详细的源码。这个项目的实现主要参考了React官方源码，旨在学习和理解React的核心原理。