import { Lexer } from '../lexer';
import { Token, TokenType } from '../token';
import {
  Program,
  Statement,
  LetStatement,
  Identifier,
  ReturnStatement,
  Expression,
  ExpressionStatement,
  IntegerLiteral,
  PrefixExpression,
  InfixExpression,
} from '../ast/indext';

type PrefixParseFn = () => Expression | null;

type InfixParseFn = (expression: Expression | null) => Expression | null;

const LESSGREATER = 2;
const EQUALS = 1;
const LOWEST = 0;
const SUM = 3;
const PERODUCT = 4;
const PREFIX = 5; // -X or !X
const CALL = 6; // myFunction(X)

const Precedence = {
  [TokenType.EQ]: EQUALS,
  [TokenType.NOT_EQ]: EQUALS,

  [TokenType.LT]: LESSGREATER,
  [TokenType.GT]: LESSGREATER,

  [TokenType.PLUS]: SUM,
  [TokenType.MINUS]: SUM,

  [TokenType.SLASH]: PERODUCT,
  [TokenType.ASTERISK]: PERODUCT,
} as Record<string, number>;

/**
 * 递归下降语法
 */
class Parser {
  errors: string[] = [];
  /**
   * 指向词法分析器实例点指针
   */
  l: Lexer;
  /**
   * 当前词法单元
   */
  curToken: Token | null = null;
  /**
   * 下一个词法单元
   */
  peekToken: Token | null = null;

  /**
   *
   * 前缀解析函数
   *
   * @type {(Record<TokenType | string, PrefixParseFn>)}
   * @memberof Parser
   */
  prefixParseFns: Record<TokenType | string, PrefixParseFn> = {};

  /**
   *
   * 中缀解析函数
   *
   * @type {(Record<TokenType | string, InfixParseFn>)}
   * @memberof Parser
   */
  infixParseFns: Record<TokenType | string, InfixParseFn> = {};

  constructor(l: Lexer) {
    this.l = l;
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  getErrors() {
    return this.errors;
  }

  peekError(token: TokenType) {
    console.log(
      `expected next token to be, ${token}, got ${this.peekToken?.type}`
    );
  }

  parseProgram(): Program | null {
    const program = new Program();

    while (this.curToken && this.curToken.type !== TokenType.EOF) {
      const stmt = this.parseStatement();
      if (stmt) {
        program.statements.push(stmt);
      }
      this.nextToken();
    }

    return program;
  }

  parseExpressionStatement(): ExpressionStatement | null {
    const stmt = new ExpressionStatement(this.curToken);
    stmt.expression = this.parseExpression(LOWEST);

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }
    return stmt;
  }

