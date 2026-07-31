import { Position } from "../lexer/index.ts";
import { Token } from "../token/index.ts";

export class ParserError {
  private readonly _message: string;
  private readonly _token: Token;
  private readonly _position: Position;

  constructor(message: string, token: Token, position: Position) {
    this._message = message;
    this._token = token;
    this._position = position;
  }

  public toString(): string {
    return `message: ${this._message}; token: ${this._token.toString()}; line: ${this._position.line}; column: ${this._position.column}; offset: ${this._position.offset}`;
  }
}
