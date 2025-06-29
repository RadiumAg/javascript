import Link from './react-router-custom/Link';
import Route from './react-router-custom/route';
import Router from './react-router-custom/router';

// 页面组件
function Home() {
  return (
    <div
      style={{
        padding: '20px',
        border: '2px solid #4CAF50',
        borderRadius: '10px',
      }}
    >
      <h2>首页</h2>
      <p>欢迎来到我们的网站！</p>
    </div>
  );
}

function About() {
  return (
    <div
      style={{
        padding: '20px',
        border: '2px solid #2196F3',
        borderRadius: '10px',
      }}
    >
      <h2>关于我们</h2>
      <p>我们是一个致力于创建优秀产品的团队。</p>
    </div>
  );
}

function Contact() {
  return (
    <div
      style={{
        padding: '20px',
        border: '2px solid #FF9800',
        borderRadius: '10px',
      }}
    >
      <h2>联系我们</h2>
      <p>邮箱: contact@example.com</p>
    </div>
  );
}

function UserProfile() {
  const { id } = useParams();

  return (
    <div
      style={{
        padding: '20px',
        border: '2px solid #9C27B0',
        borderRadius: '10px',
      }}
    >
      <h2>用户资料</h2>
      <p>用户ID: {id}</p>
      <p>这是用户 {id} 的个人资料页面</p>
    </div>
  );
}

function NotFound() {
  return (
    <div
      style={{
        padding: '20px',
        border: '2px solid #f44336',
        borderRadius: '10px',
      }}
    >
      <h2>404 - 页面未找到</h2>
      <p>抱歉，您访问的页面不存在。</p>
    </div>
  );
}

// 导航栏组件
function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
      }}
    >
      <Link to="/">首页</Link>
      <Link to="/about">关于</Link>
      <Link to="/contact">联系我们</Link>
      <Link to="/user/123">用户123</Link>
      <Link to="/user/456">用户456</Link>
      <Link to="/non-existent">不存在的页面</Link>
    </nav>
  );
}

// 应用组件
function App() {
  return (
    <Router>
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <h1 style={{ textAlign: 'center', color: '#333' }}>
          简单 React Router 实现
        </h1>
        <Navbar />

        <Route path="/" exact component={<Home></Home>} />
        <Route path="/about" component={<About></About>} />
        <Route path="/contact" component={<Contact></Contact>} />
        <Route path="/user/:id" component={<UserProfile></UserProfile>} />
        <Route path="*" component={<NotFound></NotFound>} />
      </div>
    </Router>
  );
}

export default App;
