// 工作优先级
export const NoPriority = 0;
export const ImmediatePriority = 1;
export const UserBlockingPriority = 2;
export const NormalPriority = 3;
export const LowPriority = 4;
export const IdlePriority = 5;

// 优先级类型
export type Priority = 0 | 1 | 2 | 3 | 4 | 5;

// Lane 优先级系统
export const NoLanes = 0b0000000000000000000000000000000;
export const NoLane = 0b0000000000000000000000000000000;
export const SyncLane = 0b0000000000000000000000000000001;
export const InputContinuousHydrationLane = 0b0000000000000000000000000000010;
export const InputContinuousLane = 0b0000000000000000000000000000100;
export const DefaultHydrationLane = 0b0000000000000000000000000001000;
export const DefaultLane = 0b0000000000000000000000000010000;
export const TransitionLane1 = 0b0000000000000000000000000100000;

// Lane类型
export type Lanes = number;
export type Lane = number;

// Fiber工作标记
export const NoFlags = 0b00000000000000000000000000;
export const PerformedWork = 0b00000000000000000000000001;
export const Placement = 0b00000000000000000000000010;
export const Update = 0b00000000000000000000000100;
export const PlacementAndUpdate = Placement | Update;
export const Deletion = 0b00000000000000000000001000;
export const ContentReset = 0b00000000000000000000010000;
export const Callback = 0b00000000000000000000100000;
export const DidCapture = 0b00000000000000000001000000;
export const Ref = 0b00000000000000000010000000;
export const Snapshot = 0b00000000000000000100000000;
export const PassiveMask = 0b00000000000000001000000000;
export const LayoutMask = 0b00000000000000000100000000;
export const MutationMask = 0b00000000000000000010000000;

// Flags类型
export type Flags = number;

// Fiber类型
export const FunctionComponent = 0;
export const ClassComponent = 1;
export const IndeterminateComponent = 2;
export const HostRoot = 3;
export const HostPortal = 4;
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;

// WorkTag类型
export type WorkTag = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

// Hook类型
export const HookLayout = 0b010;
export const HookPassive = 0b100;
export const HookInsertion = 0b001;

// Hook标记类型
export type HookFlags = number;

// 更新类型
export const UpdateState = 0;
export const ReplaceState = 1;
export const ForceUpdate = 2;
export const CaptureUpdate = 3;

// 更新标签类型
export type UpdateTag = 0 | 1 | 2 | 3;

// 工作模式
export const NoMode = 0b00000;
export const StrictMode = 0b00001;
export const ConcurrentMode = 0b00010;
export const ProfileMode = 0b00100;
export const DebugTracingMode = 0b01000;
export const StrictLegacyMode = 0b10000;

// 类型模式
export type TypeOfMode = number;