import { Token } from "../token/index.ts";
import { type Expression } from "./Expression.ts";

export class HashLiteral implements Expression {
  private readonly _token: Token;
  private readonly _pairs: Map<Expression, Expression>;

  get pairs(): Map<Expression, Expression> {
    return this._pairs;
  }

  public constructor(token: Token, pairs: Map<Expression, Expression>) {
    this._token = token;
    this._pairs = pairs;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }

  public toString(): string {
    return `{${
      Array.from(this._pairs).map(([key, value]) =>
        `${key.toString()}:${value.toString()}`
      ).join(", ")
    }}}`;
  }
}
