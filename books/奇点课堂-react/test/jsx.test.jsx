import { describe, it, expect } from 'vitest';
import * as AReact from '../AReact';
import { vi } from 'vitest';

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

    await AReact.act(() => {
      globalObj.setCount(200);
    });

    expect(globalObj.count).toBe(200);
  });

  it('should support userReducer', async () => {
    const container = document.createElement('div');
    const globalObj = {};

    function reducer(state, action) {
      switch (action.type) {
        case 'add':
          return state + 1;

        default:
          throw new Error();
      }
    }

    function App(props) {
      const [count, dispatch] = AReact.useReducer(reducer, 100);
      globalObj.count = count;
      globalObj.dispatch = dispatch;

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
      globalObj.dispatch({ type: 'add' });
    });

    expect(globalObj.count).toBe(101);

    await AReact.act(() => {
      globalObj.dispatch({ type: 'add' });
    });

    expect(globalObj.count).toBe(102);
  });
});

describe('event binding', () => {
  it('should support event binding', async () => {
    const container = document.createElement('div');
    const globalObj = {
      increase: (count) => count + 1,
    };
    function App() {
      const [count, setCount] = AReact.useState(100);

      return (
        <button
          onClick={() => {
            setCount(globalObj.increase);
          }}
        >
          {count}
        </button>
      );
    }

    const increaseSpy = vi.spyOn(globalObj, 'increase');

    const root = AReact.createRoot(container);
    await AReact.act(() => {
      root.render(<App />);
    });
    expect(increaseSpy).not.toBeCalled();

    await AReact.act(() => {
      container.querySelectorAll('button')[0].click();
      container.querySelectorAll('button')[0].click();
    });

    expect(increaseSpy).toBeCalledTimes(2);
  });
});

describe('Reconciler', () => {
  it('should support DOM CRUD', async () => {
    const container = document.createElement('div');
    function App(props) {
      const [count, setState] = AReact.useState(2);

      return (
        <div>
          {count}
          <button onClick={() => setState((count) => count + 1)}></button>
          <button onClick={() => setState((count) => count - 1)}>-</button>

          <ul>
            {Array.from({ length: count }, (_, i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      );
    }

    const root = AReact.createRoot(container);
    await AReact.act(() => {
      root.render(<App />);
      expect(container.innerHTML).toBe('');
    });

    await AReact.act(() => {
      container.querySelectorAll('button')[0].click();
    });

    expect(container.innerHTML).toBe(
      '<div>3<button></button><button>-</button><ul><li>0</li><li>1</li><li>2</li></ul></div>'
    );
  });
});
