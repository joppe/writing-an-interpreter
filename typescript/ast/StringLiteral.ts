import { Token } from "../token/index.ts";
import { type Expression } from "./Expression.ts";

export class StringLiteral implements Expression {
  private readonly _token: Token;
  private readonly _value: string;

  get value(): string {
    return this._value;
  }

  public constructor(token: Token, value: string) {
    this._token = token;
    this._value = value;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }

  public toString(): string {
    return this._value;
  }
}
