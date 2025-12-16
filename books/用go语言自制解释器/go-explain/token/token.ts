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
}

interface Token {
  type: TokenType;
  literal: string | number;
}

const keywords: Record<string, TokenType> = {
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
  true: TokenType.IDENT,
  false: TokenType.IDENT,
  if: TokenType.IDENT,
  else: TokenType.IDENT,
  return: TokenType.IDENT,
};

function lookupIdent(ident: string): TokenType {
  return keywords[ident] || TokenType.IDENT;
}

export { TokenType, Token, lookupIdent };
