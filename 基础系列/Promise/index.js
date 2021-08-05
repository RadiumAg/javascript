/**
 * 使用promise进行错误处理
 * 当一个promise被reject时，控制器将移交至最近的`rejection`处理程序
 * `handler`
 */
(() => {
  fetch('https://no-such-server.blabla')
    .then((response) => response.json())
    .catch((err) => console.log(err));
})();
