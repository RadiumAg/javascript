import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  const [aaa, setAaa] = React.useState();
  const [bbb, setBbb] = React.useState();

  async function login() {
    const res = await axios.post('http://localhost:3000/user/login', {
      username: 'guang1',
      password: '123456',
    });

    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
  }

  async function query() {
    const { data: aaaData } = await axios.get('http://localhost:3000/aaa');
    const { data: bbbData } = await axios.get('http://localhost:3000/bbb', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    setAaa(aaaData);
    setBbb(bbbData);
  }

  React.useEffect(() => {
    query();
  }, []);

  return (
    <div className="App">
      <p>{aaa}</p>
      <p>{bbb}</p>
    </div>
  );
}

export default App;
