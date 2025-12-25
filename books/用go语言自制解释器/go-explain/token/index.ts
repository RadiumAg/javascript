// token/token.ts

enum TokenType {
  ILLEGAL = 'ILLEGAL',
  EOF = 'EOF',

  // 标识符 + 字面量
  IDENT = 'IDENT',
  INT = 'INT',

  // 运算符
  ASSIGN = '=',
  PLUS = '+',
  MINUS = '-',
  BANG = '!',
  ASTERISK = '*',
  SLASH = '/',
  LT = '<',
  GT = '>',
  EQ = '==',
  NOT_EQ = '!=',

  // 分隔符
  COMMA = ',',
  SEMICOLON = ';',

  LPAREN = '(',
  RPAREN = ')',
  LBRACE = '{',
  RBRACE = '}',

  // 关键字
  FUNCTION = 'FUNCTION',
  LET = 'LET',
  RETURN = 'RETURN',
}

interface Token {
  type: TokenType;
  literal: string;
}

const keywords: Record<string, TokenType> = {
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
  return: TokenType.RETURN,
  true: TokenType.IDENT,
  false: TokenType.IDENT,
  if: TokenType.IDENT,
  else: TokenType.IDENT,
};

function lookupIdent(ident: string): TokenType {
  return keywords[ident] || TokenType.IDENT;
}

export { TokenType, Token, lookupIdent };
