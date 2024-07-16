export type WorkTag =
  | typeof FunctionComponent
  | typeof HostText
  | typeof HostComponent
  | typeof HostRoot;

export const FunctionComponent = 0;
export const HostRoot = 3;
export const HostComponent = 5;
export const HostText = 6;
