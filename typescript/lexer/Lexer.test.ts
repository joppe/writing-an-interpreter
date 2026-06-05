import { assertEquals } from "jsr:@std/assert";

import { tokenType } from "../token/index.ts";
import { Lexer } from "./index.ts";

Deno.test("Lexer", async (t) => {
  await t.step("nextToken", () => {
    const input = `let five = 5;
let ten = 10;

let add = fn(x, y) {
  x + y;
};

let result = add(five, ten);
`;
    const tests = [
      [tokenType.LET, "let"],
      [tokenType.IDENT, "five"],
      [tokenType.ASSIGN, "="],
      [tokenType.INT, "5"],
      [tokenType.SEMICOLON, ";"],
      [tokenType.LET, "let"],
      [tokenType.IDENT, "ten"],
      [tokenType.ASSIGN, "="],
      [tokenType.INT, "10"],
      [tokenType.SEMICOLON, ";"],
      [tokenType.LET, "let"],
      [tokenType.IDENT, "add"],
      [tokenType.ASSIGN, "="],
      [tokenType.FUNCTION, "fn"],
      [tokenType.LPAREN, "("],
      [tokenType.IDENT, "x"],
      [tokenType.COMMA, ","],
      [tokenType.IDENT, "y"],
      [tokenType.RPAREN, ")"],
      [tokenType.LBRACE, "{"],
      [tokenType.IDENT, "x"],
      [tokenType.PLUS, "+"],
      [tokenType.IDENT, "y"],
      [tokenType.SEMICOLON, ";"],
      [tokenType.RBRACE, "}"],
      [tokenType.SEMICOLON, ";"],
      [tokenType.LET, "let"],
      [tokenType.IDENT, "result"],
      [tokenType.ASSIGN, "="],
      [tokenType.IDENT, "add"],
      [tokenType.LPAREN, "("],
      [tokenType.IDENT, "five"],
      [tokenType.COMMA, ","],
      [tokenType.IDENT, "ten"],
      [tokenType.RPAREN, ")"],
      [tokenType.SEMICOLON, ";"],
      [tokenType.EOF, ""],
    ];
    const lexer = new Lexer(input);

    for (const [expectedType, expectedLiteral] of tests) {
      const token = lexer.nextToken();

      assertEquals(token.type, expectedType);
      assertEquals(token.literal, expectedLiteral);
    }
  });
});
