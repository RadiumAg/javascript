const fs = require('fs');
const path = require('path');
const { resolveVue } = require('./resolveVue');
const Vue = require('vue');
const defaultExportRE = /((?:^|\n|;)\s*)export default/;
const compareDom = require('@vue/compiler-dom');

async function vuePlugin({ app, root }) {
  app.use(async (ctx, next) => {
    await next();
    if (!ctx.path.endsWith('.vue')) {
      return;
    }

    // vue文件处理
    const filePath = path.join(root, ctx.path);
    const content = fs.readFileSync(filePath, 'utf-8', () => {});
    // 获取文件内容
    const { parse, compileTemplate } = require(resolveVue(root).compiler);
    const { descriptor } = parse(content); // 解析文件内容

    if (!ctx.query.type) {
      let code = '';
      if (descriptor.script) {
        const content = descriptor.script.content;
        const replaced = content.replace(defaultExportRE, '$1const __script =');
        code += replaced;
      }

      if (descriptor.template) {
        const templateRequest = `${ctx.path}?type=template`;
        code += `\nimport { render as __render } from ${JSON.stringify(
          templateRequest,
        )}`;
        code += `\n__script.render = __render`;
      }
      ctx.type = 'js';
      code += `\nexport default __script`;
      ctx.body = code;
    }

    if (ctx.query.type == 'template') {
      ctx.type = 'js';
      const content = descriptor.template.content;
      const { code } = compileTemplate({ source: content });
      ctx.body = code;
    }
  });
}

exports.vuePlugin = vuePlugin;
