'use strict';
const { Parser } = require('acorn');
const { NodeIterator } = require('./NodeIterator');
const { Scope } = require('./Scope');

class Canjs {
    constructor(code = '', extraDeclaration = {}) {
        this.code = code;
        this.extraDeclaration = extraDeclaration;
        this.ast = Parser.parse(code);
        this.nodeIterator = null;
        this.init();
    }

    init() {
        // 定义全局作用域，该作用域类型为函数作用域
        const globalScope = new Scope('function');
        // 根据入参定义标准库之外的全局变量;
        Object.keys(this.extraDeclaration).forEach((key) => {
            globalScope.addDeclaration(key, this.extraDeclaration[key]);
        })
        this.nodeIterator = new NodeIterator(null, globalScope);
    }

    run() {
        return this.nodeIterator.traverse(this.ast);
    }
}

new Canjs('conseole.log(1111)').run();