import {
  unstable_IdlePriority,
  unstable_ImmediatePriority,
  unstable_NormalPriority,
  unstable_UserBlockingPriority,
  unstable_getCurrentPriorityLevel,
} from 'scheduler';
import ReactCurrentBatchConfig from 'react/src/currentBatchConfig';
import { FiberRootNode } from './fiber';

type Lane = number;
type Lanes = number;
const SyncLane = 0b00001;
const NoLane = 0b00000;
const NoLanes = 0b00000;
const InputContinuonusLane = 0b00010;
const DefaultLane = 0b00100;
const TransitionLane = 0b01000;
const IdleLane = 0b10000;

function requestUpdateLanes() {
  const isTransition = ReactCurrentBatchConfig.transition !== null;
  if (isTransition) {
    return TransitionLane;
  }

  const currentSchedulerPriority = unstable_getCurrentPriorityLevel();
  const lane = schedulerPriorityToLane(currentSchedulerPriority);

  return lane;
}

function isSubseOfLanes(set: Lanes, subset: Lane) {
  return (set & subset) === subset;
}

function lanesToSchedulePriority(lanes: Lanes) {
  const lane = getHighestPriorityLane(lanes);

  if (lane === SyncLane) {
    return unstable_ImmediatePriority;
  }

  if (lane === InputContinuonusLane) {
    return unstable_UserBlockingPriority;
  }
  if (lane === DefaultLane) {
    return unstable_NormalPriority;
  }

  return unstable_IdlePriority;
}

function schedulerPriorityToLane(schedulePriority: number) {
  if (schedulePriority === unstable_ImmediatePriority) {
    return SyncLane;
  }

  if (schedulePriority === unstable_UserBlockingPriority) {
    return InputContinuonusLane;
  }

  if (schedulePriority === unstable_NormalPriority) {
    return DefaultLane;
  }

  return NoLane;
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
  IdleLane,
  NoLanes,
  mergeLanes,
  DefaultLane,
  isSubseOfLanes,
  markRootFinished,
  TransitionLane,
  requestUpdateLanes,
  InputContinuonusLane,
  getHighestPriorityLane,
  lanesToSchedulePriority,
};
