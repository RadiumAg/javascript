const App = () => {
    const [state, setState] = MiniReact.useState(2);
    const [visible, setVisible] = MiniReact.useState(true);
    MiniReact.useEffect(() => {
        console.log('parent effect');
        return () => {
            console.log('parent delected');
        };
    }, []);
    return (MiniReact.createElement("div", { onClick: () => {
            setVisible(!visible);
            setState(state + 1);
        } },
        state,
        visible && MiniReact.createElement(Children, null)));
};
const Children = () => {
    const [state, setState] = MiniReact.useState(2);
    MiniReact.useEffect(() => {
        console.log('children effect');
        return () => {
            console.log('children delected');
        };
    }, []);
    return MiniReact.createElement("div", null, state);
};
MiniReact.render(MiniReact.createElement(App, null), document.querySelector('#root'));
