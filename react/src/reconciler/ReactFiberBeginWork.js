import { createWorkInProgress, createFiberFromElement, createFiberFromText } from '../types/Fiber.js';
import { 
  FunctionComponent,
  HostComponent,
  HostText,
  HostRoot,
  Fragment,
  NoFlags,
  PerformedWork,
  Placement,
  Update,
  Deletion,
  ChildDeletion,
  NoLanes,
  OffscreenComponent,
} from '../types/constants.js';
import { processUpdateQueue } from '../types/UpdateQueue.js';
import { shouldSetTextContent, createTextInstance, createInstance } from '../react-dom/ReactDOMHostConfig.js';

// 当前正在渲染的lanes
let renderLanes = NoLanes;

/**
 * 开始工作 - Fiber的渲染阶段
 */
export function beginWork(current, workInProgress, renderLanes) {
  if (__DEV__) {
    if (workInProgress._debugNeedsRemount && current !== null) {
      // 需要重新挂载，清除alternate
      return remountFiber(current, workInProgress, createFiberFromTypeAndProps(
        workInProgress.type,
        workInProgress.key,
        workInProgress.pendingProps,
        workInProgress._debugOwner || null,
        workInProgress.mode,
        workInProgress.lanes
      ));
    }
  }

  const updateLanes = workInProgress.lanes;

  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasLegacyContextChanged() ||
      (__DEV__ && workInProgress.type !== current.type)
    ) {
      // 如果props或context改变了，标记为有工作
      didReceiveUpdate = true;
    } else {
      // 既没有props改变，也没有context改变
      const hasScheduledUpdateOrContext = checkScheduledUpdateOrContext(
        current,
        renderLanes
      );
      if (
        !hasScheduledUpdateOrContext &&
        (workInProgress.flags & DidCapture) === NoFlags
      ) {
        // 没有挂起的更新或context。可以重用状态
        didReceiveUpdate = false;
        return attemptToReuseFiber(current, workInProgress, renderLanes);
      }
      if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
        // 这是一个特殊情况，只在遗留模式中存在
        didReceiveUpdate = true;
      } else {
        didReceiveUpdate = false;
      }
    }
  } else {
    didReceiveUpdate = false;

    if (getIsHydrating() && isForkedChild(workInProgress)) {
      // 检查这个组件是否是一个分叉的子组件
      const slotIndex = workInProgress.index;
      const numberOfForks = getForksAtLevel(workInProgress);
      pushTreeId(workInProgress, numberOfForks, slotIndex);
    }
  }

  // 在进入开始阶段之前，清除lanes
  workInProgress.lanes = NoLanes;

  switch (workInProgress.tag) {
    case IndeterminateComponent: {
      return mountIndeterminateComponent(
        current,
        workInProgress,
        workInProgress.type,
        renderLanes
      );
    }
    case LazyComponent: {
      const elementType = workInProgress.elementType;
      return mountLazyComponent(
        current,
        workInProgress,
        elementType,
        renderLanes
      );
    }
    case FunctionComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      );
    }
    case ClassComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      );
    }
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes);
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes);
    case HostText:
      return updateHostText(current, workInProgress);
    case SuspenseComponent:
      return updateSuspenseComponent(current, workInProgress, renderLanes);
    case HostPortal:
      return updatePortalComponent(current, workInProgress, renderLanes);
    case ForwardRef: {
      const type = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === type
          ? unresolvedProps
          : resolveDefaultProps(type, unresolvedProps);
      return updateForwardRef(
        current,
        workInProgress,
        type,
        resolvedProps,
        renderLanes
      );
    }
    case Fragment:
      return updateFragment(current, workInProgress, renderLanes);
    case Mode:
      return updateMode(current, workInProgress, renderLanes);
    case Profiler:
      return updateProfiler(current, workInProgress, renderLanes);
    case ContextProvider:
      return updateContextProvider(current, workInProgress, renderLanes);
    case ContextConsumer:
      return updateContextConsumer(current, workInProgress, renderLanes);
    case MemoComponent: {
      const type = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      let resolvedProps = resolveDefaultProps(type, unresolvedProps);
      if (__DEV__) {
        if (workInProgress.type !== workInProgress.elementType) {
          const outerPropTypes = type.propTypes;
          if (outerPropTypes) {
            checkPropTypes(
              outerPropTypes,
              resolvedProps,
              'prop',
              getComponentNameFromType(type)
            );
          }
        }
      }
      resolvedProps = resolveDefaultProps(type.type, resolvedProps);
      return updateMemoComponent(
        current,
        workInProgress,
        type,
        resolvedProps,
        renderLanes
      );
    }
    case SimpleMemoComponent: {
      return updateSimpleMemoComponent(
        current,
        workInProgress,
        workInProgress.type,
        workInProgress.pendingProps,
        renderLanes
      );
    }
    case IncompleteClassComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return mountIncompleteClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      );
    }
    case SuspenseListComponent: {
      return updateSuspenseListComponent(current, workInProgress, renderLanes);
    }
    case ScopeComponent: {
      if (enableScopeAPI) {
        return updateScopeComponent(current, workInProgress, renderLanes);
      }
      break;
    }
    case OffscreenComponent: {
      return updateOffscreenComponent(current, workInProgress, renderLanes);
    }
    case LegacyHiddenComponent: {
      if (enableLegacyHidden) {
        return updateLegacyHiddenComponent(
          current,
          workInProgress,
          renderLanes
        );
      }
      break;
    }
    case CacheComponent: {
      if (enableCache) {
        return updateCacheComponent(current, workInProgress, renderLanes);
      }
      break;
    }
    case TracingMarkerComponent: {
      if (enableTransitionTracing) {
        return updateTracingMarkerComponent(
          current,
          workInProgress,
          renderLanes
        );
      }
      break;
    }
  }

  throw new Error(
    `Unknown unit of work tag (${workInProgress.tag}). This error is likely caused by a bug in ` +
      'React. Please file an issue.'
  );
}

