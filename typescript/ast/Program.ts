import { Statement } from "./Statement.ts";

export class Program implements Statement {
  private _statements: Statement[];

  get statements(): Statement[] {
    return this._statements;
  }

  public constructor(statements: Statement[]) {
    this._statements = statements;
  }

  public tokenLiteral(): string {
    if (this._statements.length > 0) {
      return this._statements[0].tokenLiteral();
    }

    return "";
  }

  public toString(): string {
    let out = "";

    for (const statement of this._statements) {
      out += statement.toString();
    }

    return out;
  }
}
