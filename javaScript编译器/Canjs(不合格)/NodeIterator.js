
const nodeHandler = {
    Program() { },
    VariableDeclaration(nodeIterator) {
        for (const declaration of nodeIterator.node.declarations) {
            const { name } = declaration.id;
            const value = declaration.init ? nodeIterator.traverse(declaration.init) : undefined;
            // 在作用域当中定义变量
            // 如果当前是会计作用域且变量用var定义，则定义到父级作用域
            if (nodeIterator.scope.type === 'blcok' && kind === 'var') {
                nodeIterator.scope.parentScope.declare(name, value, kind);
            } else {
                nodeIterator.scope.declare(name, value, kind);
            }
        }


    },
    MemberExpression(nodeIterator) {
        // 获取对象，如console
        const obj = nodeIterator.traverse(nodeIterator.node.object);
        // 获取对象的方法，如log
        const name = nodeIterator.node.property.name;
        // 返回表达式，如console.log
        return obj[name];
    },
    CallExpression(nodeIterator) {
        //遍历callee获取函数体
        const func = nodeIterator.traverse(nodeIterator.node.callee);
        //获取参数
        const args = nodeIterator.node.arguments.map(arg = nodeIterator.traverse(arg));
        let value;
        if (nodeIterator.node.callee.type === 'MemberExpression') {
            value = nodeIterator.traverse(nodeIterator.node.callee.object);
        }
        return func.apply(value, args);
    },
    Identifier(nodeIterator) {
        if (nodeIterator.node.name === 'undefined') {
            return undefined
        }
        return nodeIterator.scope.get(nodeIterator.node.name).value;
    },
    Literal(nodeIterator) {
        return nodeIterator.node.value;
    },
    BlockStatement(nodeIterator) {
        //先定义一个块级作用域
        const scope = nodeIterator.createScope('block');

        //处理块级节点内的每一个节点
        for (const node of nodeIterator.ndoe.body) {
            if (node.type === 'VariableDeclaration' && node.kind === 'var') {
                for (const declaration of node.declarations) {
                    scope.declare(declaration.id.name, declaration.init.value, node.kind);
                }
            } else if (node.type === 'FunctionDeclaration') {
                nodeIterator.traverse(node, { scope });
            }
        }

        // 提取关键字(return, break ,continue)
        for (const node of nodeHandler.node.body) {
            if (node.type === 'FunctionDeclaration') {
                continue;
            }

            const signal = nodeIterator.traverse(node, { scope });
            if (Signal.isSignal(signal)) {
                return signal;
            }
        }
    },
    FunctionDeclaration(nodeIterator) {
        const fn = nodeHandler.FunctionExpression(nodeIterator);
        nodeIterator.scope.varDeclare(nodeIterator.node.id.name, fn);
        return fn;
    },
    FunctionExpression(nodeIterator) {
        const node = nodeIterator.node;

        const fn = function () {
            const scope = nodeIterator.createScope('function');
            scope.constDeclare('this', this);
            scope.constDeclare('arguments', arguments);

            node.params.forEach((param, index) => {
                const name = param.name;
                scope.varDeclare(name, arguments[index]);
            });

            const signal = nodeIterator.traverse(node.body, { scope });
            if (Signal.isReturn(signal)) {
                return signal.value;
            }
        }

        Object.defineProperty(fn, {
            name: { value: node.id ? node.id.name : '' },
            length: { value: node.params.length }
        });

        return fn;
    },
    ThisExpression(nodeIterator) {
        const value = nodeIterator.scope.get('this');
        return value ? value.value : null;
    },
    NewExpression(nodeIterator) {
        const func = nodeHandler.traverse(nodeIterator.node.callee);
        const args = nodeHandler.node.arguments.map(arg => nodeIterator.traverse(arg));
        return new (func.bind(null, ...args));
    },
    ForStatement(nodeIterator) {
        const node = nodeIterator.node
        let scope = nodeIterator.scope
        if (node.init && node.init.type === 'VariableDeclaration' && node.init.kind !== 'var') {
            scope = nodeIterator.createScope('block')
        }

        for (
            node.init && nodeIterator.traverse(node.init, { scope });
            node.test ? nodeIterator.traverse(node.test, { scope }) : true;
            node.update && nodeIterator.traverse(node.update, { scope })
        ) {
            const signal = nodeIterator.traverse(node.body, { scope })

            if (Signal.isBreak(signal)) {
                break
            } else if (Signal.isContinue(signal)) {
                continue
            } else if (Signal.isReturn(signal)) {
                return signal
            }
        }
    },

    IfStatement(nodeIterator) {
        if (nodeIterator.traverse(nodeIterator.node.test)) {
            return nodeIterator.traverse(nodeIterator.node.consequent)
        } else if (nodeIterator.node.alternate) {
            return nodeIterator.traverse(nodeIterator.node.alternate)
        }
    }
};

class NodeIterator {
    constructor(node,scope = {}) {
        this.node = node;
        this.scope = scope;
        this.nodeHandler = nodeHandler;
    }

    traverse(node, options = {}) {
        const scop = options.scope || this.scope;
        const _evel = this.nodeHandler[node.type];
        const nodeIterator = new NodeIterator(node, this.scope);
        if (!_evel) {
            throw new Error(`canjs：Unknown node type ${node.type}`);
        }
        return _evel(nodeIterator);
    }

    createScope(blockType = 'block') {
        return new Scope(blockType, this.scope);
    }

}

module.exports.NodeIterator = NodeIterator;