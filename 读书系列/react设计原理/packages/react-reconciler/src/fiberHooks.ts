import { FiberNode } from './fiber';

function renderWithHooks(wip: FiberNode) {
  const Component = wip.type;
  const props = wip.pedingProps;
  const children = Component(props);

  return children;
}

export { renderWithHooks };
