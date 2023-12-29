type Flags = number;

const NoFlags = 0b0000000;
const Placement = 0b000001;
const Update = 0b000010;
const ChildDeletion = 0b000100;
const PassiveEffect = 0b001000;
const Ref = 0b010000;
const PassiveMask = PassiveEffect | ChildDeletion;
const MutationMask = Placement | Update | ChildDeletion | Ref;
const LayoutMask = Ref;

export {
  Ref,
  NoFlags,
  Update,
  Placement,
  LayoutMask,
  PassiveMask,
  MutationMask,
  PassiveEffect,
  ChildDeletion,
};
export type { Flags };
