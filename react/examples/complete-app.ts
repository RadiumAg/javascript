import React, { useState, useEffect, useCallback, useMemo, useTransition, startTransition } from '../src/index.ts';
import ReactDOM from '../src/react-dom/index.ts';

// 模拟DOM环境
if (typeof document === 'undefined') {
  global.document = {
    createElement: (tag) => ({
      tagName: tag.toUpperCase(),
      children: [],
      nodeType: 1,
      textContent: '',
      innerHTML: '',
      classList: {
        add: function() {},
        remove: function() {},
        contains: function() { return false; }
      },
      appendChild: function(child) {
        this.children.push(child);
        child.parentNode = this;
      },
      removeChild: function(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
          this.children.splice(index, 1);
          child.parentNode = null;
        }
      },
      setAttribute: function(name, value) {
        this.attributes = this.attributes || {};
        this.attributes[name] = value;
      },
      getAttribute: function(name) {
        return this.attributes && this.attributes[name];
      },
      addEventListener: function() {},
      removeEventListener: function() {}
    }),
    createTextNode: (text) => ({
      nodeType: 3,
      textContent: text,
      parentNode: null
    }),
    getElementById: (id) => ({
      id,
      tagName: 'DIV',
      children: [],
      nodeType: 1
    })
  };
}

console.log('🚀 启动简易React完整示例应用\\n');

// 示例1: 计数器组件 (展示useState, useCallback)
function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = useCallback(() => {
    setCount(c => c + step);
  }, [step]);

  const decrement = useCallback(() => {
    setCount(c => c - step);
  }, [step]);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  return React.createElement('div', { className: 'counter' },
    React.createElement('h2', null, '计数器示例'),
    React.createElement('p', null, `当前计数: ${count}`),
    React.createElement('div', null,
      React.createElement('label', null, 
        '步长: ',
        React.createElement('input', {
          type: 'number',
          value: step,
          onChange: (e) => setStep(parseInt(e.target.value) || 1)
        })
      )
    ),
    React.createElement('div', null,
      React.createElement('button', { onClick: increment }, `+${step}`),
      React.createElement('button', { onClick: decrement }, `-${step}`),
      React.createElement('button', { onClick: reset }, '重置')
    )
  );
}

// 示例2: 待办事项列表 (展示useEffect, useMemo)
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习React原理', completed: false },
    { id: 2, text: '实现简易React', completed: true },
    { id: 3, text: '创建示例应用', completed: false }
  ]);
  const [filter, setFilter] = useState('all');

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'active':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const toggleTodo = useCallback((id) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const addTodo = useCallback((text) => {
    if (text.trim()) {
      setTodos(todos => [
        ...todos,
        { id: Date.now(), text: text.trim(), completed: false }
      ]);
    }
  }, []);

  useEffect(() => {
    console.log(`当前有 ${todos.length} 个待办事项，其中 ${todos.filter(t => t.completed).length} 个已完成`);
  }, [todos]);

  return React.createElement('div', { className: 'todo-list' },
    React.createElement('h2', null, '待办事项列表'),
    React.createElement('div', null,
      React.createElement('input', {
        type: 'text',
        placeholder: '添加新的待办事项...',
        onKeyPress: (e) => {
          if (e.key === 'Enter') {
            addTodo(e.target.value);
            e.target.value = '';
          }
        }
      })
    ),
    React.createElement('div', null,
      React.createElement('button', { 
        onClick: () => setFilter('all'),
        style: { fontWeight: filter === 'all' ? 'bold' : 'normal' }
      }, '全部'),
      React.createElement('button', { 
        onClick: () => setFilter('active'),
        style: { fontWeight: filter === 'active' ? 'bold' : 'normal' }
      }, '未完成'),
      React.createElement('button', { 
        onClick: () => setFilter('completed'),
        style: { fontWeight: filter === 'completed' ? 'bold' : 'normal' }
      }, '已完成')
    ),
    React.createElement('ul', null,
      ...filteredTodos.map(todo =>
        React.createElement('li', { key: todo.id },
          React.createElement('label', null,
            React.createElement('input', {
              type: 'checkbox',
              checked: todo.completed,
              onChange: () => toggleTodo(todo.id)
            }),
            React.createElement('span', {
              style: { textDecoration: todo.completed ? 'line-through' : 'none' }
            }, todo.text)
          )
        )
      )
    )
  );
}

