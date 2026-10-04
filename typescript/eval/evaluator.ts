import {
  ArrayLiteral,
  BlockStatement,
  Bool as BoolNode,
  CallExpression,
  Expression,
  ExpressionStatement,
  FunctionLiteral,
  HashLiteral,
  Identifier,
  IfExpression,
  IndexExpression,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  Node,
  PrefixExpression,
  Program,
  ReturnStatement,
  Statement,
  StringLiteral,
} from "../ast/index.ts";
import { isHashable } from "../object/Hashable.ts";
import {
  Arr,
  Builtin,
  Environment,
  Err,
  Func,
  Hash,
  HashKey,
  HashPair,
  Int,
  Null,
  type Obj,
  objType,
  ReturnValue,
  Str,
} from "../object/index.ts";
import { builtins } from "./builtins.ts";
import { FALSE, NULL, TRUE } from "./singletons.ts";

export function evaluator(node: Node, env: Environment): Obj {
  if (node instanceof Program) {
    return evalProgram(node.statements, env);
  }

  if (node instanceof BlockStatement) {
    return evalBlockStatement(node, env);
  }

  if (node instanceof FunctionLiteral) {
    const parameters = node.parameters;
    const body = node.body;

    return new Func(parameters, body, env);
  }

  if (node instanceof HashLiteral) {
    return evalHashLiteral(node, env);
  }

  if (node instanceof ArrayLiteral) {
    const elements = evalExpressions(node.elements, env);

    if (elements.length === 1 && isError(elements[0])) {
      return elements[0];
    }

    return new Arr(elements);
  }

  if (node instanceof IndexExpression) {
    const left = evaluator(node.left, env);

    if (isError(left)) {
      return left;
    }

    const index = evaluator(node.index, env);

    if (isError(index)) {
      return index;
    }

    return evalIndexExpression(left, index);
  }

  if (node instanceof CallExpression) {
    const func = evaluator(node.fn, env);

    if (isError(func)) {
      return func;
    }

    const args = evalExpressions(node.args, env);

    if (args.length === 1 && isError(args[0])) {
      return args[0];
    }

    return applyFunction(func, args);
  }

  if (node instanceof ReturnStatement) {
    const value = evaluator(node.returnValue, env);

    if (isError(value)) {
      return value;
    }

    return new ReturnValue(value);
  }

  if (node instanceof LetStatement) {
    const value = evaluator(node.value, env);

    if (isError(value)) {
      return value;
    }

    return env.set(node.name.value, value);
  }

  if (node instanceof Identifier) {
    return evalIdentifier(node, env);
  }

  if (node instanceof IfExpression) {
    return evalIfExpression(node, env);
  }

  if (node instanceof ExpressionStatement) {
    return evaluator(node.expression, env);
  }

  if (node instanceof PrefixExpression) {
    const right = evaluator(node.right, env);

    if (isError(right)) {
      return right;
    }

    return evalPrefixExpression(node.operator, right);
  }

  if (node instanceof InfixExpression) {
    const left = evaluator(node.left, env);

    if (isError(left)) {
      return left;
    }

    const right = evaluator(node.right, env);

    if (isError(right)) {
      return right;
    }

    return evalInfixExpression(node.operator, left, right);
  }

  if (node instanceof IntegerLiteral) {
    return new Int(node.value);
  }

  if (node instanceof StringLiteral) {
    return new Str(node.value);
  }

  if (node instanceof BoolNode) {
    return node.value === true ? TRUE : FALSE;
  }

  return NULL;
}

function evalHashLiteral(node: HashLiteral, env: Environment): Obj {
  const pairs = new Map<HashKey, HashPair>();

  for (const [keyNode, valueNode] of node.pairs.entries()) {
    const key = evaluator(keyNode, env);

    if (isError(key)) {
      return key;
    }

    if (!isHashable(key)) {
      return new Err(`unusable as hash key: ${key.type()}`);
    }

    const value = evaluator(valueNode, env);

    if (isError(value)) {
      return value;
    }

    const hashKey = key.hashKey();
    pairs.set(hashKey, {
      key,
      value,
    });
  }

  return new Hash(pairs);
}

function evalIndexExpression(left: Obj, index: Obj): Obj {
  if (left.type() === objType.ARRAY && index.type() === objType.INTEGER) {
    return evalArrayIndexExpression(left as Arr, index as Int);
  }

  if (left.type() === objType.HASH) {
    return evalHashIndexExpression(left as Hash, index);
  }

  return new Err(`index operator not supported: ${left.type()}`);
}

function evalHashIndexExpression(hash: Hash, index: Obj): Obj {
  if (!isHashable(index)) {
    return new Err(`unusable as hash key: ${index.type()}`);
  }

  const key = index.hashKey();
  const pair = hash.pairs.get(key);

  if (pair === undefined) {
    return NULL;
  }

  return pair.value;
}

function evalArrayIndexExpression(arr: Arr, index: Int): Obj {
  const idx = index.value;
  const max = arr.elements.length;

  if (idx < 0 || idx >= max) {
    return NULL;
  }

  return arr.elements[idx];
}

