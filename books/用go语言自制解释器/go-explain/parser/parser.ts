import { Lexer } from '../lexer';
import { Token } from '../token';

class Parser {
  /**
   * 指向词法分析器实例点指针
   *
   * @type {Lexer}
   * @memberof Parser
   */
  l: Lexer;
  /**
   * 当前词法单元
   *
   * @type {Token}
   * @memberof Parser
   */
  curToken?: Token;
  /**
   * 下一个词法单元
   *
   * @type {Token}
   * @memberof Parser
   */
  peekToken?: Token;

  constructor(l: Lexer) {
    this.l = l;
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  parseProgram() {
    return null;
  }
}

function createParser(lexer: Lexer) {
  const p = new Parser(lexer);

  // 读取两个词法单元，以设置curToken和peekToken
  p.nextToken();
  p.nextToken();

  return p;
}
