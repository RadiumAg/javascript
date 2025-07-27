import { describe, it, expect } from 'vitest';
import * as AReact from '../AReact';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('AReact JSX', () => {
  it('should render jsx', () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar"></div>
      </div>
    );

    const root = AReact.createRoot(container);
    root.render(element);
    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div></div>'
    );
  });
});

describe('should render jsx with text', () => {
  it('should render jsx', () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar"></div>
        <button>Add</button>
      </div>
    );

    const root = AReact.createRoot(container);
    root.render(element);
    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button>Add</button></div>'
    );
  });
});

describe('should render jsx with different props', () => {
  it('should render jsx', () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo" className="bar">
        <button>Add</button>
      </div>
    );

    const root = AReact.createRoot(container);
    root.render(element);
    expect(container.innerHTML).toBe(
      '<div id="foo" class="bar"><button>Add</button></div>'
    );
  });
});

describe('AReact Concurrent', () => {
  it.only('should render in async', async () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo" className="bar">
        <button>Add</button>
      </div>
    );

    const root = AReact.createRoot(container);
    root.render(element);

    expect(container.innerHTML).toBe('');
    await sleep(1000);
    expect(container.innerHTML).toBe(
      '<div id="foo" class="bar"><button>Add</button></div>'
    );
  });
});
