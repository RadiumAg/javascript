import { useState } from 'react';
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
  useLocation,
} from 'react-router-dom';

const Layout = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <div>当前路由：{pathname}</div>
      <Outlet />
    </div>
  );
};

function Aaa() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <p>
        <button onClick={() => setCount(count + 1)}>加一</button>
      </p>
      <Link to="/bbb">去 Bbb 页面</Link>
      <br />
      <Link to="/ccc">去 Ccc 页面</Link>
    </div>
  );
}

const Bbb = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <p>
        <button onClick={() => setCount((count) => count + 1)}>加1</button>
      </p>
      <Link to="/">去首页</Link>
    </div>
  );
};

const Ccc = () => {
  return (
    <div>
      <p>ccc</p>
      <Link to="/">去首页</Link>
    </div>
  );
};

const routes = [
  {
    path: '/',
    element: <Layout></Layout>,
    children: [
      {
        path: '/',
        element: <Aaa></Aaa>,
      },
      {
        path: '/bbb',
        element: <Bbb></Bbb>,
      },
      {
        path: '/ccc',
        element: <Ccc></Ccc>,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
