import { useRef, useState } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

const context = createContext(null);

const Context = ({ children }) => (
  <context.Provider value={useState({ a: 1, b: 2 })}>
    {children}
  </context.Provider>
);

const ComponentA = () => {
  const value = useContextSelector(context, (pre) => pre[0].a);
  const setValue = useContextSelector(context, (pre) => pre[1]);
  console.log('ComponentA:::render');
  return (
    <div onClick={() => setValue((pre) => ({ ...pre, a: pre.a + 1 }))}>
      a:{value}:::{Math.random()}
    </div>
  );
};

const ComponentB = () => {
  const value = useContextSelector(context, (pre) => pre[0].b);
  const setValue = useContextSelector(context, (pre) => pre[1]);
  console.log('ComponentB:::render');
  const renderCount = useRef(0);

  renderCount.current++;
  console.log(renderCount.current);

  return (
    <div onClick={() => setValue((pre) => ({ ...pre, b: pre.b + 1 }))}>
      b:{value}:::{renderCount.current}
    </div>
  );
};

const App = () => (
  <Context>
    <ComponentA />
    <ComponentB />
  </Context>
);

export default App;