// 示例3: 并发特性展示 (展示useTransition, startTransition)
function ConcurrentDemo() {
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [heavyList, setHeavyList] = useState([]);

  const updateCount = useCallback(() => {
    // 高优先级更新
    setCount(c => c + 1);
  }, []);

  const updateHeavyList = useCallback(() => {
    // 低优先级更新，使用startTransition包裹
    startTransition(() => {
      const newList = [];
      for (let i = 0; i < 1000; i++) {
        newList.push(`项目 ${i + 1}`);
      }
      setHeavyList(newList);
    });
  }, [startTransition]);

  const manualTransition = useCallback(() => {
    startTransition(() => {
      console.log('手动启动transition更新');
      setHeavyList(list => [...list].reverse());
    });
  }, []);

  return React.createElement('div', { className: 'concurrent-demo' },
    React.createElement('h2', null, '并发特性演示'),
    React.createElement('p', null, `计数器: ${count} ${isPending ? '(更新中...)' : ''}`),
    React.createElement('div', null,
      React.createElement('button', { onClick: updateCount }, '高优先级更新 (+1)'),
      React.createElement('button', { onClick: updateHeavyList }, '生成大量数据 (低优先级)'),
      React.createElement('button', { onClick: manualTransition }, '反转列表 (Transition)')
    ),
    React.createElement('div', null,
      React.createElement('small', null, `列表包含 ${heavyList.length} 项`)
    )
  );
}

// 示例4: Context示例
const ThemeContext = React.createContext('light');

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  }, []);

  // 在实际实现中，这里应该使用Context.Provider
  // 简化实现中，我们直接返回children
  return React.createElement('div', { className: `theme-${theme}` },
    React.createElement('button', { onClick: toggleTheme }, 
      `切换主题 (当前: ${theme})`
    ),
    children
  );
}

function ThemedComponent() {
  const theme = React.useContext(ThemeContext);
  
  return React.createElement('div', { 
    style: { 
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333',
      padding: '10px',
      margin: '10px'
    }
  },
    React.createElement('p', null, `当前主题: ${theme}`)
  );
}

// 主应用组件
function App() {
  const [activeTab, setActiveTab] = useState('counter');

  const tabs = [
    { id: 'counter', name: '计数器', component: Counter },
    { id: 'todos', name: '待办事项', component: TodoList },
    { id: 'concurrent', name: '并发特性', component: ConcurrentDemo }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Counter;

  return React.createElement('div', { className: 'app' },
    React.createElement('header', null,
      React.createElement('h1', null, '🚀 简易React示例应用'),
      React.createElement('p', null, '展示自实现的React核心功能')
    ),
    
    React.createElement('nav', null,
      React.createElement('div', { className: 'tabs' },
        ...tabs.map(tab =>
          React.createElement('button', {
            key: tab.id,
            onClick: () => setActiveTab(tab.id),
            style: {
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              backgroundColor: activeTab === tab.id ? '#007acc' : '#f0f0f0',
              color: activeTab === tab.id ? 'white' : 'black'
            }
          }, tab.name)
        )
      )
    ),

    React.createElement('main', null,
      React.createElement(ThemeProvider, null,
        React.createElement(ActiveComponent),
        React.createElement(ThemedComponent)
      )
    ),

    React.createElement('footer', null,
      React.createElement('hr', null),
      React.createElement('p', null, '✨ 实现的特性:'),
      React.createElement('ul', null,
        React.createElement('li', null, '✅ createElement, Fragment, Component'),
        React.createElement('li', null, '✅ useState, useEffect, useCallback, useMemo'),
        React.createElement('li', null, '✅ useTransition, startTransition, useDeferredValue'),
        React.createElement('li', null, '✅ Fiber架构和协调算法'),
        React.createElement('li', null, '✅ 调度器和并发特性'),
        React.createElement('li', null, '✅ ReactDOM.createRoot, render')
      ),
      React.createElement('small', null, '© 2024 简易React实现')
    )
  );
}

// 启动应用
function startApp() {
  console.log('📱 创建应用根节点...');
  
  const container = document.getElementById('root') || document.createElement('div');
  container.id = 'root';
  
  try {
    const root = ReactDOM.createRoot(container);
    
    console.log('🎯 渲染应用...');
    root.render(React.createElement(App));
    
    console.log('✅ 应用启动成功！');
    console.log('\\n🔍 应用结构预览:');
    console.log('├── 计数器示例 (useState, useCallback)');
    console.log('├── 待办事项列表 (useEffect, useMemo, 数组操作)');
    console.log('├── 并发特性演示 (useTransition, startTransition)');
    console.log('└── 主题切换 (useContext)');
    
    return { success: true, root, container };
  } catch (error) {
    console.error('❌ 应用启动失败:', error);
    return { success: false, error };
  }
}

// 如果是直接运行这个文件
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = startApp();
  
  if (result.success) {
    console.log('\\n🎉 简易React示例应用运行成功！');
    console.log('\\n💡 这个应用展示了我们实现的所有核心React特性。');
    console.log('虽然是简化版本，但包含了React的主要设计思想和架构。');
  }
}

export default startApp;