import { Token } from '../token';

interface Node {
  tokenLiteral(): string;
  string(): string;
}

interface Statement extends Node {
  statementNode(): void;
}

interface Expression extends Node {
  expressionNode(): void;
}

class Program implements Node {
  string(): string {
    return this.statements.toString();
  }

  statements: Statement[] = [];

  tokenLiteral(): string {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    }
    return '';
  }
}

class Identifier implements Expression {
  token: Token;
  value: string;

  constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
  }

  string(): string {}

  tokenLiteral(): string {
    return this.token.literal as string;
  }

  expressionNode(): void {}
}

class LetStatement implements Statement {
  token: Token;
  name: Identifier;
  value?: Expression;

  constructor(token: Token) {
    this.token = token;
    this.name = new Identifier(token, '');
  }

  string(): string {
    let output = '';
    output += this.tokenLiteral() + ' ';
    output += this.name.string();
    output += '=';

    if (this.value !== null) {
      output += this.name.string();
    }

    output += ';';

    return output;
  }

  tokenLiteral(): string {
    return this.token.literal as string;
  }

  statementNode(): void {}
}

class ReturnStatement implements Statement {
  /**
   * 该表达式中的第一个词法单元
   *
   * @type {Token}
   * @memberof ReturnStatement
   */
  token?: Token;
  returnValue?: Expression;

  string(): string {
    let output = '';

    return output;
  }
  statementNode(): void {}

  tokenLiteral() {
    return this.token?.literal as string;
  }
}

export {
  Node,
  Statement,
  Expression,
  Program,
  Identifier,
  LetStatement,
  ReturnStatement,
};
