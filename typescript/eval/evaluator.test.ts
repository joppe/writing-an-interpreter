import { assertEquals, assertInstanceOf } from "@std/assert";
import { Lexer } from "../lexer/index.ts";
import { Parser } from "../parser/index.ts";
import {
  Bool,
  Environment,
  Err,
  Func,
  Int,
  Null,
  objType,
  Str,
} from "../object/index.ts";
import { evaluator } from "./index.ts";

Deno.test("evaluator", async (t) => {
  await t.step("Builtin Functions", () => {
    const tests = [
      [`len("")`, 0],
      [`len("four")`, 4],
      [`len("hello world")`, 11],
      [`len(1)`, "argument to 'len' not supported, got INTEGER"],
      [`len("one", "two")`, "wrong number of arguments. got=2, want=1"],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      const env = new Environment();
      const result = evaluator(program, env);

      if (result.type() === objType.INTEGER) {
        assertInstanceOf(result, Int, result.inspect());
        assertEquals(result.type(), objType.INTEGER);
        assertEquals(result.value, test[1] as number);
      } else {
        assertInstanceOf(result, Err, result.inspect());
        assertEquals(result.type(), objType.ERROR);
        assertEquals(result.message, test[1] as string);
      }
    }
  });

  await t.step("String Concatenation", () => {
    const input = '"Hello" + " " + "World!"';
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    const env = new Environment();
    const result = evaluator(program, env);

    assertInstanceOf(result, Str);
    assertEquals(result.value, "Hello World!");
  });

  await t.step("String Literal", () => {
    const input = '"Hello World!"';
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    const env = new Environment();
    const result = evaluator(program, env);

    assertInstanceOf(result, Str);
    assertEquals(result.value, "Hello World!");
  });

  await t.step("Function Application", () => {
    const tests = [
      ["let identity = fn(x) { x; }; identity(5);", 5],
      ["let identity = fn(x) { return x; }; identity(5);", 5],
      ["let double = fn(x) { x * 2; }; double(5);", 10],
      ["let add = fn(x, y) { x + y; }; add(5, 5);", 10],
      ["let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));", 20],
      ["fn(x) { x; }(5)", 5],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      const env = new Environment();
      const result = evaluator(program, env);

      assertInstanceOf(result, Int, result.inspect());
      assertEquals(result.type(), objType.INTEGER);
      assertEquals(result.value, test[1]);
    }
  });

  await t.step("Function Object", () => {
    const input = "fn(x) { x + 2; };";
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();

    const env = new Environment();
    const result = evaluator(program, env);

    assertInstanceOf(result, Func);
    assertEquals(result.type(), objType.FUNCTION, result.inspect());
    assertEquals(result.parameters.length, 1);
    assertEquals(result.parameters[0].toString(), "x");
    assertEquals(result.body.toString(), "(x + 2)");
  });

  await t.step("Let Statements", () => {
    const tests = [
      ["let a = 5; a;", 5],
      ["let a = 5 * 5; a;", 25],
      ["let a = 5; let b = a; b;", 5],
      ["let a = 5; let b = a; let c = a + b + 5; c;", 15],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      const env = new Environment();
      const result = evaluator(program, env);

      assertInstanceOf(result, Int);
      assertEquals(result.type(), objType.INTEGER);
      assertEquals(result.value, test[1]);
    }
  });

  await t.step("Error Handling", () => {
    const tests = [
      [
        "5 + true;",
        "type mismatch: INTEGER + BOOLEAN",
      ],
      [
        "5 + true; 5;",
        "type mismatch: INTEGER + BOOLEAN",
      ],
      [
        "-true",
        "unknown operator: -BOOLEAN",
      ],
      [
        "true + false;",
        "unknown operator: BOOLEAN + BOOLEAN",
      ],
      [
        "5; true + false; 5",
        "unknown operator: BOOLEAN + BOOLEAN",
      ],
      [
        "if (10 > 1) [ true + false; ]",
        "unknown operator: BOOLEAN + BOOLEAN",
      ],
      [
        `if (10 > 1) {
  if (10 > 1) { return true + false; }
  return 1;
}`,
        "unknown operator: BOOLEAN + BOOLEAN",
      ],
      ["foobar", "identifier not found: foobar"],
      [
        '"Hello" - "World"',
        "unknown operator: STRING - STRING",
      ],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      const env = new Environment();
      const result = evaluator(program, env);

      assertInstanceOf(result, Err);
      assertEquals(result.type(), objType.ERROR);
      assertEquals(result.message, test[1]);
    }
  });

  await t.step("Evaluate Return Statements", () => {
    const tests = [
      ["return 10;", 10],
      ["return 10; 9;", 10],
      ["return 2 * 5; 9;", 10],
      ["9; return 2 * 5; 9;", 10],
      [
        `if (10 > 1) {
if (10 > 1) {
return 10;
}
return 1;
}`,
        10,
      ],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      const env = new Environment();
      const result = evaluator(program, env);

      assertInstanceOf(result, Int);
      assertEquals(result.type(), objType.INTEGER);
      assertEquals(result.value, test[1]);
    }
  });

  await t.step("Evaluate Boolean Expression", () => {
    const tests = [
      ["if (true) { 10 }", 10],
      ["if (false) { 10 }", null],
      ["if (1) { 10 }", 10],
      ["if (1 < 2) { 10 }", 10],
      ["if (1 > 2) { 10 }", null],
      ["if (1 > 2) { 10 } else { 20 }", 20],
      ["if (1 < 2) { 10 } else { 20 ]", 10],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      const env = new Environment();
      const result = evaluator(program, env);

      if (test[1] === null) {
        assertInstanceOf(result, Null);
        assertEquals(result.type(), objType.NULL);
      } else {
        assertInstanceOf(result, Int);
        assertEquals(result.type(), objType.INTEGER);
        assertEquals(result.value, test[1]);
      }
    }
  });

  await t.step("Bang Operator", () => {
    const tests = [
      ["!true", false],
      ["!false", true],
      ["!5", false],
      ["!!true", true],
      ["!!false", false],
      ["!!5", true],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      const env = new Environment();
      const result = evaluator(program, env);

      assertInstanceOf(result, Bool);
      assertEquals(result.type(), objType.BOOLEAN);
      assertEquals(result.value, test[1]);
    }
  });

  await t.step("Evaluate Boolean Expression", () => {
    const tests = [
      ["true", true],
      ["false", false],
      ["1 < 2", true],
      ["1 > 2", false],
      ["1 < 1", false],
      ["1 > 1", false],
      ["1 == 1", true],
      ["1 != 1", false],
      ["1 == 2", false],
      ["1 != 2", true],
      ["true == true", true],
      ["false == false", true],
      ["true == false", false],
      ["true != false", true],
      ["false != true", true],
      ["(1 < 2) == true", true],
      ["(1 < 2) == false", false],
      ["(1 > 2) == true", false],
      ["(1 > 2) == false", true],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      const env = new Environment();
      const result = evaluator(program, env);

      assertInstanceOf(result, Bool);
      assertEquals(result.type(), objType.BOOLEAN);
      assertEquals(result.value, test[1]);
    }
  });

  await t.step("Evaluate Integer Expression", () => {
    const tests = [
      ["5", 5],
      ["10", 10],
      ["-5", -5],
      ["-10", -10],
      ["5 + 5 + 5 + 5 - 10", 10],
      ["2 * 2 * 2 * 2 * 2", 32],
      ["-50 + 100 + -50", 0],
      ["5 * 2 + 10", 20],
      ["5 + 2 * 10", 25],
      ["20 + 2 * -10", 0],
      ["50 / 2 * 2 + 10", 60],
      ["2 * (5 + 10)", 30],
      ["3 * 3 * 3 + 10", 37],
      ["3 * (3 * 3) + 10", 37],
      ["(5 + 10 * 2 + 15 / 3) * 2 + -10", 50],
    ] as const;

    for (const test of tests) {
      const lexer = new Lexer(test[0]);
      const parser = new Parser(lexer);
      const program = parser.parseProgram();

      const env = new Environment();
      const result = evaluator(program, env);

      assertInstanceOf(result, Int);
      assertEquals(result.type(), objType.INTEGER);
      assertEquals(result.value, test[1]);
    }
  });
});
