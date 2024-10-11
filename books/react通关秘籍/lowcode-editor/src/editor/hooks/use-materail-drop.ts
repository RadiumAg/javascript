import { useDrop } from 'react-dnd';
import { useComponentConfigStore } from '../stores/component-config';
import { useComponentsStore } from '../stores/components';

const useMaterailDrop = (accept: string[], id: number) => {
  const { addComponent } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: ['Button', 'Container'],
    drop: (item: { type: string }, monitor) => {
      const didDrop = monitor.didDrop();
      const config = componentConfig[item.type];

      if (didDrop) return;

      addComponent(
        {
          id: new Date().getTime(),
          name: item.type,
          desc: config.desc,
          props: config.defaultProps,
        },
        id
      );
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  return { canDrop, drop };
};

export default useMaterailDrop;
