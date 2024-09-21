const App = () => {
    const [state, setState] = MiniReact.useState(2);
    console.log(state);
    return (MiniReact.createElement("div", { onClick: () => {
            setState(state + 1);
        } }, state));
};
MiniReact.render(MiniReact.createElement(App, null), document.querySelector('#root'));
