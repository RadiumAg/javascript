type Lane = number;
type Lanes = number;
const SyncLane = 0b0001;
const NoLane = 0b0000;
const NoLanes = 0b0000;

function requestUpdateLanes() {
  return SyncLane;
}

function mergeLanes(laneA: Lane, laneB: Lane) {
  return laneA | laneB;
}

export type { Lane, Lanes };
export { SyncLane, NoLane, NoLanes, mergeLanes, requestUpdateLanes };
