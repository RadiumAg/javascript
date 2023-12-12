import {
  unstable_ImmediatePriority,
  unstable_getCurrentPriorityLevel,
} from 'scheduler';
import { FiberRootNode } from './fiber';

type Lane = number;
type Lanes = number;
const SyncLane = 0b0001;
const NoLane = 0b0000;
const NoLanes = 0b0000;

function requestUpdateLanes() {
  const currentSchedulerPriority = unstable_getCurrentPriorityLevel();

  return SyncLane;
}

function lanesToSchedulePriority(lanes: Lanes) {
  const lane = getHighestPriorityLane(lanes);

  if (lane === SyncLane) {
    return unstable_ImmediatePriority;
  }
}

function mergeLanes(laneA: Lane, laneB: Lane) {
  return laneA | laneB;
}

function getHighestPriorityLane(lanes: Lanes): Lane {
  return lanes & -lanes;
}

function markRootFinished(root: FiberRootNode, lane: Lane) {
  root.pendingLanes &= ~lane;
}

export type { Lane, Lanes };
export {
  SyncLane,
  NoLane,
  NoLanes,
  mergeLanes,
  markRootFinished,
  requestUpdateLanes,
  getHighestPriorityLane,
};
