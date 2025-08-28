import {
  NoLanes,
  NoLane,
  SyncLane,
  InputContinuousLane,
  DefaultLane,
  TransitionLane1,
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
  Priority,
  Lanes,
  Lane,
} from '../types/constants.js';

const __DEV__ = process.env.NODE_ENV !== 'production';

const IdleLanes: Lanes = 0b0001111111111111111111111000000;
const TransitionLanes: Lanes = 0b0000000001111111111111110000000;
const RetryLanes: Lanes = 0b0000111000000000000000000000000;
const NonIdleLanes: Lanes = 0b0001111111111111111111111111111;
const NonHydrationLanes: Lanes = 0b0001111111111111111111111111101;
const UpdateLanes: Lanes = 0b0000000000000000000000000111110;
const TransitionUpdateLanes: Lanes = 0b0000000001111111111111110000000;

// 事件优先级类型
export type EventPriority = Lane;

export const DiscreteEventPriority: EventPriority = SyncLane;
export const ContinuousEventPriority: EventPriority = InputContinuousLane;
export const DefaultEventPriority: EventPriority = DefaultLane;
export const IdleEventPriority: EventPriority = IdleLanes;

export const NoTimestamp = -1;

// FiberRoot类型定义
interface FiberRoot {
  expiredLanes: Lanes;
  pendingLanes: Lanes;
  suspendedLanes: Lanes;
  pingedLanes: Lanes;
}

// Lane 相关函数
export function getHighestPriorityLane(lanes: Lanes): Lane {
  return lanes & -lanes;
}

export function getLowestPriorityLane(lanes: Lanes): Lane {
  // 找到最低位的1
  const index = 31 - Math.clz32(lanes);
  return index < 0 ? NoLanes : 1 << index;
}

export function getEqualOrHigherPriorityLanes(lanes: Lanes): Lanes {
  return (getLowestPriorityLane(lanes) << 1) - 1;
}

export function pickArbitraryLane(lanes: Lanes): Lane {
  // 这个函数会选择任意一个lane，通常是最高优先级的
  return getHighestPriorityLane(lanes);
}

export function pickArbitraryLaneIndex(lanes: Lanes): number {
  return 31 - Math.clz32(lanes);
}

export function laneToIndex(lane: Lane): number {
  return pickArbitraryLaneIndex(lane);
}

export function includesSomeLane(a: Lanes, b: Lanes): boolean {
  return (a & b) !== NoLanes;
}

export function isSubsetOfLanes(set: Lanes, subset: Lanes): boolean {
  return (set & subset) === subset;
}

export function mergeLanes(a: Lanes, b: Lanes): Lanes {
  return a | b;
}

export function removeLanes(set: Lanes, subset: Lanes): Lanes {
  return set & ~subset;
}

export function intersectLanes(a: Lanes, b: Lanes): Lanes {
  return a & b;
}

// 优先级转换
export function lanesToEventPriority(lanes: Lanes): EventPriority {
  const lane = getHighestPriorityLane(lanes);
  if (!isHigherEventPriority(DiscreteEventPriority, lane)) {
    return DiscreteEventPriority;
  }
  if (!isHigherEventPriority(ContinuousEventPriority, lane)) {
    return ContinuousEventPriority;
  }
  if (includesNonIdleWork(lane)) {
    return DefaultEventPriority;
  }
  return IdleEventPriority;
}

export function lanesToSchedulerPriority(lanes: Lanes): Priority {
  const lane = getHighestPriorityLane(lanes);
  
  if ((lane & SyncLane) !== NoLane) {
    return ImmediatePriority;
  }
  if ((lane & (InputContinuousLane)) !== NoLane) {
    return UserBlockingPriority;
  }
  if ((lane & DefaultLane) !== NoLane) {
    return NormalPriority;
  }
  if ((lane & TransitionLane1) !== NoLane) {
    return NormalPriority;
  }
  
  return LowPriority;
}

export function schedulerPriorityToLanePriority(schedulerPriorityLevel: Priority): Lane {
  switch (schedulerPriorityLevel) {
    case ImmediatePriority:
      return SyncLane;
    case UserBlockingPriority:
      return InputContinuousLane;
    case NormalPriority:
    case LowPriority:
      return DefaultLane;
    case IdlePriority:
      return IdleLanes;
    default:
      return NoLanes;
  }
}

