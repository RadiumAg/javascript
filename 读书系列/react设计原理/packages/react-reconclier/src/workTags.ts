const FunctionComponent = 0;
const HostRoot = 3;
const HostComponent = 5;
const HostText = 6;

type WorkTag =
  | typeof FunctionComponent
  | typeof HostRoot
  | typeof HostComponent
  | typeof HostText;

export type { WorkTag };
export { FunctionComponent, HostRoot, HostComponent, HostText };
