// parser/parser.test.ts

import { createLexer } from '../lexer';
import { createParser, Parser } from './parser';
import { LetStatement } from '../ast/indext';

describe('Parser', () => {
  test('TestLetStatements', () => {
    const input = `
      let x = 5;
      let y = 10;
      let foobar = 838383;
`;

    const lexer = createLexer(input);
    const parser = createParser(lexer);

    const program = parser.parseProgram();
    checkParserErrors(parser);

    expect(program).not.toBeNull();
    expect(program?.statements).toHaveLength(3);

    const tests = [
      { expectedIdentifier: 'x' },
      { expectedIdentifier: 'y' },
      { expectedIdentifier: 'foobar' },
    ];

    tests.forEach((tt, i) => {
      const stmt = program?.statements[i];
      expect(testLetStatement(stmt, tt.expectedIdentifier)).toBe(true);
    });
  });
});

function testLetStatement(stmt: any, name: string): boolean {
  // 检查 TokenLiteral 是否为 'let'
  if (stmt?.tokenLiteral() !== 'let') {
    console.error(`stmt.tokenLiteral not 'let'. got=${stmt?.tokenLiteral()}`);
    return false;
  }

  // 检查是否为 LetStatement 类型
  if (!(stmt instanceof LetStatement)) {
    console.error(`stmt not LetStatement. got=${typeof stmt}`);
    return false;
  }

  const letStmt = stmt as LetStatement;

  // 检查 Name.Value
  if (letStmt.name?.value !== name) {
    console.error(
      `letStmt.name.value not '${name}'. got=${letStmt.name?.value}`
    );
    return false;
  }

  // 检查 Name.TokenLiteral()
  if (letStmt.name?.tokenLiteral() !== name) {
    console.error(
      `letStmt.name.tokenLiteral() not '${name}'. got=${letStmt.name?.tokenLiteral()}`
    );
    return false;
  }

  return true;
}

function checkParserErrors(parser: Parser) {
  const errors = parser.errors;

  if (errors.length === 0) {
    return;
  }

  errors.forEach((err) => {
    console.error(`parser error: ${err}`);
  });

  throw new Error('parser has errors');
}
