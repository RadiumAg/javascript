const koa = require('koa');
const fs = require('fs');
const path = require('path');
const { moduleResolvePlugin } = require('./serverPluginModuleResolve');
const { moduleRewritePlugin } = require('./serverPluginModuleRewrite');
const { serveStaticPlugin } = require('./serveStaticPlugin');
const { vuePlugin } = require('./vuePlugin');
const { htmlRewritePlugin } = require('./htmlRewritePlugin');
function createServer() {
    const app = new koa();
    const root = process.cwd();

    // 构建上下文
    const context = {
        app,
        root
    }

    app.use(async (ctx, next) => {
        await next();
    });

    const resolvePlugins = [htmlRewritePlugin,moduleRewritePlugin, moduleResolvePlugin,, vuePlugin, serveStaticPlugin,];
    resolvePlugins.forEach(plugin => plugin(context));

    return app;
}

createServer().listen(5500);