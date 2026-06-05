import { Token, tokenType } from "../token/index.ts";
import { lookupIdent } from "../token/tokenType.ts";

const EOF = "\u0000";

export class Lexer {
  private readonly _input: string;

  /**
   * point to the position of char
   */
  private _position: number = 0;

  /**
   * point to the next char
   */
  private _readPosition: number = 0;
  private _char = EOF;

  constructor(input: string) {
    this._input = input;

    this.readChar();
  }

  public nextToken(): Token {
    let token: Token;

    this.skipWhitespace();

    switch (this._char) {
      case "=":
        token = new Token(tokenType.ASSIGN, "=");
        break;
      case ";":
        token = new Token(tokenType.SEMICOLON, ";");
        break;
      case "(":
        token = new Token(tokenType.LPAREN, "(");
        break;
      case ")":
        token = new Token(tokenType.RPAREN, ")");
        break;
      case ",":
        token = new Token(tokenType.COMMA, ",");
        break;
      case "+":
        token = new Token(tokenType.PLUS, "+");
        break;
      case "{":
        token = new Token(tokenType.LBRACE, "{");
        break;
      case "}":
        token = new Token(tokenType.RBRACE, "}");
        break;
      case EOF:
        token = new Token(tokenType.EOF, "");
        break;
      default:
        if (this.isLetter(this._char)) {
          const literal = this.readIdentifier();
          const type = lookupIdent(literal);

          return new Token(type, literal);
        } else if (this.isDigit(this._char)) {
          return new Token(tokenType.INT, this.readNumber());
        } else {
          token = new Token(tokenType.ILLEGAL, this._char);
        }
        break;
    }

    this.readChar();

    return token;
  }

  private readIdentifier(): string {
    const postion = this._position;

    while (this.isLetter(this._char)) {
      this.readChar();
    }

    return this._input.slice(postion, this._position);
  }

  private readNumber(): string {
    const position = this._position;

    while (this.isDigit(this._char)) {
      this.readChar();
    }

    return this._input.slice(position, this._position);
  }

  private isDigit(char: string): boolean {
    return (char >= "0" && this._char <= "9");
  }
  private isLetter(char: string): boolean {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z") ||
      char === "_";
  }

  private skipWhitespace() {
    while (this._char === " " || this._char === "\t" || this._char === "\n") {
      this.readChar();
    }
  }

  private readChar(): void {
    if (this._readPosition >= this._input.length) {
      this._char = EOF;
    } else {
      this._char = this._input[this._readPosition];
    }

    this._position = this._readPosition;
    this._readPosition += 1;
  }
}
