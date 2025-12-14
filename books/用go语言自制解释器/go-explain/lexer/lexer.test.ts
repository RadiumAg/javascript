// lexer/lexer_test.ts

import { createLexer } from './index';
import { TokenType } from '../token/token';

describe('Lexer', () => {
  test('TestNextToken', () => {
    const input = '=+(){},;';

    const tests = [
      { expectedType: TokenType.ASSIGN, expectedLiteral: '=' },
      { expectedType: TokenType.PLUS, expectedLiteral: '+' },
      { expectedType: TokenType.LPAREN, expectedLiteral: '(' },
      { expectedType: TokenType.RPAREN, expectedLiteral: ')' },
      { expectedType: TokenType.LBRACE, expectedLiteral: '{' },
      { expectedType: TokenType.RBRACE, expectedLiteral: '}' },
      { expectedType: TokenType.COMMA, expectedLiteral: ',' },
      { expectedType: TokenType.SEMICOLON, expectedLiteral: ';' },
      { expectedType: TokenType.EOF, expectedLiteral: '' },
    ];

    const l = createLexer(input);

    tests.forEach((tt, i) => {
      const tok = l.nextToken();

      expect(tok.type).toBe(tt.expectedType);

      expect(tok.literal).toBe(tt.expectedLiteral);
    });
  });
});
