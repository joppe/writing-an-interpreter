import { assertEquals } from "@std/assert";
import { Identifier, LetStatement, Program } from "./index.ts";
import { Token, tokenType } from "../token/index.ts";

Deno.test("Ast", async (t) => {
  await t.step("toString", () => {
    const program = new Program(
      [
        new LetStatement(
          new Token(tokenType.LET, "let"),
          new Identifier(new Token(tokenType.IDENT, "myVar"), "myVar"),
          new Identifier(
            new Token(tokenType.IDENT, "anotherVar"),
            "anotherVar",
          ),
        ),
      ],
    );

    assertEquals(program.toString(), "let myVar = anotherVar;");
  });
});
