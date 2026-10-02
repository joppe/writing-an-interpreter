import { Token } from "../token/index.ts";
import { type Expression } from "./Expression.ts";

export class IndexExpression implements Expression {
  private readonly _token: Token;
  private readonly _left: Expression;
  private readonly _index: Expression;

  get left(): Expression {
    return this._left;
  }

  get index(): Expression {
    return this._index;
  }

  public constructor(
    token: Token,
    left: Expression,
    index: Expression,
  ) {
    this._token = token;
    this._left = left;
    this._index = index;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }

  public toString(): string {
    return `(${this._left.toString()}[${this._index.toString()}])`;
  }
}
