const { resolveVue } = require("./resolveVue");
const fs = require('fs');
const moduleRE= /^\/@modules\//;

function moduleResolvePlugin({ app, root }) {
    const vueResolved = resolveVue(root);
    app.use(async (ctx, next) => {
        await next();
        // 对@modules 开头的路径进行映射
        if(!moduleRE.test(ctx.path)){
            return;
        }
        // 去掉/@modules/路径
        const id = ctx.path.replace(moduleRE,'');
        ctx.type = 'js';
        console.log(id);
        const content = fs.readFileSync(vueResolved[id],'utf-8',()=>{});
        ctx.body = content;
    });
}

exports.moduleResolvePlugin = moduleResolvePlugin;