import React from 'react';
import './App.css';
import axios from 'axios';

async function refreshToken() {
  const res = await axios.get('http://localhost:3000/user/refresh', {
    params: {
      refresh_token: localStorage.getItem('refresh_token'),
    },
  });
  localStorage.setItem('access_token', res.data.access_token || '');
  localStorage.setItem('refresh_token', res.data.refresh_token || '');
  return res;
}

axios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let { data, config } = error.response;

    if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
      const res = await refreshToken();

      if (res.status === 200) {
        return axios(config);
      } else {
        alert('登录过期，请重新登录');
        return Promise.reject(res.data);
      }
    } else {
      return error.response;
    }
  },
);

function App() {
  const [aaa, setAaa] = React.useState();
  const [bbb, setBbb] = React.useState();

  async function login() {
    const res = await axios.post('http://localhost:3000/user/login', {
      username: 'guang',
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
