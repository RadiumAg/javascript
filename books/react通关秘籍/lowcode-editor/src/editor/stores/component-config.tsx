import { create } from 'zustand';
import ContainerDev from '../materials/container/dev';
import ContainerProd from '../materials/container/prod';
import ButtonDev from '../materials/button/dev';
import ButtonProd from '../materials/button/prod';
import PageProd from '../materials/page/prod';
import PageDev from '../materials/page/dev';

export interface ComponentSetter {
  name: string;
  label: string;
  type: string;
  [key: string]: any;
}

export interface ComponentConfig {
  props?: any;
  name: string;
  desc?: string;
  setter?: ComponentSetter[];
  styleSetter?: ComponentSetter[];
  defaultProps: Record<string, any>;
  dev: any;
  prod: any;
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
      dev: ContainerDev,
      prod: ContainerProd,
      styleSetter: [
        {
          name: 'width',
          label: '宽度',
          type: 'inputNumber',
        },
        {
          name: 'height',
          label: '高度',
          type: 'inputNumber',
        },
      ],
    },
    Button: {
      name: 'Button',
      setter: [
        {
          name: 'type',
          label: '按钮类型',
          type: 'select',
          options: [
            {
              label: '主按钮',
              value: 'primary',
            },
            {
              label: '次按钮按',
              value: 'default',
            },
          ],
        },
        {
          name: 'text',
          label: '文本',
          type: 'input',
        },
      ],
      defaultProps: {
        type: 'primary',
        text: '按钮',
      },
      desc: '按钮',
      dev: ButtonDev,
      prod: ButtonProd,
      styleSetter: [
        {
          name: 'width',
          label: '宽度',
          type: 'inputNumber',
        },
        {
          name: 'height',
          label: '高度',
          type: 'inputNumber',
        },
      ],
    },
    Page: {
      name: 'Page',
      defaultProps: {},
      desc: '页面',
      prod: PageProd,
      dev: PageDev,
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
