import { Suspense } from 'react';
import './App.css';
import { atom, useAtom } from 'jotai';

const userAtom = atom(async (get) => {
  const userId = 1;
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}?_delay=2000`);

  return response.json();
}) 

const UserName = ()=> {
  const [user] = useAtom(userAtom);
  return <div>User name: {user.name}</div>
}

function App() {
  console.log(UserName());

  return (
      <UserName />
   
  );
}

export default App;
