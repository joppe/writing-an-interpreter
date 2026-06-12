import { TokenType } from "./tokenType.ts";

export class Token {
  private readonly _type: TokenType;
  private readonly _literal: string;

  public get type(): TokenType {
    return this._type;
  }

  public get literal(): string {
    return this._literal;
  }

  public constructor(type: TokenType, literal: string) {
    this._type = type;
    this._literal = literal;
  }

  public toString(): string {
    return this._literal;
  }
}
