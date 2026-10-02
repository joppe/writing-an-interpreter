import { Token } from "../token/index.ts";
import { type Expression } from "./Expression.ts";

export class ArrayLiteral implements Expression {
  private readonly _token: Token;
  private readonly _elements: Expression[];

  get elements(): Expression[] {
    return this._elements;
  }

  public constructor(token: Token, elements: Expression[]) {
    this._token = token;
    this._elements = elements;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }

  public toString(): string {
    return `[${this.elements.map((element) => element.toString()).join(", ")}]`;
  }
}
