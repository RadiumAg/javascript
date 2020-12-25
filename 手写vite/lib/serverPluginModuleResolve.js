const { resolveVue } = require("./resolveVue");
const fs = require('fs');
const moduleRE= /^\/@modules\//;

function moduleResolvePlugin({ app, root }) {
    const vueResolved = resolveVue(root);
    app.use(async (ctx, next) => {
        // 对@modules 开头的路径进行映射
        if(!moduleRE.test(ctx.path)){
            return next();
        }
        // 去掉/@modules/路径
        const id = ctx.path.replace(moduleRE,'');
        ctx.type = 'js';
        const content = await fs.readFile(vueResolved[id],'utf-8');
        ctx.body = content;
    });
}

exports.moduleResolvePlugin = moduleResolvePlugin;