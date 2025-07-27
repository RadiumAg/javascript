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
  it.only('should render function component', async () => {
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
