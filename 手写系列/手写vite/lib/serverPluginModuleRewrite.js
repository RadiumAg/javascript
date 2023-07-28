const { parse } = require('es-module-lexer');
const MagicString = require('magic-string');
const { readBody } = require('./readBody');
function rewriteImports(source = '') {
  const imports = parse(source)[0];
  const magicString = new MagicString(source);
  if (imports.length > 0) {
    for (const { s, e } of imports) {
      let id = source.substring(s, e);
      if (/^[^./]/.test(id)) {
        id = `/@modules/${id}.js`;
        magicString.overwrite(s, e, id);
      }
    }
  }
  return magicString.toString();
}

function moduleRewritePlugin({ root, app }) {
  app.use(async (ctx, next) => {
    await next();
    // 对类型是js的文件进行拦截
    if (ctx.body && ctx.response.is('js')) {
      console.log(ctx.path);
      // 读取文件内容
      const content = await readBody(ctx.body);
      // 重写Import中无法识别的路径
      const r = rewriteImports(content);
      ctx.body = r;
    }
  });
}

exports.moduleRewritePlugin = moduleRewritePlugin;
