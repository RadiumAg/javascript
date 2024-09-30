import { useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Mask from './component/mask';
import { Button, Popover } from 'antd';

function App() {
  const [count, setCount] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement>();

  return (
    <>
      <Mask
        element={containerRef}
        renderMaskContent={(wrapper) => {
          // return (
          //   <Popover
          //     content={
          //       <div style={{ width: 300 }}>
          //         <p>hello</p>
          //         <Button type="primary">下一步</Button>
          //       </div>
          //     }
          //     open={true}
          //   >
          //     {wrapper}
          //   </Popover>
          // );

          return wrapper;
        }}
      ></Mask>

      <div
        ref={(ref) => {
          if (!ref) return;
          setContainerRef(ref);
        }}
      >
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  );
}

export default App;
