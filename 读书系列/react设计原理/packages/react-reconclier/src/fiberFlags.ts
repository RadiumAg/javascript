type Flags = number;

const NoFlags = 0b0000001;
const Placement = 0b000010;
const Update = 0b000100;
const ChildDeletion = 0b001000;
const MutationMask = Placement | Update | ChildDeletion;

export { NoFlags, Placement, Update, ChildDeletion, MutationMask };
export type { Flags };
