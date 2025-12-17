import { Token } from '../token';

interface Node {
  TokenLiteral(): string;
}

interface Statement {
  node: Node;
  statementNode(): void;
}

interface Expression {
  node: Node;

  expressionNode(): void;
}

class Program {
  statements: Statement[] = [];
}

class Identifier {
  token?: Token;
  value?: string;
}

class LetStatement {
  token?: Token;
  name?: Identifier;
  value?: Expression;
}

function TokenLiteral(value: Program | LetStatement | Identifier) {
  if (value instanceof Program) {
    return value.statements[0].node.TokenLiteral();
  } else if (value instanceof LetStatement) {
    return value.token?.literal;
  } else if (value instanceof Identifier) {
    return value.token?.literal;
  }

  return '';
}

function statementNode(ls: LetStatement) {}

function expressionNode() {}

export { TokenLiteral, statementNode };