/**
 * 更新函数组件
 */
function updateFunctionComponent(
  current,
  workInProgress,
  Component,
  nextProps,
  renderLanes
) {
  if (__DEV__) {
    if (workInProgress.type !== workInProgress.elementType) {
      // Lazy component props can't be validated in createElement
      // because they're only guaranteed to be resolved here.
      const innerPropTypes = Component.propTypes;
      if (innerPropTypes) {
        checkPropTypes(
          innerPropTypes,
          nextProps,
          'prop',
          getComponentNameFromType(Component)
        );
      }
    }
  }

  let context;
  if (!disableLegacyContext) {
    const unmaskedContext = getUnmaskedContext(workInProgress, Component, true);
    context = getMaskedContext(workInProgress, unmaskedContext);
  }

  let nextChildren;
  let hasId;
  prepareToReadContext(workInProgress, renderLanes);
  if (enableSchedulingProfiler) {
    markComponentRenderStarted(workInProgress);
  }
  if (__DEV__) {
    ReactCurrentOwner.current = workInProgress;
    setIsRendering(true);
    nextChildren = renderWithHooks(
      current,
      workInProgress,
      Component,
      nextProps,
      context,
      renderLanes
    );
    hasId = checkDidRenderIdHook();
    if (
      debugRenderPhaseSideEffectsForStrictMode &&
      workInProgress.mode & StrictLegacyMode
    ) {
      setIsStrictModeForDevtools(true);
      try {
        nextChildren = renderWithHooks(
          current,
          workInProgress,
          Component,
          nextProps,
          context,
          renderLanes
        );
        hasId = checkDidRenderIdHook();
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }
    setIsRendering(false);
  } else {
    nextChildren = renderWithHooks(
      current,
      workInProgress,
      Component,
      nextProps,
      context,
      renderLanes
    );
    hasId = checkDidRenderIdHook();
  }

  if (enableSchedulingProfiler) {
    markComponentRenderStopped();
  }

  if (current !== null && !didReceiveUpdate) {
    bailoutHooks(current, workInProgress, renderLanes);
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  if (getIsHydrating() && hasId) {
    pushMaterializedTreeId(workInProgress);
  }

  // React DevTools reads this flag
  workInProgress.flags |= PerformedWork;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

/**
 * 更新Host组件 (DOM元素)
 */
function updateHostComponent(current, workInProgress, renderLanes) {
  pushHostContext(workInProgress);

  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress);
  }

  const type = workInProgress.type;
  const nextProps = workInProgress.pendingProps;
  const prevProps = current !== null ? current.memoizedProps : null;

  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);

  if (isDirectTextChild) {
    // 我们特殊情况直接文本子项的常见情况
    // 所以我们不需要为它们创建额外的HostText fiber
    nextChildren = null;
  } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
    // 如果我们要从直接文本子项切换到普通子项，
    // 或者从普通子项到直接文本子项，我们需要安排
    // 清除此内容的文本内容。
    workInProgress.flags |= ContentReset;
  }

  markRef(current, workInProgress);
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

