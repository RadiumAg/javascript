import { TokenType, Token } from '../token/token';

const keywords: Record<string, TokenType> = {
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
};

class Lexer {
  input: string | undefined;
  position: number = 0;
  readPosition: number = 0;
  ch: string | undefined;

  nextToken(): Token {
    this.skipWhitespace();

    const ch = this.ch;
    let token: Token | undefined = undefined;

    switch (ch) {
      case '=':
        token = { type: TokenType.ASSIGN, literal: '=' };
        break;
      case '+':
        token = { type: TokenType.PLUS, literal: '+' };
        break;
      case '(':
        token = { type: TokenType.LPAREN, literal: '(' };
        break;
      case ')':
        token = { type: TokenType.RPAREN, literal: ')' };
        break;
      case '{':
        token = { type: TokenType.LBRACE, literal: '{' };
        break;
      case '}':
        token = { type: TokenType.RBRACE, literal: '}' };
        break;
      case ',':
        token = { type: TokenType.COMMA, literal: ',' };
        break;
      case ';':
        token = { type: TokenType.SEMICOLON, literal: ';' };
        break;
      case '':
        token = { type: TokenType.EOF, literal: '' };
        break;
      default: {
        if (isLetter(ch)) {
          token!.literal = readIdentifier(this);
          return token!;
        } else {
          token = { type: TokenType.ILLEGAL, literal: ch };
        }
      }
    }

    this.readChar();
    return token;
  }

  /**
   * readChar的目的是读取input中的下一个字符，并前移其在input中的位置。
   * 这个过程的第一件事就是检查是否已经到达input的末尾。如果是，则将l.ch设置为''，
   *
   * @memberof Lexer
   */
  readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.ch = '';
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  private skipWhitespace(): void {
    while (
      this.ch === ' ' ||
      this.ch === '\t' ||
      this.ch === '\n' ||
      this.ch === '\r'
    ) {
      this.readChar();
    }
  }
}

const createLexer = (input: string): Lexer => {
  const lexer = new Lexer();
  lexer.input = input;
  lexer.readChar();
  return lexer;
};

/**
 * 读入一个标识符并前移词法分析器的扫描位置
 * 直到遇到非字母字符
 *
 * @param {Lexer} lexer
 * @return {*}
 */
function readIdentifier(lexer: Lexer) {
  let position = lexer.position;
  while (isLetter(lexer.ch)) {
    lexer.readChar();
  }
  return lexer.input.slice(position, lexer.position);
}

/**
 *
 * 是否是字符
 *
 * @param {(string | number)} ch
 * @return {*}  {boolean}
 */
function isLetter(ch: string | number): boolean {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_';
}

export { Lexer, createLexer };