function applyFunction(func: Obj, args: Obj[]): Obj {
  if (func instanceof Func) {
    const env = extendFunctionEnv(func, args);
    const evaluated = evaluator(func.body, env);

    return unwrapReturnValue(evaluated);
  }

  if (func instanceof Builtin) {
    return func.fn(...args);
  }

  return new Err(`not a function: ${func.type()}`);
}

function extendFunctionEnv(fn: Func, args: Obj[]): Environment {
  const env = fn.env.extend();

  fn.parameters.forEach((parameter, index) => {
    env.set(parameter.value, args[index]);
  });

  return env;
}

function unwrapReturnValue(obj: Obj): Obj {
  if (obj instanceof ReturnValue) {
    return obj.value;
  }

  return obj;
}

function evalExpressions(expressions: Expression[], env: Environment): Obj[] {
  const result: Obj[] = [];

  for (const expression of expressions) {
    const evaluated = evaluator(expression, env);

    if (isError(evaluated)) {
      return [evaluated];
    }

    result.push(evaluated);
  }

  return result;
}

function evalIdentifier(node: Identifier, env: Environment): Obj {
  const value = env.get(node.value);

  if (value !== false) {
    return value;
  }

  const builtin = builtins.get(node.value);

  if (builtin !== undefined) {
    return builtin;
  }

  return new Err(`identifier not found: ${node.value}`);
}

function evalIfExpression(node: IfExpression, env: Environment): Obj {
  const condition = evaluator(node.condition, env);

  if (isError(condition)) {
    return condition;
  }

  if (isTruthy(condition)) {
    return evaluator(node.consequence, env);
  } else if (node.alternative !== null) {
    return evaluator(node.alternative, env);
  }

  return NULL;
}

function evalInfixExpression(
  operator: string,
  left: Obj,
  right: Obj,
): Obj {
  if (left.type() === objType.INTEGER && right.type() === objType.INTEGER) {
    return evalIntegerInfixExpression(operator, left as Int, right as Int);
  }

  if (left.type() === objType.STRING && right.type() === objType.STRING) {
    return evalStringInfixExpression(operator, left as Str, right as Str);
  }

  if (operator === "==") {
    return left === right ? TRUE : FALSE;
  }

  if (operator === "!=") {
    return left !== right ? TRUE : FALSE;
  }

  if (left.type() !== right.type()) {
    return new Err(
      `type mismatch: ${left.type()} ${operator} ${right.type()}`,
    );
  }

  return new Err(
    `unknown operator: ${left.type()} ${operator} ${right.type()}`,
  );
}

function evalStringInfixExpression(
  operator: string,
  left: Str,
  right: Str,
): Obj {
  if (operator !== "+") {
    return new Err(
      `unknown operator: ${left.type()} ${operator} ${right.type()}`,
    );
  }

  const leftValue = left.value;
  const rightValue = right.value;

  return new Str(`${leftValue}${rightValue}`);
}

function evalIntegerInfixExpression(
  operator: string,
  left: Int,
  right: Int,
): Obj {
  switch (operator) {
    case "+":
      return new Int(left.value + right.value);
    case "-":
      return new Int(left.value - right.value);
    case "*":
      return new Int(left.value * right.value);
    case "/":
      return new Int(left.value / right.value);
    case "<":
      return left.value < right.value ? TRUE : FALSE;
    case ">":
      return left.value > right.value ? TRUE : FALSE;
    case "==":
      return left.value === right.value ? TRUE : FALSE;
    case "!=":
      return left.value !== right.value ? TRUE : FALSE;
    default:
      return new Err(
        `unknown operator: ${left.type()} ${operator} ${right.type()}`,
      );
  }
}

function evalPrefixExpression(
  operator: string,
  right: Obj,
): Obj {
  switch (operator) {
    case "!":
      return evalBangOperatorExpression(right);
    case "-":
      return evalMinuPrefixOperatorExpression(right);
    default:
      return new Err(`unknown operator: ${operator}${right.type()}`);
  }
}

function evalMinuPrefixOperatorExpression(right: Obj): Obj {
  if (right.type() !== objType.INTEGER) {
    return new Err(`unknown operator: -${right.type()}`);
  }

  const value = (right as Int).value;

  return new Int(-value);
}

function evalBangOperatorExpression(right: Obj): Obj {
  switch (right) {
    case TRUE:
      return FALSE;
    case FALSE:
      return TRUE;
    default:
      return FALSE;
  }
}

function evalBlockStatement(block: BlockStatement, env: Environment): Obj {
  let result: Obj = NULL;

  for (const statement of block.statements) {
    result = evaluator(statement, env);

    if (
      result.type() === objType.RETURN_VALUE || result.type() === objType.ERROR
    ) {
      return result;
    }
  }

  return result;
}

function evalProgram(statements: Statement[], env: Environment): Obj {
  let result: Obj = new Null();

  for (const statement of statements) {
    result = evaluator(statement, env);

    if (result instanceof ReturnValue) {
      return result.value;
    }

    if (result instanceof Err) {
      return result;
    }
  }

  return result;
}

function isTruthy(condition: Obj): boolean {
  switch (condition) {
    case NULL:
      return false;
    case TRUE:
      return true;
    case FALSE:
      return false;
    default:
      return true;
  }
}

function isError(obj: Obj): boolean {
  return obj.type() === objType.ERROR;
}
