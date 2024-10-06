import React from 'react';
import { useComponentConfigStore } from './stores/component-config';
import { useDrag } from 'react-dnd';

interface MaterialItemProps {
  name: string;
}

const MaterialItem: React.FC<MaterialItemProps> = (props) => {
  const { name } = props;
  const [_, drag] = useDrag({
    type: name,
    item: {
      type: name,
    },
  });

  return (
    <div
      ref={drag}
      className="
            border-dashed
            border-[1px]
            border-[#000]
            py-[8px] px-[10px]
            m-[10px]
            cursor-move
            inline-block
            bg-white
            hover:bg-[#ccc]
            "
    >
      {name}
    </div>
  );
};

const Materials: React.FC = () => {
  const { componentConfig } = useComponentConfigStore();

  const components = React.useMemo(() => {
    return Object.values(componentConfig);
  }, [componentConfig]);

  return (
    <div>
      {components.map((item, index) => {
        return (
          <MaterialItem name={item.name} key={item.name + index}></MaterialItem>
        );
      })}
    </div>
  );
};

export default Materials;
