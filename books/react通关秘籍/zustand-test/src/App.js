import './App.css';
import { create } from 'domain';

function logMiddleware(func){
  return function(set,get,source){
     function newSet(...args){
       console.log('set',args)
       set(...args)
     }
     func(newSet,get,source)
     }
}

const useXxxStore = create(logMiddleware((set) => ({
  aaa: '',
  bbb: '',
  updateAaa: (value) => set(() => ({ aaa: value })),
  updateBbb: (value) => set(() => ({ bbb: value })),
})));

function App() {
  const updateAaa = useXxxStore((state) => state.updateAaa);
  const aaa = useXxxStore((state) => state.aaa);

  return (
    <div>
      <input value={aaa} onChange={(e) => updateAaa(e.currentTarget.value)} />
      <Bbb></Bbb>
    </div>
  );
}

function Bbb() {
  return <div>
    <Ccc></Ccc>
  </div>
}

function Ccc() {
  const aaa = useXxxStore((state) => state.aaa)
  return <p>hello, {aaa}</p>
}

export default App;
