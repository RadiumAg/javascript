const path = require('path');
function serveStaticPlugin({ app, root }) {
    app.use(require('koa-static'));
    app.use(require('koa-static')(path.join(root, 'public')));
}

exports.serveStaticPlugin = serveStaticPlugin;