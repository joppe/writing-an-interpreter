import {
  EOF,
  isDigit,
  isLetter,
  isWhitespace,
  NEW_LINE,
} from "../char/index.ts";
import { Token, tokenType } from "../token/index.ts";
import { lookupIdent } from "../token/tokenType.ts";
import { Position } from "./Position.ts";

export class Lexer {
  private readonly _input: string;
  private _line: number;
  private _column: number;

  /**
   * point to the position of char
   */
  private _position: number;

  /**
   * point to the next char
   */
  private _readPosition;
  private _char = EOF;

  constructor(input: string) {
    this._input = input;
    this._readPosition = 0;
    this._position = 0;
    this._line = 1;
    this._column = 1;

    this.readChar();
  }

  public getCurrentPosition(): Position {
    return {
      line: this._line,
      column: this._column,
      offset: this._position,
    };
  }

  public nextToken(): Token {
    let token: Token;

    this.skipWhitespace();

    switch (this._char) {
      case "=":
        if (this.peekChar() === "=") {
          const char = this._char;

          this.readChar();

          const literal = `${char}${this._char}`;

          token = new Token(tokenType.EQ, literal);
        } else {
          token = new Token(tokenType.ASSIGN, "=");
        }
        break;
      case "+":
        token = new Token(tokenType.PLUS, "+");
        break;
      case "-":
        token = new Token(tokenType.MINUS, "-");
        break;
      case "!":
        if (this.peekChar() === "=") {
          const char = this._char;

          this.readChar();

          const literal = `${char}${this._char}`;

          token = new Token(tokenType.NOT_EQ, literal);
        } else {
          token = new Token(tokenType.BANG, "!");
        }
        break;
      case "/":
        token = new Token(tokenType.SLASH, "/");
        break;
      case "*":
        token = new Token(tokenType.ASTERISK, "*");
        break;
      case "<":
        token = new Token(tokenType.LT, "<");
        break;
      case ">":
        token = new Token(tokenType.GT, ">");
        break;
      case ";":
        token = new Token(tokenType.SEMICOLON, ";");
        break;
      case ",":
        token = new Token(tokenType.COMMA, ",");
        break;
      case "(":
        token = new Token(tokenType.LPAREN, "(");
        break;
      case ")":
        token = new Token(tokenType.RPAREN, ")");
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
        if (isLetter(this._char)) {
          const literal = this.readIdentifier();
          const type = lookupIdent(literal);

          return new Token(type, literal);
        } else if (isDigit(this._char)) {
          return new Token(tokenType.INT, this.readNumber());
        } else {
          token = new Token(tokenType.ILLEGAL, this._char);
        }
        break;
    }

    this.readChar();

    return token;
  }

  private peekChar(): string {
    if (this._readPosition >= this._input.length) {
      return EOF;
    }

    return this._input[this._readPosition];
  }

  private readIdentifier(): string {
    const postion = this._position;

    while (isLetter(this._char)) {
      this.readChar();
    }

    return this._input.slice(postion, this._position);
  }

  private readNumber(): string {
    const position = this._position;

    while (isDigit(this._char)) {
      this.readChar();
    }

    return this._input.slice(position, this._position);
  }

  private skipWhitespace() {
    while (
      isWhitespace(this._char)
    ) {
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

    if (this._char === NEW_LINE) {
      this._line += 1;
      this._column = 1;
    } else {
      this._column += 1;
    }
  }
}
