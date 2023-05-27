// URL编码使用的是百分号编码

(() => {
  console.log(encodeURIComponent('al&lu=')); //encodeURIComponent将转义除字母、数字、“（”、“）”、“.”、“!”、“~”、“*”、“'”、“-” 除了这些都会编码
})();

// 浏览器记录
(() => {
  window.history.go(1); // 表示前进一个页面
  window.history.go(0); // 表示刷新一个页面
})();
