const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const { dirname } = require('path');

// 转换代码，生成依赖
function stepOne(filename) {
    console.log(path.resolve(filename));
    const content = fs.readFileSync(path.resolve(__dirname+filename), 'utf-8');
    // 转换成ast
    const ast = parser.parse(content, {
        sourceType: 'module'
    });
    const dependencies = {};
    // 遍历AST抽象语法树
    traverse(ast, {
        ImportDeclaration({ node }) {
            const dirname = path.dirname(filename);
            const newFile =  path.join(dirname, node.source.value);
            //保存所依赖的模块；
            dependencies[node.source.value] = newFile;
        }
    });

    // 通过@babel/core和@babel/pareset-env进行代码的转换
    const { code } = babel.transformFromAst(ast, null, {
        presets: ['@babel/preset-env']
    });
    return {
        filename,
        dependencies,
        code
    };
}

// 生成依赖图谱
function stepTwo(entry) {
    const entryModule = stepOne(entry);
    const graphArray = [entryModule];
    let i = 0;
    for (i = 0; i < graphArray.length; i++) {
        const item = graphArray[i];
        const { dependencies } = item;  //拿到文件所依赖的模块集合
        for (let j in dependencies) {
            graphArray.push(stepOne(dependencies[j]));
        }
    }
    const graph = {};
    graphArray.forEach(item => {
        graph[item.filename] = {
            dependencies: item.dependencies,
            code: item.code,
        };
    });
    return graph;
}

//下面是生成代码字符串的操作，仔细看，不要眨眼睛哦！
function stepThree(entry) {
    //要先把对象转换为字符串，不然在下面的模板字符串中会默认调取对象的toString方法，参数变成[Object object],显然不行
    const graph = JSON.stringify(stepTwo(entry))
    return `
        (function(graph) {
            //require函数的本质是执行一个模块的代码，然后将相应变量挂载到exports对象上
            function require(module) {
                //localRequire的本质是拿到依赖包的exports变量
                function localRequire(relativePath) {
                    return require(graph[module].dependencies[relativePath]);
                }
                var exports = {};
                (function(require, exports, code) {
                    eval(code);
                })(localRequire, exports, graph[module].code);
                return exports;//函数返回指向局部变量，形成闭包，exports变量在函数执行后不会被摧毁
            }
            require('${entry}')
        })(${graph})`
}

let a = stepThree('/test/index.js');
console.log(a);