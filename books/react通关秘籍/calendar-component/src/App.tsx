import React from 'react';
import Calendar from './components/calendar';

function App() {
  return (
    <div className="App">
      <Calendar
        onChange={(date) => {
          console.log(date.format('YYYY-MM-DD'));
        }}
      />
    </div>
  );
}

export default App;
