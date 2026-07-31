import { Token } from "../token/index.ts";
import { Expression } from "./index.ts";
import { Statement } from "./Statement.ts";

export class ReturnStatement implements Statement {
  private readonly _token: Token;
  private readonly _returnValue: Expression | null;

  get returnValue(): Expression | null {
    return this._returnValue;
  }

  public constructor(token: Token, returnValue: Expression | null) {
    this._token = token;
    this._returnValue = returnValue;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }

  public toString(): string {
    let out = `${this.tokenLiteral()} `;

    if (this._returnValue) {
      out = this._returnValue.toString();
    }

    out += ";";

    return out;
  }
}
