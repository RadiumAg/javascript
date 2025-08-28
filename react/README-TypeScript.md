# 简易React实现 - TypeScript版本

这是一个基于React 18源码实现的简易版React，现已完全转换为TypeScript，提供了完整的类型安全支持。

## 🎯 项目特点

- ✅ **完整的TypeScript支持**: 所有模块都已转换为TypeScript，提供完整的类型安全
- ✅ **现代React特性**: 支持Hooks、并发特性、Suspense等React 18特性
- ✅ **Fiber架构**: 实现了可中断的渲染过程和优先级调度
- ✅ **完整的构建流程**: 使用TypeScript编译器和Rollup打包
- ✅ **类型定义文件**: 自动生成.d.ts文件，支持类型推断和IDE智能提示

## 📁 项目结构

```
src/
├── types/                 # 核心类型定义
│   ├── constants.ts       # 常量和枚举类型
│   ├── ReactElement.ts    # React元素相关类型
│   ├── Fiber.ts          # Fiber节点类型定义
│   └── UpdateQueue.ts    # 更新队列类型定义
├── scheduler/             # 调度器模块
│   ├── Scheduler.ts      # 任务调度器
│   └── SchedulerPriorities.ts # 优先级管理
├── reconciler/            # 协调器模块
│   └── index.ts          # Fiber协调算法
├── hooks/                 # Hooks系统
│   └── index.ts          # React Hooks实现
├── react-dom/            # DOM渲染器
│   └── index.ts          # ReactDOM API
└── index.ts              # 主入口文件
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 构建项目

```bash
# 类型检查
npm run type-check

# 编译TypeScript并打包
npm run build

# 开发模式（监听文件变化）
npm run dev
```

### 运行示例

```bash
# Node.js环境测试
node examples/complete-app.js

# 浏览器环境
open examples/typescript-demo.html
```

## 📝 TypeScript特性

### 强类型支持

```typescript
import { createElement, useState, ReactElement } from './dist/index.js';

interface Props {
  title: string;
  count?: number;
}

function Counter({ title, count = 0 }: Props): ReactElement {
  const [value, setValue] = useState<number>(count);
  
  return createElement('div', {}, [
    createElement('h2', {}, title),
    createElement('p', {}, `Count: ${value}`)
  ]);
}
```

### 完整的Hook类型

```typescript
// useState with type inference
const [count, setCount] = useState<number>(0);

// useEffect with dependency typing
useEffect(() => {
  console.log('Count changed');
}, [count]);

// Custom hooks with proper typing
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState<number>(initialValue);
  const increment = () => setCount(prev => prev + 1);
  return { count, increment };
}
```

### ReactDOM类型支持

```typescript
import { createRoot, Root } from './dist/react-dom/index.js';

const container = document.getElementById('app')!;
const root: Root = createRoot(container);
root.render(createElement(App));
```

## 🛠️ 开发配置

### TypeScript配置 (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node",
    "strict": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### 构建配置

- **TypeScript编译器**: 生成JavaScript代码和类型定义文件
- **Rollup打包**: 创建单一的bundle文件
- **Source Maps**: 支持调试映射

## 🔧 支持的React特性

### 核心API
- `createElement()` - 创建React元素
- `Component` / `PureComponent` - 类组件基类
- `Fragment` - 片段组件
- `memo()` - 高阶组件缓存
- `forwardRef()` - ref转发
- `lazy()` - 懒加载组件

### Hooks系统
- `useState()` - 状态管理
- `useEffect()` - 副作用处理
- `useReducer()` - 复杂状态管理
- `useContext()` - Context消费
- `useCallback()` - 回调缓存
- `useMemo()` - 值缓存
- `useRef()` - 引用管理

### 并发特性
- `useTransition()` - 过渡状态
- `startTransition()` - 开始过渡
- `useDeferredValue()` - 延迟值

### ReactDOM
- `createRoot()` - 创建根节点 (React 18)
- `render()` - 渲染组件 (Legacy)
- `createPortal()` - 创建传送门
- `flushSync()` - 同步刷新

## 📊 类型覆盖率

- ✅ 100% TypeScript代码覆盖
- ✅ 完整的类型定义文件生成
- ✅ 严格的类型检查通过
- ✅ IDE智能提示支持

## 🧪 测试

```bash
# 运行所有测试
npm test

# TypeScript类型检查
npm run type-check
```

## 📚 学习资源

这个项目非常适合用来学习：

1. **TypeScript进阶用法**: 泛型、类型推断、条件类型等
2. **React内部机制**: Fiber架构、调度算法、Hooks实现
3. **现代构建工具**: TypeScript编译、Rollup打包
4. **代码组织**: 模块化设计、类型安全的大型项目结构

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License

## 🙏 致谢

本项目基于React 18源码，感谢React团队的杰出工作。TypeScript转换版本在保持原有功能的基础上，添加了完整的类型安全支持。