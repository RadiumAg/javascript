import React from 'react';

// 复制成 cases/NN-名字.tsx 就会自动进侧栏，不需要改 main.tsx
export const title = '用例标题';
export const note = '这个用例验证什么（显示在页面顶部和控制台）';

// 可选：模块级状态（Promise 缓存、计数器、定时器）在这里清，切回用例时才是干净的一轮
export function reset() {}

const App = () => <p>写你的用例</p>;

export default App;
