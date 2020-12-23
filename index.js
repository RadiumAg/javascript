// const a = [1, 2, 3, 4],
//   b = [1, 2, 3, 4],
//   c = new Set(),
//   d = [];

// for (let item of [...a, ...b]) {
//   c.add(item);
// }

// c.forEach((x) => {
//   d.push(x);
// })

function a(params) {
  let b = params;
  return c => {
    console.log(b);
  }
}

let d = [a, a, a];
d[0](1)();
d[1](2)();
d[2](4)();



(function (graph) {
  //require函数的本质是执行一个模块的代码，然后将相应变量挂载到exports对象上
  function require(module) {
    //localRequire的本质是拿到依赖包的exports变量
    function localRequire(relativePath) {
      return require(graph[module].dependencies[relativePath]);
    }
    var exports = {};
    (function (require, exports, code) {
      eval(code);
    })(localRequire, exports, graph[module].code);
    return exports;//函数返回指向局部变量，形成闭包，exports变量在函数执行后不会被摧毁
  }
  require('/test/index.js');
})({ "/test/index.js": { "dependencies": { "./module.js": "\\test\\module.js" }, "code": "\"use strict\";\n\nvar _module = _interopRequireDefault(require(\"./module.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\n_module[\"default\"].get();" }, "\\test\\module.js": { "dependencies": {}, "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar _default = {\n  get: function get() {\n    console.log('get');\n  }\n};\nexports[\"default\"] = _default;" } })



