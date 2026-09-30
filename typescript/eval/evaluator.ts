import {
  BlockStatement,
  Bool as BoolNode,
  ExpressionStatement,
  IfExpression,
  InfixExpression,
  IntegerLiteral,
  Node,
  PrefixExpression,
  Program,
  ReturnStatement,
  Statement,
} from "../ast/index.ts";
import {
  Bool,
  Err,
  Int,
  Null,
  type Obj,
  objType,
  ReturnValue,
} from "../object/index.ts";

const NULL = new Null();
const TRUE = new Bool(true);
const FALSE = new Bool(false);

export function evaluator(node: Node): Obj {
  if (node instanceof Program) {
    return evalProgram(node.statements);
  }

  if (node instanceof BlockStatement) {
    return evalBlockStatement(node);
  }

  if (node instanceof ReturnStatement) {
    const value = evaluator(node.returnValue);

    if (isError(value)) {
      return value;
    }

    return new ReturnValue(value);
  }

  if (node instanceof IfExpression) {
    return evalIfExpression(node);
  }

  if (node instanceof ExpressionStatement) {
    return evaluator(node.expression);
  }

  if (node instanceof PrefixExpression) {
    const right = evaluator(node.right);

    if (isError(right)) {
      return right;
    }

    return evalPrefixExpression(node.operator, right);
  }

  if (node instanceof InfixExpression) {
    const left = evaluator(node.left);

    if (isError(left)) {
      return left;
    }

    const right = evaluator(node.right);

    if (isError(right)) {
      return right;
    }

    return evalInfixExpression(node.operator, left, right);
  }

  if (node instanceof IntegerLiteral) {
    return new Int(node.value);
  }

  if (node instanceof BoolNode) {
    return node.value === true ? TRUE : FALSE;
  }

  return NULL;
}

function evalIfExpression(node: IfExpression): Obj {
  const condition = evaluator(node.condition);

  if (isError(condition)) {
    return condition;
  }

  if (isTruthy(condition)) {
    return evaluator(node.consequence);
  } else if (node.alternative !== null) {
    return evaluator(node.alternative);
  }

  return NULL;
}

function evalInfixExpression(operator: string, left: Obj, right: Obj): Obj {
  if (left.type() === objType.INTEGER && right.type() === objType.INTEGER) {
    return evalIntegerInfixExpression(operator, left as Int, right as Int);
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

function evalPrefixExpression(operator: string, right: Obj): Obj {
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

function evalBlockStatement(block: BlockStatement): Obj {
  let result: Obj = NULL;

  for (const statement of block.statements) {
    result = evaluator(statement);

    if (
      result.type() === objType.RETURN_VALUE || result.type() === objType.ERROR
    ) {
      return result;
    }
  }

  return result;
}

function evalProgram(statements: Statement[]): Obj {
  let result: Obj = new Null();

  for (const statement of statements) {
    result = evaluator(statement);

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
