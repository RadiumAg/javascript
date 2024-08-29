import { FiberRootNode } from './fiber';

export type Lane = number;
export type Lanes = number;

export const SyncLane = 0b0001;
export const NoLane = 0b0000;
export const NoLanes = 0b0000;

export function mergeLanes(laneA: Lane, LaneB: Lane): Lanes {
  return laneA | LaneB;
}

export function requestUpdateLanes() {
  return SyncLane;
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
