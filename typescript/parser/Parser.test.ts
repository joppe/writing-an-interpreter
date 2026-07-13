import { assertEquals, assertExists, assertInstanceOf } from "@std/assert";

import { Lexer } from "../lexer/index.ts";
import { Parser } from "./Parser.ts";
import { LetStatement } from "../ast/index.ts";

Deno.test("Parser", async (t) => {
  await t.step("LetStatement", () => {
    const input = `let x = 5;
let y = 10;
let foobar = 838383;
`;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 3);

    const names = ["x", "y", "foobar"];

    names.forEach((name, index) => {
      const statement = program.statements[index];

      assertEquals(statement.tokenLiteral(), "let");
      assertInstanceOf(statement, LetStatement);
      assertEquals(statement.name.value, name);
      assertEquals(statement.name.tokenLiteral(), name);
    });
  });
});
