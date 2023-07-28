const { readBody } = require('./readBody');

function htmlRewritePlugin({ root, app }) {
  const devInjection = `
    <script>
        window.process = {env:{NODE_ENV:'development'}}
    </script>
    `;
  app.use(async (ctx, next) => {
    await next();
    if (ctx.response.is('html')) {
      console.log('写入process');
      const html = await readBody(ctx.body);
      ctx.body = html.replace(/<head>/, `$&${devInjection}`);
    }
  });
}

exports.htmlRewritePlugin = htmlRewritePlugin;
