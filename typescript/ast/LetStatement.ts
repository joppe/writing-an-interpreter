import { Token } from "../token/index.ts";
import { Expression } from "./Expression.ts";
import { Identifier } from "./Identifier.ts";
import { Statement } from "./Statement.ts";

export class LetStatement implements Statement {
  private readonly _token: Token;
  private readonly _name: Identifier;
  private readonly _value: Expression | null;

  get name(): Identifier {
    return this._name;
  }

  get value(): Expression | null {
    return this._value;
  }

  public constructor(token: Token, name: Identifier, value: Expression | null) {
    this._token = token;
    this._name = name;
    this._value = value;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }

  public toString(): string {
    let out = `${this.tokenLiteral()} ${this._name.toString()} = `;

    if (this._value !== null) {
      out += this._value.toString();
    }

    out += ";";

    return out;
  }
}
