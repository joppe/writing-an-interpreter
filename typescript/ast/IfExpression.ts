import { Token } from "../token/index.ts";
import { BlockStatement } from "./BlockStatement.ts";
import { type Expression } from "./Expression.ts";

export class IfExpression implements Expression {
  private readonly _token: Token;
  private readonly _condition: Expression;
  private readonly _consequence: BlockStatement;
  private readonly _alternative: BlockStatement | null;

  get condition(): Expression {
    return this._condition;
  }

  get consequence(): BlockStatement {
    return this._consequence;
  }

  get alternative(): BlockStatement | null {
    return this._alternative;
  }

  public constructor(
    token: Token,
    condition: Expression,
    consequence: BlockStatement,
    alternative: BlockStatement | null,
  ) {
    this._token = token;
    this._condition = condition;
    this._consequence = consequence;
    this._alternative = alternative;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }

  public toString(): string {
    let out =
      `if ${this._condition.toString()} ${this._consequence.toString()}`;

    if (this._alternative) {
      out += ` else ${this._alternative.toString()}`;
    }

    return out;
  }
}
