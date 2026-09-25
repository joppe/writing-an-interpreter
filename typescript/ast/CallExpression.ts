import { Token } from "../token/index.ts";
import { type Expression } from "./Expression.ts";

export class CallExpression implements Expression {
  private readonly _token: Token;
  private readonly _fn: Expression;
  private readonly _args: Expression[];

  get fn(): Expression {
    return this._fn;
  }

  get args(): Expression[] {
    return this._args;
  }

  public constructor(
    token: Token,
    func: Expression,
    args: Expression[],
  ) {
    this._token = token;
    this._fn = func;
    this._args = args;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }

  public toString(): string {
    const args = this._args.map((arg) => arg.toString());

    return `${this._fn.toString()}(${args.join(", ")})`;
  }
}
