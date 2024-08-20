import './App.scss';
import 'swiper/css';

function App() {
  return (
    <a
      href="https://www.baidu.com"
      onClick={() => {
        const startTime = performance.now();
        while (startTime - performance.now() > 4000) {}
      }}
    >
      百度
    </a>
  );
}

export default App;
