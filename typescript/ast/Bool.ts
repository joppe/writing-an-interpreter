import { Token } from "../token/index.ts";
import { type Expression } from "./Expression.ts";

export class Bool implements Expression {
  private readonly _token: Token;
  private readonly _value: boolean;

  get value(): boolean {
    return this._value;
  }

  public constructor(token: Token, value: boolean) {
    this._token = token;
    this._value = value;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }

  public toString(): string {
    return String(this._value);
  }
}
