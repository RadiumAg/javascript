import { create } from 'zustand';

export interface Component {
  id: number;
  name: string;
  props: any;
  desc: string;
  children?: Component[];
  parentId?: number;
}

interface State {
  components: Component[];
}

interface Action {
  addComponent: () => void;
  deleteComponent: (id: number) => void;
  updateComponentProps: (componentId: number, props: any) => void;
}

export const useComponentsStore = create<State & Action>((set, get) => ({
  components: [
    {
      id: 1,
      name: 'Page',
      props: {},
      desc: '页面',
    },
  ],
  addComponent: (component, parentId) =>
    set((state) => {
      if (parentId) {
        const parentComponent = getComponentById(parentId, state.components);

        if (parentComponent) {
          if (parentComponent.children) {
            parentComponent.children.push(component);
          } else {
            parentComponent.children = [component];
          }
        }

        component.parentId = parentId;
        return { components: [...state.components] };
      }

      return { components: [...state.components, component] };
    }),
  deleteComponent: (componentId) => {
    if (!componentId) return;

    const componet = getComponentById(componentId, get().components);
    if (componet?.parentId) {
      const parentComponent = getComponentById(
        componet.parentId,
        get().components
      );

      if (parentComponent) {
        parentComponent.children = parentComponent?.children?.filter(
          (item) => item.id !== +componentId
        );

        set({ components: [...get().components] });
      }
    }
  },
}));

function getComponentById(
  id: number,
  components: Component[]
): Component | null {
  if (!id) return null;

  for (const component of components) {
    if (component.id === id) return component;

    if (component.children && component.children.length > 0) {
      const result = getComponentById(id, component.children);
      if (result) return result;
    }
  }
}
