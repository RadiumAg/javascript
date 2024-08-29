const jsonObj = require('./index.json'); // 通过fs模块同步读取文件后，用JSON.parse()解析

console.log(jsonObj);
console.log(module.paths);
console.log(module);
