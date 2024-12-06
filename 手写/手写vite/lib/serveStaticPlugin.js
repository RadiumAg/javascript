const path = require('path');
function serveStaticPlugin({ app, root }) {
  console.log('静态资源插件启动成功');
  app.use(require('koa-static')(path.join(root)));
}

exports.serveStaticPlugin = serveStaticPlugin;
