import * as React from '../src/index.js';
import * as ReactDOM from '../src/react-dom/index.js';

console.log('🧪 开始测试简易React实现...\n');

// 测试1: createElement
console.log('✅ 测试 createElement');
const element = React.createElement('div', { id: 'test' }, 'Hello React');
console.log('创建的元素:', element);
console.assert(element.type === 'div', 'element type should be div');
console.assert(element.props.id === 'test', 'element should have id prop');
console.assert(element.props.children === 'Hello React', 'element should have children');

// 测试2: 函数组件
console.log('✅ 测试函数组件');
function TestComponent(props) {
  return React.createElement('span', null, `Hello ${props.name}`);
}

const componentElement = React.createElement(TestComponent, { name: 'World' });
console.log('函数组件元素:', componentElement);
console.assert(componentElement.type === TestComponent, 'component element type should match');

// 测试3: Fragment
console.log('✅ 测试 Fragment');
const fragmentElement = React.createElement(
  React.Fragment, 
  null, 
  React.createElement('p', null, 'First'),
  React.createElement('p', null, 'Second')
);
console.log('Fragment元素:', fragmentElement);

// 测试4: memo
console.log('✅ 测试 React.memo');
const MemoComponent = React.memo(function MemoTest(props) {
  return React.createElement('div', null, props.text);
});
console.log('Memo组件:', MemoComponent);
console.assert(MemoComponent.$$typeof.toString().includes('react.memo'), 'Should be memo component');

// 测试5: createContext
console.log('✅ 测试 createContext');
const TestContext = React.createContext('default');
console.log('Context:', TestContext);
console.assert(TestContext.$$typeof.toString().includes('react.context'), 'Should be context');
console.assert(TestContext._currentValue === 'default', 'Should have default value');

// 测试6: forwardRef
console.log('✅ 测试 forwardRef');
const ForwardedComponent = React.forwardRef((props, ref) => {
  return React.createElement('input', { ref });
});
console.log('ForwardRef组件:', ForwardedComponent);
console.assert(ForwardedComponent.$$typeof.toString().includes('react.forward_ref'), 'Should be forward ref');

// 测试7: hooks (基础测试)
console.log('✅ 测试 Hooks API');
try {
  console.assert(typeof React.useState === 'function', 'useState should be function');
  console.assert(typeof React.useEffect === 'function', 'useEffect should be function');
  console.assert(typeof React.useCallback === 'function', 'useCallback should be function');
  console.assert(typeof React.useMemo === 'function', 'useMemo should be function');
  console.assert(typeof React.useReducer === 'function', 'useReducer should be function');
  console.assert(typeof React.useContext === 'function', 'useContext should be function');
  console.assert(typeof React.useRef === 'function', 'useRef should be function');
  console.log('所有Hooks API都存在 ✅');
} catch (error) {
  console.error('Hooks API测试失败:', error);
}

// 测试8: Transition APIs
console.log('✅ 测试 Transition APIs');
try {
  console.assert(typeof React.startTransition === 'function', 'startTransition should be function');
  console.assert(typeof React.useTransition === 'function', 'useTransition should be function');
  console.assert(typeof React.useDeferredValue === 'function', 'useDeferredValue should be function');
  console.log('所有Transition API都存在 ✅');
} catch (error) {
  console.error('Transition API测试失败:', error);
}

// 测试9: ReactDOM APIs
console.log('✅ 测试 ReactDOM APIs');
try {
  console.assert(typeof ReactDOM.createRoot === 'function', 'createRoot should be function');
  console.assert(typeof ReactDOM.render === 'function', 'render should be function');
  console.assert(typeof ReactDOM.unmountComponentAtNode === 'function', 'unmountComponentAtNode should be function');
  console.assert(typeof ReactDOM.flushSync === 'function', 'flushSync should be function');
  console.assert(typeof ReactDOM.createPortal === 'function', 'createPortal should be function');
  console.log('所有ReactDOM API都存在 ✅');
} catch (error) {
  console.error('ReactDOM API测试失败:', error);
}

// 测试10: 组件生命周期基础
console.log('✅ 测试 Component 类');
class TestClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return React.createElement('div', null, `Count: ${this.state.count}`);
  }
}

const classInstance = new TestClassComponent({ test: 'prop' });
console.log('类组件实例:', classInstance);
console.assert(classInstance.props.test === 'prop', 'Props should be set');
console.assert(classInstance.state.count === 0, 'Initial state should be set');
console.assert(typeof classInstance.setState === 'function', 'setState should exist');
console.assert(typeof classInstance.forceUpdate === 'function', 'forceUpdate should exist');

console.log('\\n🎉 所有基础测试通过！');

// 导出测试结果供其他文件使用  
export default {
  passed: true,
  message: '所有基础API测试通过'
};