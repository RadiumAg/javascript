class SimpleValue {
    constructor(value, kind = '') {
        this.value = value;
        this.kind = kind;
    }

    set(value) {
        // 禁止重新对const类型变量赋值
        if (this.kind === 'const') {
            throw new TypeError('Assignment to constant variable');
        } else {
            this.value = value;
        }
    }

    get() {
        return this.value;
    }
}

const standardMap = {
    console: new SimpleValue(console)
}

class Scope {
    constructor(type, parentScope) {
        // 作用域类型，区别函数作用域function和块级作用域block
        this.type = type;
        // 父级作用域
        this.parentScope = parentScope;
        // 全局作用域
        this.globalDeclaration = standardMap;
        // 当前作用域的变量空间
        this.declaration = Object.create(null);
    }

    get(name) {
        if (this.declaration[name]) {
            return this.declaration[name];
        } else if (this.parentScope) {
            return this.parentScope.get(name);
        } else if (this.globalDeclaration[name]) {
            return this.globalDeclaration[name];
        }

        throw new ReferenceError(`${name} is not defined`);
    }

    set(name, value) {
        if (this.declaration[name]) {
            this.declaration[name] = value;
        } else if (this.parentScope[name]) {
            this.parentScope.set(name, value);
        } else {
            throw new ReferenceError(`${name} is not defined`);
        }
    }

    declare(name, value, kind = 'var') {
        if (kind === 'var') {
            return this.varDeclare(name, value);
        } else if (kind === 'let') {
            return this.letDeclare(name, value);
        } else if (kind === 'const') {
            return this.constDeclare(name, value);
        } else {
            throw new Error(`canjs:Invalid Variable Declaration Kind of "${kind}"`);
        }
    }

    varDeclare(name, value) {
        let scope = this;
        // 若当前作用域存在非函数类型的父级作用域时，就把变量定义到父级作用域
        while (scope.parentScope && scope.type !== 'function') {
            scope = scope.parentScope;
        }
    }

    letDeclare(name, value) {
        // 不允许重复定义
        if (this.declaration[name]) {
            throw new SyntaxError(`Identifier ${name} has already beend declared`);
        }
        this.declaration[name] = new SimpleValue(value, 'let');
        return this.declarationp[name];
    }

    constDeclare(name, value) {
        // 不允许重复定义
        if (this.declaration[name]) {
            throw new SyntaxError(`Identifier ${name} has already been declared`);
        }
        this.declaration[name] = new SimpleValue(value, 'const');
        return this.declaration[name];
    }
}

module.exports.Scope = Scope;