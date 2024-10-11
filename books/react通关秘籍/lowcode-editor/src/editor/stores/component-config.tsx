import { create } from 'zustand';
import Container from '../materials/container';
import Button from '../materials/button';
import Page from '../materials/page';

export interface ComponentConfig {
  props?: any;
  name: string;
  desc?: string;
  component: React.FC<any>;
  defaultProps: Record<string, any>;
}

interface State {
  componentConfig: Record<string, ComponentConfig>;
}

interface Action {
  registerComponent: (name: string, config: ComponentConfig) => void;
}

export const useComponentConfigStore = create<State & Action>((set) => ({
  componentConfig: {
    Container: {
      name: 'Container',
      defaultProps: {},
      desc: '容器',
      component: Container,
    },
    Button: {
      name: 'Button',
      defaultProps: {
        type: 'primary',
        text: '按钮',
      },
      desc: '按钮',
      component: Button,
    },
    Page: {
      name: 'Page',
      defaultProps: {},
      desc: '页面',
      component: Page,
    },
  },

  registerComponent: (name, componentConfig) =>
    set((state) => {
      return {
        ...state,
        componentConfig: {
          ...state.componentConfig,
          [name]: componentConfig,
        },
      };
    }),
}));
