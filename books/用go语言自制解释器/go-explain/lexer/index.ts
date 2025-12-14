import { TokenType, Token } from '../token/token';

class Lexer {
  input: string;
  position: number = 0;
  readPosition: number = 0;
  ch: string | number;

  nextToken(): Token {
    this.skipWhitespace();

    const ch = this.ch;
    let token: Token;

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
      case 0:
        token = { type: TokenType.EOF, literal: '' };
        break;
      default:
        token = { type: TokenType.ILLEGAL, literal: ch };
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
      this.ch = 0;
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

export { Lexer, createLexer };
