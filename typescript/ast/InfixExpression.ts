import { Token } from "../token/index.ts";
import { type Expression } from "./Expression.ts";

export class InfixExpression implements Expression {
  private readonly _token: Token;
  private readonly _operator: string;
  private readonly _left: Expression;
  private readonly _right: Expression;

  get operator(): string {
    return this._operator;
  }

  get left(): Expression {
    return this._left;
  }

  get right(): Expression {
    return this._right;
  }

  public constructor(
    token: Token,
    operator: string,
    left: Expression,
    right: Expression,
  ) {
    this._token = token;
    this._operator = operator;
    this._left = left;
    this._right = right;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }

  public toString(): string {
    return `(${this._left.toString()} ${this._operator} ${this._right.toString()})`;
  }
}
