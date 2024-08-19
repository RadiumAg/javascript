export type Lane = number;
export type Lanes = number;

export const SyncLane = 0b0001;
export const NoLane = 0b0000;

export function mergeLanes(laneA: Lane, LaneB: Lane): Lanes {
  return laneA | LaneB;
}

export function requestUpdateLanes() {
  return SyncLane;
}
