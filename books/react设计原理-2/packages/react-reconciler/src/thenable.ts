import { Thenable } from '../../shared/ReactTypes';

// render 阶段用 use 读取一个 pending 的 thenable 时，抛出这个哨兵值来“挂起”。
// 用哨兵而非直接抛 thenable，是为了和真正的错误区分开。
export const SuspenseException = new Error(
  '这不是真正的错误，而是 Suspense 工作机制的一部分。如果你捕获到它，请继续抛出',
);

let suspendedThenable: Thenable<any> | null = null;

/**
 * 在 workLoop 捕获 SuspenseException 后，取回真正挂起的 thenable
 */
export function getSuspenseThenable(): Thenable<any> {
  if (suspendedThenable === null) {
    throw new Error('suspendedThenable 应该存在，这是一个 bug');
  }
  const thenable = suspendedThenable;
  suspendedThenable = null;
  return thenable;
}

function noop() {}

/**
 * 追踪一个 thenable 的状态：
 * - fulfilled：直接返回值
 * - rejected：抛出错误
 * - pending/未追踪：开始追踪状态，并抛出 SuspenseException 挂起
 */
export function trackUsedThenable<T>(thenable: Thenable<T>): T {
  switch (thenable.status) {
    case 'fulfilled':
      return thenable.value as T;
    case 'rejected':
      throw thenable.reason;
    default:
      if (typeof thenable.status === 'string') {
        // 已经在追踪中（pending），不重复绑定状态回调
        thenable.then(noop, noop);
      } else {
        // 未追踪 → 开始追踪，绑定回调在 resolve/reject 时写入状态
        thenable.status = 'pending';
        thenable.then(
          (val) => {
            if (thenable.status === 'pending') {
              thenable.status = 'fulfilled';
              thenable.value = val;
            }
          },
          (err) => {
            if (thenable.status === 'pending') {
              thenable.status = 'rejected';
              thenable.reason = err;
            }
          },
        );
      }
  }

  suspendedThenable = thenable;
  throw SuspenseException;
}
