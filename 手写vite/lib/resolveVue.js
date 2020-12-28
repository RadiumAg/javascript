const path = require('path');
function resolveVue(root) {
    const compilerPkgPath = path.resolve(root, 'node_modules', 'vue/package.json');
    const compilerPkg = require(compilerPkgPath);
    // 编译模块的路径 node中编译
    const compilerPath = path.join(path.dirname(compilerPkgPath), compilerPkg.main);
    const resovlePath = (name) => path.resolve(root, 'node_modules', `vue/${name}/dist/${name}.esm-bundler.js`);
    // dom运行
    const runtimeDomPath = resovlePath('runtime-dom');
    // 核心运行
    const runtimeCorePath = resovlePath('runtime-core');
    // 响应式模块
    const reactivityPath = resovlePath('reactivity');
    // 共享模块
    const sharedPath = resovlePath('shared');
    return {
        vue: runtimeDomPath,
        '@vue/runtime-dom': runtimeDomPath,
        '@vue/runtime-core': runtimeCorePath,
        '@vue/reactivity': reactivityPath,
        '@vue/shared': sharedPath,
        compiler: compilerPath,
    };
}

module.exports.resolveVue =  resolveVue;