import { Suspense } from 'react';
import './App.css';
import UseTFeatures from './features/use';
import Context from './conetxt';
import UseAction from './features/useAction/useAction';

function App() {
  return (
    <Context.Provider value={{ name: 2 }}>
      <div>
        <Suspense>
          <UseTFeatures />
        </Suspense>

        <UseAction />
      </div>
    </Context.Provider>
  );
}

export default App;
