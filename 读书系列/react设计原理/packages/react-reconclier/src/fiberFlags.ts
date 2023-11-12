type Flags = number;

const NoFlags = 0b0000001;
const Flag = 0b0000010;
const Placement = 0b000010;
const Update = 0b000100;
const ChildDeletion = 0b001000;

export { NoFlags, Flag, Placement, Update, ChildDeletion };
export type { Flags };
