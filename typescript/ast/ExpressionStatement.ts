import { Token } from "../token/index.ts";
import { Expression } from "./Expression.ts";
import { Statement } from "./Statement.ts";

export class ExpressionStatement implements Statement {
  private readonly _token: Token;
  private readonly _expression: Expression | null;

  get expression(): Expression | null {
    return this._expression;
  }

  public constructor(token: Token, expression: Expression | null) {
    this._token = token;
    this._expression = expression;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }

  public toString(): string {
    if (this._expression) {
      return this._expression.toString();
    }

    return "";
  }
}
