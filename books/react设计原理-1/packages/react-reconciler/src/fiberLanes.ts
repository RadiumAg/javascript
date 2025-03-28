import {
  unstable_IdlePriority,
  unstable_ImmediatePriority,
  unstable_NormalPriority,
  unstable_UserBlockingPriority,
  unstable_getCurrentPriorityLevel,
} from 'scheduler';
import ReactCurrentBatchConfig from '../../react/src/currentBatchConfig';
import { FiberRootNode } from './fiber';

export type Lane = number;
export type Lanes = number;

export const SyncLane = 0b00001;
export const NoLane = 0b00000;
export const NoLanes = 0b00000;
export const InputContinuousLane = 0b00010;
export const DefaultLane = 0b00100;
export const TransitionLane = 0b01000;
export const IdleLane = 0b10000;

export function mergeLanes(laneA: Lane, LaneB: Lane): Lanes {
  return laneA | LaneB;
}

/**
 * 返回当前优先级最高的lane
 *
 * @export
 * @return {*}
 */
export function requestUpdateLanes() {
  // 如果是transition，那么返回TransitionLane
  const isTransition = ReactCurrentBatchConfig.transition !== null;
  if (isTransition) {
    return TransitionLane;
  }

  // 从上下文环境中获取scheduler优先级
  const currentSchedulePriority = unstable_getCurrentPriorityLevel();
  const lane = schedulePriorityToLane(currentSchedulePriority);
  return lane;
}

/**
 * 获取当前最高级别的Lane
 *
 * @export
 * @param {Lanes} lanes
 * @return {*}  {Lane}
 */
export function getHighestPriorityLane(lanes: Lanes): Lane {
  return lanes & -lanes;
}

export function markRootFinished(root: FiberRootNode, lane: Lane) {
  root.pendingLanes &= ~lane;
}

/**
 * 转成schedule的优先级
 *
 * @param {Lanes} lanes
 * @return {*}
 */
export function lanesToSchedulePriority(lanes: Lanes) {
  const lane = getHighestPriorityLane(lanes);

  if (lane === SyncLane) {
    return unstable_ImmediatePriority;
  }

  if (lane === InputContinuousLane) {
    return unstable_UserBlockingPriority;
  }

  if (lane === DefaultLane) {
    return unstable_NormalPriority;
  }

  return unstable_IdlePriority;
}

/**
 * 转成lanes的优先级
 *
 * @param {number} schedulePriority
 * @return {*}
 */
function schedulePriorityToLane(schedulePriority: number) {
  if (schedulePriority === unstable_ImmediatePriority) {
    return SyncLane;
  }

  if (schedulePriority === unstable_UserBlockingPriority) {
    return InputContinuousLane;
  }

  if (schedulePriority === unstable_NormalPriority) {
    return DefaultLane;
  }

  return NoLane;
}

export function isSubsetOfLanes(set: Lanes, subset: Lane) {
  return (set & subset) === subset;
}
