const koa = require('koa');
const { moduleResolvePlugin } = require('./serverPluginModuleResolve');
const { moduleRewritePlugin } = require('./serverPluginModuleRewrite');
const { serveStaticPlugin } = require('./serveStaticPlugin');
const { vuePlugin } = require('./vuePlugin');
function createServer() {
    const app = new koa();
    const root = process.cwd();

    // 构建上下文
    const context = {
        app,
        root
    }

    app.use((ctx, next) => {
        Object.assign(ctx, context);
        return next();
    });

    const resolvePlugins = [serveStaticPlugin, moduleRewritePlugin, moduleResolvePlugin, vuePlugin];
    resolvePlugins.forEach(plugin => plugin(context));
    return app;
}

createServer().listen(4000);