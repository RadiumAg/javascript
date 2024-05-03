import { useActionState } from 'react';

const UseAction: React.FC = () => {
  const [state, setState] = useActionState<number, number>((state, playoud) => {
    return state + playoud;
  }, 1);

  return (
    <div
      onClick={() => {
        setState(2);
      }}
    >
      {state}
    </div>
  );
};

export default UseAction;
