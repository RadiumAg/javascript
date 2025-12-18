import { Lexer } from '../lexer';
import { Token, TokenType } from '../token';
import { Program, Statement, LetStatement, Identifier } from '../ast/indext';

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
  curToken?: Token;
  /**
   * 下一个词法单元
   */
  peekToken?: Token;

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

  parseStatement(): Statement | null {
    if (this.curToken?.type === TokenType.LET) {
      return this.parseLetStatement();
    }
    return null;
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

  expectPeek(tokenType: TokenType): boolean {
    if (this.peekToken?.type === tokenType) {
      this.nextToken();
      return true;
    }
    return false;
  }
}

function createParser(lexer: Lexer): Parser {
  const p = new Parser(lexer);

  // 读取两个词法单元，以设置curToken和peekToken
  p.nextToken();
  p.nextToken();

  return p;
}

export { Parser, createParser };
