import {
  CallbackNode,
  unstable_IdlePriority as IdlePriority,
  unstable_ImmediatePriority as ImmediatePriority,
  unstable_LowPriority as LowPriority,
  unstable_NormalPriority as NormalPriority,
  unstable_UserBlockingPriority as UserBlockingPriority,
  unstable_cancelCallback as cancelCallback,
  unstable_getFirstCallbackNode as getFirstCallbackNode,
  unstable_scheduleCallback as scheduleCallback,
  unstable_shouldYield as shouldYield,
} from 'scheduler';

type Priority =
  | typeof IdlePriority
  | typeof ImmediatePriority
  | typeof LowPriority
  | typeof NormalPriority
  | typeof UserBlockingPriority;

interface Work {
  priority: Priority;
  count: number;
}

const priority2UseList: Priority[] = [
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
];
