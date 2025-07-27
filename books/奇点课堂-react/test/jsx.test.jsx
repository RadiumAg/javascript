import { describe, it, expect } from 'vitest';
import * as AReact from '../AReact';

describe('AReact JSX', () => {
  it('should render jsx', async () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar"></div>
      </div>
    );

    const root = AReact.createRoot(container);

    await AReact.act(() => {
      root.render(element);
    });

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div></div>'
    );
  });
});

describe('should render jsx with text', () => {
  it('should render jsx', async () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar"></div>
        <button>Add</button>
      </div>
    );

    const root = AReact.createRoot(container);
    await AReact.act(() => {
      root.render(element);
    });

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button>Add</button></div>'
    );
  });
});

describe('should render jsx with different props', () => {
  it('should render jsx', async () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo" className="bar">
        <button>Add</button>
      </div>
    );

    const root = AReact.createRoot(container);

    await AReact.act(() => {
      root.render(element);
    });

    expect(container.innerHTML).toBe(
      '<div id="foo" class="bar"><button>Add</button></div>'
    );
  });
});

describe('AReact Concurrent', () => {
  it('should render in async', async () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo" className="bar">
        <button>Add</button>
      </div>
    );

    const root = AReact.createRoot(container);
    await AReact.act(() => {
      root.render(element);
      expect(container.innerHTML).toBe('');
    });

    expect(container.innerHTML).toBe(
      '<div id="foo" class="bar"><button>Add</button></div>'
    );
  });
});

describe('Function component', () => {
  it('should render Function component', async () => {
    const container = document.createElement('div');
    function App() {
      return (
        <div id="foo" className="bar">
          <button>Add</button>
        </div>
      );
    }

    const root = AReact.createRoot(container);
    await AReact.act(() => {
      root.render(<App />);
      expect(container.innerHTML).toBe('');
    });

    expect(container.innerHTML).toBe(
      '<div id="foo" class="bar"><button>Add</button></div>'
    );
  });
});

describe('Function component', () => {
  it('should render nested Function component', async () => {
    const container = document.createElement('div');
    function App(props) {
      return (
        <div id="foo" className="bar">
          <div id="bar">{props.title}</div>
          <button>Add</button>
          {props.children}
        </div>
      );
    }

    const root = AReact.createRoot(container);
    await AReact.act(() => {
      root.render(
        <App title="main title">
          <App title="sub title" />
        </App>
      );
      expect(container.innerHTML).toBe('');
    });

    expect(container.innerHTML).toBe(
      '<div id="foo" class="bar"><div id="bar">main title</div><button>Add</button><div id="foo" class="bar"><div id="bar">sub title</div><button>Add</button></div></div>'
    );
  });
});

describe('Hooks', () => {
  it('should support useState', async () => {
    const container = document.createElement('div');
    const globalObj = {};
    function App(props) {
      const [count, setCount] = AReact.useState(100);
      globalObj.count = count;
      globalObj.setCount = setCount;

      return (
        <div id="foo" className="bar">
          {count}
        </div>
      );
    }

    const root = AReact.createRoot(container);
    await AReact.act(() => {
      root.render(<App title="main title"></App>);
      expect(container.innerHTML).toBe('');
    });

    await AReact.act(() => {
      globalObj.setCount((count) => count + 1);
    });

    expect(globalObj.count).toBe(101);
  });
});