/**
 * 更新Host文本节点
 */
function updateHostText(current, workInProgress) {
  if (current === null) {
    tryToClaimNextHydratableInstance(workInProgress);
  }
  // 文本节点没有子项
  return null;
}

/**
 * 更新Host根节点
 */
function updateHostRoot(current, workInProgress, renderLanes) {
  pushHostRootContext(workInProgress);

  if (current === null) {
    throw new Error('Should have a current fiber. This is a bug in React.');
  }

  const nextProps = workInProgress.pendingProps;
  const prevState = workInProgress.memoizedState;
  const prevChildren = prevState.element;
  cloneUpdateQueue(current, workInProgress);
  processUpdateQueue(workInProgress, nextProps, null, renderLanes);

  const nextState = workInProgress.memoizedState;
  const root = workInProgress.stateNode;
  pushRootTransition(workInProgress, root, renderLanes);

  if (enableTransitionTracing) {
    pushRootMarkerInstance(workInProgress);
  }

  // 注意，element可能是null。这可能发生如果根节点
  // 没有渲染任何东西。这让我们可以避免分配
  // 根fiber树，直到用户调用render至少一次
  const nextChildren = nextState.element;
  if (nextChildren === prevChildren) {
    resetHydrationState();
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }

  if (root.isDehydrated && enterHydrationState(workInProgress)) {
    // 如果我们目前在一个脱水的边界内，并且我们还没有开始
    // hydrating，然后开始hydrating
    const child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
    workInProgress.child = child;

    let node = child;
    while (node) {
      // 标记每个子项为水合
      node.flags = (node.flags & ~Placement) | Hydrating;
      node = node.sibling;
    }
  } else {
    // 否则重置hydration状态，以防我们之前尝试hydrate
    resetHydrationState();
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  }
  return workInProgress.child;
}

/**
 * 调和子项
 */
function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
  if (current === null) {
    // 如果这是一个新创建的组件，我们需要创建一个新的子集合
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
  } else {
    // 如果当前子项和新子项相同，我们不需要做任何事情
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    );
  }
}

/**
 * 尝试重用fiber
 */
function attemptToReuseFiber(current, workInProgress, renderLanes) {
  // 这个函数用来复用现有的fiber当props没有改变
  cloneChildFibers(current, workInProgress);
  return workInProgress.child;
}

/**
 * 更新Fragment
 */
