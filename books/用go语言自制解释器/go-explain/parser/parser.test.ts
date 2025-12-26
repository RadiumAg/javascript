// parser/parser.test.ts

import { createLexer } from '../lexer';
import { createParser, Parser } from './parser';
import {
  LetStatement,
  Statement,
  ReturnStatement,
  Identifier,
  ExpressionStatement,
  IntegerLiteral,
  PrefixExpression,
} from '../ast/indext';

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

  test('TestReturnStatements', () => {
    const input = `
      return 5;
      return 10;
      return 993322;
`;

    const lexer = createLexer(input);
    const parser = createParser(lexer);

    const program = parser.parseProgram();
    checkParserErrors(parser);

    expect(program).not.toBeNull();
    expect(program?.statements).toHaveLength(3);

    program?.statements.forEach((stmt) => {
      expect(stmt).toBeInstanceOf(ReturnStatement);
      expect(stmt.tokenLiteral()).toBe('return');
    });
  });
});

function testLetStatement(stmt: Statement | undefined, name: string): boolean {
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

function testIntegerLiteral(il: any, value: number): boolean {
  // 检查是否为 IntegerLiteral 类型 (对应 Go 中的类型断言)
  if (!(il instanceof IntegerLiteral)) {
    console.error(
      `il not IntegerLiteral. got=${il?.constructor?.name || typeof il}`
    );
    return false;
  }

  const integ = il as IntegerLiteral;

  // 检查 value 属性
  if (integ.value !== value) {
    console.error(`integ.value not ${value}. got=${integ.value}`);
    return false;
  }

  // 检查 TokenLiteral() 方法返回值
  if (integ.tokenLiteral() !== value.toString()) {
    console.error(
      `integ.tokenLiteral not ${value}. got=${integ.tokenLiteral()}`
    );
    return false;
  }

  return true;
}

test('TestIdentifierExpression', () => {
  const input = 'foobar;';

  const lexer = createLexer(input);
  const parser = createParser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);

  expect(program).not.toBeNull();
  expect(program?.statements).toHaveLength(1);

  const stmt = program?.statements[0];
  expect(stmt).toBeInstanceOf(ExpressionStatement);

  const exprStmt = stmt as ExpressionStatement;
  const ident = exprStmt.expression as Identifier;

  expect(ident.value).toBe('foobar');
  expect(ident.tokenLiteral()).toBe('foobar');
});

test('TestIntegerLiteralExpression', () => {
  const input = '5;';

  const lexer = createLexer(input);
  const parser = createParser(lexer);
  const program = parser.parseProgram();
  checkParserErrors(parser);

  expect(program).not.toBeNull();
  expect(program?.statements).toHaveLength(1);

  const stmt = program?.statements[0];
  expect(stmt).toBeInstanceOf(ExpressionStatement);

  const exprStmt = stmt as ExpressionStatement;
  const literal = exprStmt.expression as IntegerLiteral;

  expect(literal.value).toBe(5);
  expect(literal.tokenLiteral()).toBe('5');
});

test('TestParsingPrefixExpressions', () => {
  const prefixTests = [
    { input: '!5;', operator: '!', integerValue: 5 },
    { input: '-15;', operator: '-', integerValue: 15 },
  ];

  prefixTests.forEach((tt) => {
    const lexer = createLexer(tt.input);
    const parser = createParser(lexer);
    const program = parser.parseProgram();
    checkParserErrors(parser);

    expect(program).not.toBeNull();
    expect(program?.statements).toHaveLength(1);

    const stmt = program?.statements[0];
    expect(stmt).toBeInstanceOf(ExpressionStatement);

    const exprStmt = stmt as ExpressionStatement;
    const exp = exprStmt.expression;
    expect(exp).toBeInstanceOf(PrefixExpression);

    const prefixExp = exp as PrefixExpression;
    expect(prefixExp.operator).toBe(tt.operator);
    expect(testIntegerLiteral(prefixExp.right, tt.integerValue)).toBe(true);
  });
});
