type Container = Element;
type Instance = Element;

const createInstance = (type: string, props: any) => {
  // TODO 处理props
  const element = document.createElement(type);
  return element;
};

const appendInitialChild = (parent: Instance | Container, child: Instance) => {
  parent.append(child);
};

const createTextInstance = (content: string) => {
  return document.createTextNode(content);
};

const appendChildToContainer = appendInitialChild;

export {
  createInstance,
  appendInitialChild,
  createTextInstance,
  appendChildToContainer,
};
export type { Container, Instance };