function updateFragment(current, workInProgress, renderLanes) {
  const nextChildren = workInProgress.pendingProps;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

// 全局状态
let didReceiveUpdate = false;

// 简化的辅助函数
function hasLegacyContextChanged() { return false; }
function checkScheduledUpdateOrContext(current, renderLanes) { return false; }
function getIsHydrating() { return false; }
function isForkedChild(workInProgress) { return false; }
function getForksAtLevel(workInProgress) { return 0; }
function pushTreeId(workInProgress, numberOfForks, slotIndex) {}
function resolveDefaultProps(Component, props) { return props; }
function prepareToReadContext(workInProgress, renderLanes) {}
function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
  // 简化的hooks渲染
  const children = Component(props);
  return children;
}
function checkDidRenderIdHook() { return false; }
function bailoutHooks(current, workInProgress, renderLanes) {}
function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) { return null; }
function pushMaterializedTreeId(workInProgress) {}
function markRef(current, workInProgress) {}
function pushHostContext(workInProgress) {}
function pushHostRootContext(workInProgress) {}
function tryToClaimNextHydratableInstance(workInProgress) {}
function cloneUpdateQueue(current, workInProgress) {}
function pushRootTransition(workInProgress, root, renderLanes) {}
function pushRootMarkerInstance(workInProgress) {}
function resetHydrationState() {}
function enterHydrationState(workInProgress) { return false; }
function mountChildFibers(workInProgress, currentFirstChild, newChild, lanes) { return null; }
function reconcileChildFibers(workInProgress, currentFirstChild, newChild, lanes) { return null; }
function cloneChildFibers(current, workInProgress) {}

// 各种组件类型的更新函数简化实现
function mountIndeterminateComponent() { return null; }
function mountLazyComponent() { return null; }
function updateClassComponent() { return null; }
function updateSuspenseComponent() { return null; }
function updatePortalComponent() { return null; }
function updateForwardRef() { return null; }
function updateMode() { return null; }
function updateProfiler() { return null; }
function updateContextProvider() { return null; }
function updateContextConsumer() { return null; }
function updateMemoComponent() { return null; }
function updateSimpleMemoComponent() { return null; }
function mountIncompleteClassComponent() { return null; }
function updateSuspenseListComponent() { return null; }
function updateScopeComponent() { return null; }
function updateOffscreenComponent() { return null; }
function updateLegacyHiddenComponent() { return null; }
function updateCacheComponent() { return null; }
function updateTracingMarkerComponent() { return null; }

// 开发相关
function remountFiber() { return null; }
function createFiberFromTypeAndProps() { return null; }
function getUnmaskedContext() { return {}; }
function getMaskedContext() { return {}; }
function markComponentRenderStarted() {}
function markComponentRenderStopped() {}
function setIsRendering() {}
function setIsStrictModeForDevtools() {}
function checkPropTypes() {}
function getComponentNameFromType() { return 'Unknown'; }

// 常量定义
const __DEV__ = process.env.NODE_ENV !== 'production';
const disableLegacyContext = false;
const enableSchedulingProfiler = false;
const debugRenderPhaseSideEffectsForStrictMode = false;
const enableScopeAPI = false;
const enableLegacyHidden = false;
const enableCache = false;
const enableTransitionTracing = false;
const StrictLegacyMode = 0b10000;
const ReactCurrentOwner = { current: null };

// 导入的常量
const {
  IndeterminateComponent,
  LazyComponent,
  ClassComponent,
  SuspenseComponent,
  HostPortal,
  ForwardRef,
  Mode,
  Profiler,
  ContextProvider,
  ContextConsumer,
  MemoComponent,
  SimpleMemoComponent,
  IncompleteClassComponent,
  SuspenseListComponent,
  ScopeComponent,
  LegacyHiddenComponent,
  CacheComponent,
  TracingMarkerComponent,
  ContentReset,
  DidCapture,
  ForceUpdateForLegacySuspense,
  Hydrating,
  ChildDeletion,
} = {
  IndeterminateComponent: 2,
  LazyComponent: 16,
  ClassComponent: 1,
  SuspenseComponent: 13,
  HostPortal: 4,
  ForwardRef: 11,
  Mode: 8,
  Profiler: 12,
  ContextProvider: 10,
  ContextConsumer: 9,
  MemoComponent: 14,
  SimpleMemoComponent: 15,
  IncompleteClassComponent: 17,
  SuspenseListComponent: 19,
  ScopeComponent: 21,
  LegacyHiddenComponent: 24,
  CacheComponent: 25,
  TracingMarkerComponent: 26,
  ContentReset: 0b00000000000000000000010000,
  DidCapture: 0b00000000000000001000000000,
  ForceUpdateForLegacySuspense: 0b00000000000000010000000000,
  Hydrating: 0b00000000000001000000000000,
  ChildDeletion: 0b00000000000000000000001000,
};