export function isHigherEventPriority(a: EventPriority, b: EventPriority): boolean {
  return a !== 0 && a < b;
}

export function includesNonIdleWork(lanes: Lanes): boolean {
  return (lanes & NonIdleLanes) !== NoLanes;
}

// 到期时间相关
const MAGIC_NUMBER_OFFSET = 2;

export function computeExpirationTime(lane: Lane, currentTime: number): number {
  switch (lane) {
    case SyncLane:
    case InputContinuousLane:
      return currentTime + 250;
    case DefaultLane:
      return currentTime + 5000;
    case TransitionLane1:
      return currentTime + 10000;
    case IdleLanes:
      return NoTimestamp;
    default:
      if (__DEV__) {
        console.error(
          'Should have found matching lanes. This is a bug in React.'
        );
      }
      return currentTime + 5000;
  }
}

// 标记跳过的更新lanes
let workInProgressRootSkippedLanes: Lanes = NoLanes;

export function markSkippedUpdateLanes(lane: Lane): void {
  workInProgressRootSkippedLanes = mergeLanes(
    workInProgressRootSkippedLanes,
    lane
  );
}

export function getSkippedLanes(): Lanes {
  return workInProgressRootSkippedLanes;
}

export function resetSkippedLanes(): void {
  workInProgressRootSkippedLanes = NoLanes;
}

// 批处理相关
let currentUpdatePriority: Lane = NoLane;

export function getCurrentUpdatePriority(): Lane {
  return currentUpdatePriority;
}

export function setCurrentUpdatePriority(newPriority: Lane): void {
  currentUpdatePriority = newPriority;
}

export function requestUpdateLane(): Lane {
  return DefaultLane;
}

export function getCurrentEventPriority(): EventPriority {
  return DefaultEventPriority;
}

export function runWithPriority<T>(priority: Lane, fn: () => T): T {
  const previousPriority = getCurrentUpdatePriority();
  try {
    setCurrentUpdatePriority(priority);
    return fn();
  } finally {
    setCurrentUpdatePriority(previousPriority);
  }
}

// 连续事件检测
let isInsideEventHandler = false;

export function setIsInsideEventHandler(value: boolean): void {
  isInsideEventHandler = value;
}

export function getIsInsideEventHandler(): boolean {
  return isInsideEventHandler;
}

// Transition lanes分配
let nextTransitionLane: Lane = TransitionLane1;

export function claimNextTransitionLane(): Lane {
  const lane = nextTransitionLane;
  nextTransitionLane <<= 1;
  if ((nextTransitionLane & TransitionLanes) === NoLane) {
    nextTransitionLane = TransitionLane1;
  }
  return lane;
}

export function includesBlockingLane(root: FiberRoot, lanes: Lanes): boolean {
  const SyncDefaultLanes = InputContinuousLane | DefaultLane;
  return (lanes & SyncDefaultLanes) !== NoLane;
}

export function includesExpiredLane(root: FiberRoot, lanes: Lanes): boolean {
  return (lanes & root.expiredLanes) !== NoLane;
}

export function includesOnlyRetries(lanes: Lanes): boolean {
  return isSubsetOfLanes(lanes, RetryLanes);
}

export function includesOnlyNonUrgentLanes(lanes: Lanes): boolean {
  const UrgentLanes = SyncLane | InputContinuousLane | DefaultLane;
  return (lanes & UrgentLanes) === NoLane;
}

export function includesOnlyTransitions(lanes: Lanes): boolean {
  return (lanes & TransitionLanes) === lanes;
}

export function shouldTimeSlice(root: FiberRoot, lanes: Lanes): boolean {
  if ((lanes & root.expiredLanes) !== NoLane) {
    return false;
  }
  if (includesBlockingLane(root, lanes)) {
    return false;
  }
  if (includesExpiredLane(root, lanes)) {
    return false;
  }
  return true;
}

// 导出DefaultLane常量以保持兼容性
export { DefaultLane } from '../types/constants.js';