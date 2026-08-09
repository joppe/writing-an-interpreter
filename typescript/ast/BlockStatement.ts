import { Token } from "../token/index.ts";
import { Statement } from "./Statement.ts";

export class BlockStatement implements Statement {
  private readonly _token: Token;
  private _statements: Statement[];

  get statements(): Statement[] {
    return this._statements;
  }

  public constructor(token: Token, statements: Statement[]) {
    this._token = token;
    this._statements = statements;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }

  public toString(): string {
    let out = "";

    for (const statement of this._statements) {
      out += statement.toString();
    }

    return out;
  }
}
