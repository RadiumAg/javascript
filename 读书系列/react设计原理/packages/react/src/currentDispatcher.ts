interface Dispatcher {
  userState: any;
}

const currentDispatcher: { current: Dispatcher | null } = {
  current: null,
};

export type { Dispatcher };
export default currentDispatcher;
