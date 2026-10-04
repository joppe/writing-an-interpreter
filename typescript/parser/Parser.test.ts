import { assertEquals, assertExists, assertInstanceOf } from "@std/assert";

import { Lexer } from "../lexer/index.ts";
import { Parser } from "./Parser.ts";
import {
  ArrayLiteral,
  BlockStatement,
  Bool,
  CallExpression,
  ExpressionStatement,
  FunctionLiteral,
  HashLiteral,
  Identifier,
  IfExpression,
  IndexExpression,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  ReturnStatement,
  StringLiteral,
} from "../ast/index.ts";

Deno.test("Parser", async (t) => {
  await t.step("Hash Literals With Expressions", () => {
    const input = '{"one": 0 + 1, "two": 10 - 8, "three": 15 / 5}';
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 1, parser.errors.join("\n"));

    const statement = program.statements[0];

    assertInstanceOf(statement, ExpressionStatement);

    const expression = statement.expression;

    assertInstanceOf(expression, HashLiteral);
    assertEquals(expression.pairs.size, 3);

    const expected = {
      "one": [0, "+", 1],
      "two": [10, "-", 8],
      "three": [15, "/", 5],
    } as const;

    for (const [key, value] of expression.pairs.entries()) {
      assertInstanceOf(key, StringLiteral);
      assertInstanceOf(value, InfixExpression);
      assertInstanceOf(
        value.left,
        IntegerLiteral,
      );
      assertEquals(
        value.left.value,
        expected[key.toString() as keyof typeof expected][0],
      );
      assertEquals(
        value.operator,
        expected[key.toString() as keyof typeof expected][1],
      );
      assertInstanceOf(
        value.right,
        IntegerLiteral,
      );
      assertEquals(
        value.right.value,
        expected[key.toString() as keyof typeof expected][2],
      );
    }
  });

  await t.step("Empty Hash Literal", () => {
    const input = "{}";
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 1, parser.errors.join("\n"));

    const statement = program.statements[0];

    assertInstanceOf(statement, ExpressionStatement);

    const expression = statement.expression;

    assertInstanceOf(expression, HashLiteral);
    assertEquals(expression.pairs.size, 0);
  });

  await t.step("Hash Literals String Keys", () => {
    const input = '{"one": 1, "two": 2, "three": 3}';
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 1, parser.errors.join("\n"));

    const statement = program.statements[0];

    assertInstanceOf(statement, ExpressionStatement);

    const expression = statement.expression;

    assertInstanceOf(expression, HashLiteral);
    assertEquals(expression.pairs.size, 3);

    const expected = {
      "one": 1,
      "two": 2,
      "three": 3,
    } as const;

    for (const [key, value] of expression.pairs.entries()) {
      assertInstanceOf(key, StringLiteral);
      assertInstanceOf(value, IntegerLiteral);
      assertEquals(
        value.value,
        expected[key.toString() as keyof typeof expected],
      );
    }
  });

  await t.step("Index Expression", () => {
    const input = "myArray[1 + 1]";
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 1, parser.errors.join("\n"));

    const statement = program.statements[0];

    assertInstanceOf(statement, ExpressionStatement);

    const expression = statement.expression;

    assertInstanceOf(expression, IndexExpression);
    assertInstanceOf(expression.left, Identifier);
    assertEquals(expression.left.value, "myArray");

    assertInstanceOf(expression.index, InfixExpression);
    assertInstanceOf(expression.index.left, IntegerLiteral);
    assertEquals(expression.index.left.value, 1);
    assertEquals(expression.index.operator, "+");
    assertInstanceOf(expression.index.right, IntegerLiteral);
    assertEquals(expression.index.right.value, 1);
  });

  await t.step("Array Literal", () => {
    const input = "[1, 2 * 2, 3 + 3]";
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 1, parser.errors.join("\n"));

    const statement = program.statements[0];

    assertInstanceOf(statement, ExpressionStatement);

    const expression = statement.expression;

    assertInstanceOf(expression, ArrayLiteral);
    assertEquals(expression.elements.length, 3);

    assertInstanceOf(expression.elements[0], IntegerLiteral);
    assertEquals(expression.elements[0].value, 1);

    assertInstanceOf(expression.elements[1], InfixExpression);
    assertInstanceOf(expression.elements[1].left, IntegerLiteral);
    assertEquals(expression.elements[1].left.value, 2);
    assertEquals(expression.elements[1].operator, "*");
    assertInstanceOf(expression.elements[1].right, IntegerLiteral);
    assertEquals(expression.elements[1].right.value, 2);

    assertInstanceOf(expression.elements[2], InfixExpression);
    assertInstanceOf(expression.elements[2].left, IntegerLiteral);
    assertEquals(expression.elements[2].left.value, 3);
    assertEquals(expression.elements[2].operator, "+");
    assertInstanceOf(expression.elements[2].right, IntegerLiteral);
    assertEquals(expression.elements[2].right.value, 3);
  });

  await t.step("String Literal Expression", () => {
    const input = '"hello world";';
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 1, parser.errors.join("\n"));

    const statement = program.statements[0];

    assertInstanceOf(statement, ExpressionStatement);

    const expression = statement.expression;

    assertInstanceOf(expression, StringLiteral);
    assertEquals(expression.value, "hello world");
  });

  await t.step("Call Expression Parsing", () => {
    const input = "add(1, 2 * 3, 4 + 5);";
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 1, parser.errors.join("\n"));

    const statement = program.statements[0];

    assertInstanceOf(statement, ExpressionStatement);

    const expression = statement.expression;

    assertInstanceOf(expression, CallExpression);

    const args = expression.args;

    assertEquals(args.length, 3);
    assertInstanceOf(args[0], IntegerLiteral);
    assertInstanceOf(args[1], InfixExpression);
    assertInstanceOf(args[2], InfixExpression);
  });

  await t.step("Function Parameter Parsing", () => {
    const tests = [
      ["fn() {};", []],
      ["fn(x) {};", ["x"]],
      ["fn(x, y, z) {};", ["x", "y", "z"]],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      assertExists(program);
      assertEquals(program.statements.length, 1, parser.errors.join("\n"));

      const statement = program.statements[0];

      assertInstanceOf(statement, ExpressionStatement);

      const expression = statement.expression;

      assertInstanceOf(expression, FunctionLiteral);

      const params = expression.parameters;

      assertEquals(params.length, test[1].length);

      for (let i = 0; i < params.length; i += 1) {
        assertEquals(params[i].value, test[1][i]);
      }
    }
  });

  await t.step("Function Literal", () => {
    const input = "fn(x, y) { x + y; }";
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    assertExists(program);
    assertEquals(program.statements.length, 1, parser.errors.join("\n"));

    const statement = program.statements[0];

    assertInstanceOf(statement, ExpressionStatement);

    const expression = statement.expression;

    assertInstanceOf(expression, FunctionLiteral);

    const params = expression.parameters;

    assertEquals(params.length, 2);
    assertInstanceOf(params[0], Identifier);
    assertEquals(params[0].value, "x");
    assertInstanceOf(params[1], Identifier);
    assertEquals(params[1].value, "y");

    assertEquals(expression.body.statements.length, 1);

    const body = expression.body.statements[0];

    assertInstanceOf(body, ExpressionStatement);
    assertInstanceOf(body.expression, InfixExpression);
    assertInstanceOf(body.expression.left, Identifier);
    assertEquals(body.expression.left.value, "x");
    assertEquals(body.expression.operator.toString(), "+");
    assertInstanceOf(body.expression.right, Identifier);
    assertEquals(body.expression.right.value, "y");
  });

  await t.step("Test Expression", () => {
    const tests = [
      ["if (x < y) { x }", ["x", "<", "y"], "x", null],
      ["if (x < y) { x } else { y }", ["x", "<", "y"], "x", "y"],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      assertExists(program);
      assertEquals(program.statements.length, 1, parser.errors.join("\n"));

      const statement = program.statements[0];

      assertInstanceOf(statement, ExpressionStatement);

      const expression = statement.expression;

      assertInstanceOf(expression, IfExpression);

      const condition = expression.condition;

      assertInstanceOf(condition, InfixExpression);
      assertEquals(condition.left.toString(), test[1][0]);
      assertEquals(condition.operator.toString(), test[1][1]);
      assertEquals(condition.right.toString(), test[1][2]);

      const consequence = expression.consequence;

      assertInstanceOf(consequence, BlockStatement);
      assertEquals(consequence.statements.length, 1);
      assertInstanceOf(consequence.statements[0], ExpressionStatement);
      assertInstanceOf(consequence.statements[0].expression, Identifier);
      assertEquals(consequence.statements[0].expression.value, test[2]);

      const alternative = expression.alternative;

      if (test[3] === null) {
        assertEquals(alternative, null);
      } else {
        assertInstanceOf(alternative, BlockStatement);
        assertInstanceOf(alternative.statements[0], ExpressionStatement);
        assertInstanceOf(alternative.statements[0].expression, Identifier);
        assertEquals(alternative.statements[0].expression.value, test[3]);
      }
    }
  });

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
      [
        "1 + (2 + 3) + 4",
        "((1 + (2 + 3)) + 4)",
      ],
      [
        "(5 + 5) * 2",
        "((5 + 5) * 2)",
      ],
      [
        "2 / (5 + 5)",
        "(2 / (5 + 5))",
      ],
      [
        "-(5 + 5)",
        "(-(5 + 5))",
      ],
      [
        "!(true == true)",
        "(!(true == true))",
      ],
      [
        "a + add(b * c) + d",
        "((a + add((b * c))) + d)",
      ],
      [
        "add(a, b, 1, 2 * 3, 4 + 5, add(6, 7 * 8))",
        "add(a, b, 1, (2 * 3), (4 + 5), add(6, (7 * 8)))",
      ],
      [
        "add(a + b + c * d / f + g)",
        "add((((a + b) + ((c * d) / f)) + g))",
      ],
      [
        "a * [1, 2, 3, 4][b * c] * d",
        "((a * ([1, 2, 3, 4][(b * c)])) * d)",
      ],
      [
        "add(a * b[2], b[1], 2 * [1, 2][1])",
        "add((a * (b[2])), (b[1]), (2 * ([1, 2][1])))",
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
    const tests = [
      ["let x = 5;", "x", 5],
      ["let y = true;", "y", true],
      ["let foobar = y;", "foobar", "y"],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      assertExists(program);
      assertEquals(program.statements.length, 1, parser.errors.join("\n"));

      const statement = program.statements[0];

      assertInstanceOf(statement, LetStatement);

      assertEquals(statement.name.toString(), test[1]);
      assertEquals(statement.value?.toString(), String(test[2]));
    }
  });
});
