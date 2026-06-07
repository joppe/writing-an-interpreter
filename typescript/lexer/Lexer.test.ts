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

!-/*5;
5 < 10 > 5;

if (5 < 10) {
  return true;
} else {
  return false;
}

10 == 10;
10 != 9;
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
      [tokenType.BANG, "!"],
      [tokenType.MINUS, "-"],
      [tokenType.SLASH, "/"],
      [tokenType.ASTERISK, "*"],
      [tokenType.INT, "5"],
      [tokenType.SEMICOLON, ";"],
      [tokenType.INT, "5"],
      [tokenType.LT, "<"],
      [tokenType.INT, "10"],
      [tokenType.GT, ">"],
      [tokenType.INT, "5"],
      [tokenType.SEMICOLON, ";"],
      [tokenType.IF, "if"],
      [tokenType.LPAREN, "("],
      [tokenType.INT, "5"],
      [tokenType.LT, "<"],
      [tokenType.INT, "10"],
      [tokenType.RPAREN, ")"],
      [tokenType.LBRACE, "{"],
      [tokenType.RETURN, "return"],
      [tokenType.TRUE, "true"],
      [tokenType.SEMICOLON, ";"],
      [tokenType.RBRACE, "}"],
      [tokenType.ELSE, "else"],
      [tokenType.LBRACE, "{"],
      [tokenType.RETURN, "return"],
      [tokenType.FALSE, "false"],
      [tokenType.SEMICOLON, ";"],
      [tokenType.RBRACE, "}"],
      [tokenType.INT, "10"],
      [tokenType.EQ, "=="],
      [tokenType.INT, "10"],
      [tokenType.SEMICOLON, ";"],
      [tokenType.INT, "10"],
      [tokenType.NOT_EQ, "!="],
      [tokenType.INT, "9"],
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
