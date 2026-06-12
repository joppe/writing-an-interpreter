import { EOF } from "../char/index.ts";
import { IterableLexer, Lexer } from "../lexer/index.ts";

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

    const lexer = new IterableLexer(new Lexer(line));

    for (const token of lexer) {
      await Deno.stdout.write(encoder.encode(`${token}\n`));
    }
  }
}
