export type WorkTag =
  | typeof FunctionComponent
  | typeof HostText
  | typeof HostComponent
  | typeof HostRoot
  | typeof Fragment
  | typeof MemoComponent
  | typeof ContextProvider;

export const FunctionComponent = 0;
export const HostRoot = 3;
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const MemoComponent = 8;
export const ContextProvider = 11;
