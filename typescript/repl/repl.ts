import { EOF } from "../char/index.ts";
import { IterableLexer, Lexer } from "../lexer/index.ts";
import { Parser } from "../parser/index.ts";

const PROMPT = ">> ";

async function prompt(prefix: string): Promise<string> {
  await Deno.stdout.write(new TextEncoder().encode(prefix));

  const buf = new Uint8Array(1024);
  const numberOfBytesRead = await Deno.stdin.read(buf);

  if (numberOfBytesRead === null) {
    return EOF;
  }

  const input = new TextDecoder().decode(buf.subarray(0, numberOfBytesRead))
    .trim();

  return input;
}

export async function repl(): Promise<void> {
  const encoder = new TextEncoder();

  while (true) {
    const line = await prompt(PROMPT);

    if (line === "exit") {
      break;
    }

    const lexer = new Lexer(line);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    if (parser.errors.length > 0) {
      for (const error of parser.errors) {
        await Deno.stdout.write(encoder.encode(`${error}\n`));
      }
    }

    await Deno.stdout.write(encoder.encode(`${program.toString()}\n`));
  }
}
