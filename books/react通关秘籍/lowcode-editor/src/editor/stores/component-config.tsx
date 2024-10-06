import { create } from 'zustand';
import Container from '../materials/container';
import Button from '../materials/button';
import Page from '../materials/page';

export interface ComponentConfig {
  name: string;
  desc?: string;
  props?: any;
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
      component: Container,
    },
    Button: {
      name: 'Button',
      defaultProps: {
        type: 'primary',
        text: '按钮',
      },
      component: Button,
    },
    Page: {
      name: 'Page',
      defaultProps: {},
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