  parseExpression(precedence: number): Expression | null {
    if (this.curToken == null) return null;
    const prefix = this.prefixParseFns[this.curToken.type];
    if (!prefix) {
      this.noPrefixParseFnError(this.curToken.type);
      return null;
    }
    let leftExp = prefix();
    while (
      !this.peekTokenIs(TokenType.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infix = this.infixParseFns[this.peekToken?.type!];
      if (infix == null) {
        return leftExp;
      }
      this.nextToken();
      leftExp = infix(leftExp);
    }
    return leftExp;
  }

  parseStatement(): Statement | null {
    switch (this.curToken?.type) {
      case TokenType.LET:
        return this.parseLetStatement();

      case TokenType.RETURN:
        return this.parseReturnStatement();

      default:
        return this.parseExpressionStatement();
    }
  }

  parseLetStatement(): LetStatement | null {
    if (!this.curToken) return null;

    const stmt = new LetStatement(this.curToken);

    if (!this.expectPeek(TokenType.IDENT)) {
      return null;
    }

    if (!this.curToken) return null;
    stmt.name = new Identifier(this.curToken, this.curToken.literal as string);

    if (!this.expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    // 跳过表达式解析，直到遇到分号
    // 这里暂时跳过表达式的值，因为当前测试只关注 let 语句的标识符部分
    while (this.curToken && this.curToken.type !== TokenType.SEMICOLON) {
      this.nextToken();
    }

    return stmt;
  }

  parseIdentifier() {
    if (!this.curToken) return null;
    const identifier = new Identifier(
      this.curToken,
      this.curToken.literal as string
    );
    return identifier;
  }

  parseReturnStatement(): ReturnStatement | null {
    if (!this.curToken) return null;

    const stmt = new ReturnStatement();
    stmt.token = this.curToken;

    this.nextToken();

    // 跳过表达式解析，直到遇到分号
    // 这里暂时跳过表达式的值，因为当前测试只关注 return 语句的 token literal
    while (this.curToken && this.curToken.type !== TokenType.SEMICOLON) {
      this.nextToken();
    }

    return stmt;
  }

  curTokenIs(tokenType: TokenType): boolean {
    return this.curToken?.type === tokenType;
  }

  peekTokenIs(tokenType: TokenType): boolean {
    return this.peekToken?.type === tokenType;
  }

  curPrecedence() {
    if (this.curToken?.type && Precedence[this.curToken?.type!]) {
      return Precedence[this.curToken?.type!];
    }

    return LOWEST;
  }

  /**
   * 断言函数主要的目的是通过检查下一个词法单元的类型，
   * 确保词法单元顺序的正确性
   *
   * @param {TokenType} tokenType
   * @return {*}  {boolean}
   * @memberof Parser
   */
  expectPeek(tokenType: TokenType): boolean {
    if (this.peekTokenIs(tokenType)) {
      this.nextToken();
      return true;
    }
    return false;
  }

  registerPrefix(tokenType: TokenType, fn: PrefixParseFn) {
    this.prefixParseFns[tokenType] = fn;
  }

  registerInfix(tokenType: TokenType, fn: InfixParseFn) {
    this.infixParseFns[tokenType] = fn;
  }

  /**
   * 解析整数
   *
   * @return {*}
   * @memberof Parser
   */
  parseIntegerLiteral() {
    const list = new IntegerLiteral(this.curToken);
    const value = Number.parseInt(this.curToken?.literal || '');
    if (Number.isNaN(value)) {
      this.errors.push(
        'could not parse as interger',
        this.curToken?.literal || ''
      );
      return null;
    }

    list.value = value;
    return list;
  }

  noPrefixParseFnError(tokenType: TokenType) {
    let mst = `no prefix parse function for ${tokenType} found `;
    this.errors.push(mst);
  }

  parsePrefixExpression() {
    const expression = new PrefixExpression(
      this.curToken,
      this.curToken?.literal || null
    );

    this.nextToken();

    expression.right = this.parseExpression(PREFIX);

    return expression;
  }

  peekPrecedence() {
    if (this.peekToken && Precedence[this.peekToken.type]) {
      return Precedence[this.peekToken.type];
    }
    return LOWEST;
  }

  parseInfixExpression(left: Expression | null) {
    const expression = new InfixExpression(
      this.curToken,
      this.curToken?.literal!,
      left
    );
    const precedence = this.curPrecedence();
    this.nextToken();
    expression.right = this.parseExpression(precedence);

    return expression;
  }
}

function createParser(lexer: Lexer): Parser {
  const p = new Parser(lexer);

  // 读取两个词法单元，以设置curToken和peekToken
  p.nextToken();
  p.nextToken();

  p.prefixParseFns = {};
  p.registerPrefix(TokenType.IDENT, p.parseIdentifier.bind(p));
  p.registerPrefix(TokenType.INT, p.parseIntegerLiteral.bind(p));

  p.registerPrefix(TokenType.BANG, p.parsePrefixExpression.bind(p));
  p.registerPrefix(TokenType.MINUS, p.parsePrefixExpression.bind(p));

  p.registerInfix(TokenType.PLUS, p.parseInfixExpression.bind(p));
  p.registerInfix(TokenType.SLASH, p.parseInfixExpression.bind(p));
  p.registerInfix(TokenType.ASTERISK, p.parseInfixExpression.bind(p));
  p.registerInfix(TokenType.EQ, p.parseInfixExpression.bind(p));
  p.registerInfix(TokenType.NOT_EQ, p.parseInfixExpression.bind(p));
  p.registerInfix(TokenType.LT, p.parseInfixExpression.bind(p));
  p.registerInfix(TokenType.GT, p.parseInfixExpression.bind(p));

  return p;
}

export { Parser, createParser };
