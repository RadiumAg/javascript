type Flags = number;

const NoFlags = 0b0000000;
const Placement = 0b000001;
const Update = 0b000010;
const ChildDeletion = 0b000100;
const PassiveEffect = 0b001000;
const PassiveMak = PassiveEffect | ChildDeletion;
const MutationMask = Placement | Update | ChildDeletion;

export {
  NoFlags,
  Placement,
  Update,
  ChildDeletion,
  MutationMask,
  PassiveMak,
  PassiveEffect,
};
export type { Flags };
