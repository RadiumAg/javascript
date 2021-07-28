import { useState } from "react";
import "./App.css";
import {} from "";

function App() {
  let [state, setState] = useState(1);
  return (
    <div className="App">
      <LikeButton unlikedText={state.toString()} />
      <button
        onClick={() => {
          setState(++state);
        }}
      >
        点击
      </button>
    </div>
  );
}

export default App;
