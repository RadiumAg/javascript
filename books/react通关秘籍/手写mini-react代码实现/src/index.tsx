const App = () => {
  const [state, setState] = MiniReact.useState(2);
  const [visible, setVisible] = MiniReact.useState(true);

  MiniReact.useEffect(() => {
    console.log('parent effect');

    return () => {
      console.log('parent delected');
    };
  }, []);

  console.log('parent update');

  return (
    <div
      onClick={() => {
        // setVisible(!visible);
        // setState(state + 1);
      }}
    >
      {state}
      {visible && <Children />}
    </div>
  );
};

const Children = () => {
  const [state, setState] = MiniReact.useState(2);

  MiniReact.useEffect(() => {
    console.log('children effect');

    return () => {
      console.log('children delected');
    };
  }, []);

  console.log('children update');

  return (
    <div
      onClick={() => {
        setState(state + 1);
      }}
    >
      {state}
    </div>
  );
};

MiniReact.render(<App></App>, document.querySelector('#root'));
