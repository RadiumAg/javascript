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

interface Program {
  statements: Statement[];
}

function TokenLiteral(p: Program) {
  if (p.statements.length > 0) {
    return p.statements[0].node.TokenLiteral();
  }

  return '';
}

export { TokenLiteral };
