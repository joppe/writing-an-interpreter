import { assertEquals, assertExists, assertInstanceOf } from "@std/assert";

import { Lexer } from "../lexer/index.ts";
import { Parser } from "./Parser.ts";
import {
  Bool,
  ExpressionStatement,
  Identifier,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  ReturnStatement,
} from "../ast/index.ts";

Deno.test("Parser", async (t) => {
  await t.step("Bool Expression", () => {
    const input = "true;";
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 1, parser.errors.join("\n"));

    const statement = program.statements[0];

    assertInstanceOf(statement, ExpressionStatement);

    const literal = statement.expression;

    assertInstanceOf(literal, Bool);
    assertEquals(literal.value, true);
    assertEquals(literal.tokenLiteral(), "true");
  });

  await t.step("Operator Precedence Parsing", () => {
    const tests = [
      [
        "-a * b",
        "((-a) * b)",
      ],
      [
        "!-a",
        "(!(-a))",
      ],
      [
        "a + b + c",
        "((a + b) + c)",
      ],
      [
        "a + b - c",
        "((a + b) - c)",
      ],
      [
        "a * b * c",
        "((a * b) * c)",
      ],
      [
        "a * b / c",
        "((a * b) / c)",
      ],
      [
        "a + b / c",
        "(a + (b / c))",
      ],
      [
        "a + b * c + d / e - f",
        "(((a + (b * c)) + (d / e)) - f)",
      ],
      [
        "3 + 4; -5 * 5",
        "(3 + 4)((-5) * 5)",
      ],
      [
        "5 > 4 == 3 < 4",
        "((5 > 4) == (3 < 4))",
      ],
      [
        "5 < 4 != 3 > 4",
        "((5 < 4) != (3 > 4))",
      ],
      [
        "3 + 4 * 5 == 3 * 1 + 4 * 5",
        "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))",
      ],
      [
        "true",
        "true",
      ],
      [
        "false",
        "false",
      ],
      [
        "3 > 5 == false",
        "((3 > 5) == false)",
      ],
      [
        "3 < 5 == true",
        "((3 < 5) == true)",
      ],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      assertEquals(program.toString(), test[1], parser.errors.join("\n"));
    }
  });

  await t.step("Parsing Infix Expressions", () => {
    const tests = [
      ["5 + 5;", 5, "+", 5],
      ["5 - 5;", 5, "-", 5],
      ["5 * 5;", 5, "*", 5],
      ["5 / 5;", 5, "/", 5],
      ["5 > 5;", 5, ">", 5],
      ["5 < 5;", 5, "<", 5],
      ["5 == 5;", 5, "==", 5],
      ["5 != 5;", 5, "!=", 5],
      ["true == true", true, "==", true],
      ["true != false", true, "!=", false],
      ["false == false", false, "==", false],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      assertExists(program);
      assertEquals(program.statements.length, 1, parser.errors.join("\n"));

      const statement = program.statements[0];

      assertInstanceOf(statement, ExpressionStatement);

      const infix = statement.expression;

      assertInstanceOf(infix, InfixExpression);
      assertEquals(infix.operator, test[2]);

      const left = infix.left;

      if (typeof test[1] === "number") {
        assertInstanceOf(left, IntegerLiteral);
        assertEquals(left.value, test[1]);
      } else if (typeof test[1] === "boolean") {
        assertInstanceOf(left, Bool);
        assertEquals(left.value, test[1]);
      }

      const right = infix.right;

      if (typeof test[3] === "number") {
        assertInstanceOf(right, IntegerLiteral);
        assertEquals(right.value, test[3]);
      } else if (typeof test[3] === "boolean") {
        assertInstanceOf(right, Bool);
        assertEquals(right.value, test[3]);
      }
    }
  });

  await t.step("Parsing Prefix Expressions", () => {
    const tests = [
      ["!5;", "!", 5],
      ["-15;", "-", 15],
      ["!true;", "!", true],
      ["!false;", "!", false],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      assertExists(program);
      assertEquals(program.statements.length, 1, parser.errors.join("\n"));

      const statement = program.statements[0];

      assertInstanceOf(statement, ExpressionStatement);

      const prefix = statement.expression;

      assertInstanceOf(prefix, PrefixExpression);
      assertEquals(prefix.operator, test[1]);

      const literal = prefix.right;

      if (typeof test[1] === "number") {
        assertInstanceOf(literal, IntegerLiteral);
        assertEquals(literal.value, test[2]);
      } else if (typeof test[1] === "boolean") {
        assertInstanceOf(literal, Bool);
        assertEquals(literal.value, test[2]);
      }
    }
  });

  await t.step("Integer Literal Expression", () => {
    const input = "5;";
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 1, parser.errors.join("\n"));

    const statement = program.statements[0];

    assertInstanceOf(statement, ExpressionStatement);

    const literal = statement.expression;

    assertInstanceOf(literal, IntegerLiteral);
    assertEquals(literal.value, 5);
    assertEquals(literal.tokenLiteral(), "5");
  });

  await t.step("IdentifierExpression", () => {
    const input = "foobar;";
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 1, parser.errors.join("\n"));

    const statement = program.statements[0];

    assertInstanceOf(statement, ExpressionStatement);

    const identifier = statement.expression;

    assertInstanceOf(identifier, Identifier);
    assertEquals(identifier.value, "foobar");
    assertEquals(identifier.tokenLiteral(), "foobar");
  });

  await t.step("Return Statements", () => {
    const input = `return 5;
return 10;
return 993322;
`;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 3, parser.errors.join("\n"));

    for (const statement of program.statements) {
      assertInstanceOf(statement, ReturnStatement);
      assertEquals(statement.tokenLiteral(), "return");
    }
  });

  await t.step("Let Statements", () => {
    const input = `let x = 5;
let y = 10;
let foobar = 838383;
`;
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 3, parser.errors.join("\n"));

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
