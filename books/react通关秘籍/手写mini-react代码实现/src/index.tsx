const App = () => {
  const [state, setState] = MiniReact.useState(2);
  console.log(state);

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
