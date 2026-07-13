import { Token } from "../token/index.ts";
import { Identifier } from "./Identifier.ts";
import { Statement } from "./Statement.ts";

export class LetStatement implements Statement {
  private readonly _token: Token;
  private readonly _name: Identifier;
  //private readonly _value: Expression;

  get name(): Identifier {
    return this._name;
  }

  public constructor(token: Token, name: Identifier) {
    this._token = token;
    this._name = name;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }
}
