import { Token } from "../token/index.ts";
import { BlockStatement } from "./BlockStatement.ts";
import { type Expression } from "./Expression.ts";
import { Identifier } from "./Identifier.ts";

export class FunctionLiteral implements Expression {
  private readonly _token: Token;
  private readonly _parameters: Identifier[];
  private readonly _body: BlockStatement;

  get parameters(): Identifier[] {
    return this._parameters;
  }

  get body(): BlockStatement {
    return this._body;
  }

  public constructor(
    token: Token,
    parameters: Identifier[],
    body: BlockStatement,
  ) {
    this._token = token;
    this._parameters = parameters;
    this._body = body;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }

  public toString(): string {
    const params = this._parameters.map((parameter) => parameter.toString());

    return `${this._token.literal}(${
      params.join(", ")
    }) ${this._body.toString()}`;
  }
}
