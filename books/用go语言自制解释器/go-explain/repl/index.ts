import { createInterface } from 'readline';
import { Lexer } from '../lexer';
import { TokenType } from '../token';

const PROMPT = '>>';

function StartRepl() {
  const scanner = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: PROMPT,
  });

  console.log(PROMPT);

  if (scanner == null) return;

  scanner.on('line', (input: string) => {
    const lexer = new Lexer();
    lexer.input = input;
    lexer.readChar();
    for (
      let token = lexer.nextToken();
      token.type !== TokenType.EOF;
      token = lexer.nextToken()
    ) {
      console.log(token);
    }

    console.log(PROMPT);
  });
}

export { StartRepl };
