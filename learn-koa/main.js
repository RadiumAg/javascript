const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  console.log(ctx.path);
});

app.listen(3000);
