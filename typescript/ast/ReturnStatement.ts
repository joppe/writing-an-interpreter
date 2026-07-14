import { Token } from "../token/index.ts";
import { Statement } from "./Statement.ts";

export class ReturnStatement implements Statement {
  private readonly _token: Token;
  //private readonly _returnValue: Expression;

  /*/
  get returnValue(): Identifier {
    return this._returnValue;
  }
  /**/

  public constructor(token: Token) {
    this._token = token;
    //this._returnValue = returnValue;
  }

  public tokenLiteral(): string {
    return this._token.literal;
  }
}
