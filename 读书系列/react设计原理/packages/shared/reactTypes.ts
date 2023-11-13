type Type = any;
type Key = any;
type Ref = any;
type Props = any;
type ElementType = any;

interface ReactElement {
  $$typeof: symbol | number;
  type: Type;
  key: Key;
  props: Props;
  ref: Ref;
  __mark: string;
}

type Action<State> = State | ((prevState: State) => State);

export type { Type, Key, Ref, Props, ReactElement, ElementType, Action };
