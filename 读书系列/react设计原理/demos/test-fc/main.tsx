import ReactDOM from 'react-dom';

const App = () => {
  return <Child />;
};

const Child = () => {
  return <div>11111</div>;
};

ReactDOM.createRoot(document.querySelector('#root')).render(<App />);
