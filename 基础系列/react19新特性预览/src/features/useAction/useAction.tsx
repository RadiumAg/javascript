import { useActionState } from 'react';

const UseAction: React.FC = () => {
  const [state, formAction] = useActionState((state, formData) => {
    return formData.get('id');
  }, null);

  return (
    <form action={formAction}>
      {state}
      <input name="id"></input>
      <button type="submit">提交</button>
    </form>
  );
};

export default UseAction;
