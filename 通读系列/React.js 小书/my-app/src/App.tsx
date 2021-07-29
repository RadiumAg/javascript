import { useState } from "react";
import "./App.css";
import Clock from "./pages/挂载阶段的组件生命周期/index_one";

function App() {
  let [state, setState] = useState(1);
  return (
    <div className="App">
      <Clock />
    </div>
  );
}

export default App;
