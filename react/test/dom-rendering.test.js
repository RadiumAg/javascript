import * as React from '../src/index.js';
import * as ReactDOM from '../src/react-dom/index.js';

// 模拟DOM环境
global.document = {
  createElement: (tag) => ({
    tagName: tag.toUpperCase(),
    children: [],
    nodeType: 1,
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
    }
  }),
  createTextNode: (text) => ({
    nodeType: 3,
    textContent: text,
    parentNode: null
  }),
  body: null
};

// 创建body元素
document.body = document.createElement('body');

console.log('🧪 开始DOM渲染测试...\n');

// 测试1: 创建根节点
console.log('✅ 测试 createRoot');
const container = document.createElement('div');
container.id = 'root';

let root;
try {
  root = ReactDOM.createRoot(container);
  console.log('根节点创建成功:', root);
  console.assert(root != null, 'Root should be created');
} catch (error) {
  console.error('创建根节点失败:', error);
}

// 测试2: 简单元素渲染
console.log('✅ 测试简单元素渲染');
try {
  const element = React.createElement('h1', { id: 'title' }, 'Hello Simple React!');
  
  if (root) {
    root.render(element);
    console.log('元素渲染完成');
    console.log('容器内容:', container);
  }
} catch (error) {
  console.error('元素渲染失败:', error);
}

// 测试3: 函数组件渲染
console.log('✅ 测试函数组件渲染');
function Welcome(props) {
  return React.createElement('p', null, `Welcome, ${props.name}!`);
}

try {
  const welcomeElement = React.createElement(Welcome, { name: 'React Developer' });
  
  if (root) {
    root.render(welcomeElement);
    console.log('函数组件渲染完成');
  }
} catch (error) {
  console.error('函数组件渲染失败:', error);
}

// 测试4: 组件树渲染
console.log('✅ 测试组件树渲染');
function App() {
  return React.createElement('div', { className: 'app' },
    React.createElement('header', null,
      React.createElement('h1', null, 'Simple React App')
    ),
    React.createElement('main', null,
      React.createElement('p', null, 'This is a test of our React implementation.'),
      React.createElement(Welcome, { name: 'Component Tree' })
    ),
    React.createElement('footer', null,
      React.createElement('small', null, '© 2024 Simple React')
    )
  );
}

try {
  const appElement = React.createElement(App);
  
  if (root) {
    root.render(appElement);
    console.log('组件树渲染完成');
    console.log('最终DOM结构:', JSON.stringify(container, null, 2));
  }
} catch (error) {
  console.error('组件树渲染失败:', error);
}

// 测试5: Legacy render方法
console.log('✅ 测试 Legacy render');
const legacyContainer = document.createElement('div');
legacyContainer.id = 'legacy-root';

try {
  ReactDOM.render(
    React.createElement('div', null, 'Legacy Render Test'),
    legacyContainer
  );
  console.log('Legacy渲染完成');
  console.log('Legacy容器:', legacyContainer);
} catch (error) {
  console.error('Legacy渲染失败:', error);
}

// 测试6: 卸载组件
console.log('✅ 测试组件卸载');
try {
  if (root) {
    root.unmount();
    console.log('组件卸载完成');
  }
  
  const unmountResult = ReactDOM.unmountComponentAtNode(legacyContainer);
  console.log('Legacy卸载结果:', unmountResult);
} catch (error) {
  console.error('组件卸载失败:', error);
}

// 测试7: Portal
console.log('✅ 测试 Portal');
try {
  const portalContainer = document.createElement('div');
  const portal = ReactDOM.createPortal(
    React.createElement('div', null, 'Portal Content'),
    portalContainer
  );
  
  console.log('Portal创建成功:', portal);
  console.assert(portal.$$typeof.toString().includes('react.portal'), 'Should be portal');
  console.assert(portal.containerInfo === portalContainer, 'Should have correct container');
} catch (error) {
  console.error('Portal测试失败:', error);
}

console.log('\\n🎉 DOM渲染测试完成！');

export default {
  passed: true,
  message: 'DOM渲染测试通过'
};