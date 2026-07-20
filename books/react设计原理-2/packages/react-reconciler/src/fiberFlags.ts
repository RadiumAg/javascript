export type Flags = number;

export const NoFlags = 0b0000000;
export const Placement = 0b0000001;
export const Update = 0b0000010;
export const ChildDeletion = 0b0000100;

export const PassiveEffect = 0b0001000;
export const Ref = 0b0010000;

// Suspense：render 时报出 thenable 后，标记最近的 Suspense 边界
export const ShouldCapture = 0b0100000;
// unwind 后，表示该 Suspense 已捕获，应渲染 fallback
export const DidCapture = 0b1000000;

export const MutationMask = Placement | Update | ChildDeletion | Ref;
export const LayoutMask = Ref;

export const PassiveMask = PassiveEffect | ChildDeletion;
