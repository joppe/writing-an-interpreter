import {
  Identifier,
  LetStatement,
  Program,
  ReturnStatement,
  Statement,
} from "../ast/index.ts";
import { Lexer } from "../lexer/index.ts";
import { Token, TokenType, tokenType } from "../token/index.ts";

export class Parser {
  private readonly _lexer: Lexer;
  private _errors: string[];
  private _currentToken: Token;
  private _peekToken: Token;

  get errors(): string[] {
    return this._errors;
  }

  public constructor(lexer: Lexer) {
    this._lexer = lexer;
    this._errors = [];

    this._currentToken = this._lexer.nextToken();
    this._peekToken = this._lexer.nextToken();
  }

  public parseProgram(): Program {
    const statements: Statement[] = [];

    while (this._currentToken.type !== tokenType.EOF) {
      const statement = this.parseStatement();

      if (statement !== null) {
        statements.push(statement);
      }

      this.nextToken();
    }

    const program = new Program(statements);

    return program;
  }

  private parseStatement(): Statement | null {
    switch (this._currentToken.type) {
      case tokenType.LET:
        return this.parseLetStatement();
      case tokenType.RETURN:
        return this.parseReturnStatement();
      default:
        return null;
    }
  }

  private parseReturnStatement(): ReturnStatement | null {
    const token = this._currentToken;

    this.nextToken();

    while (!this.currentTokenIs(tokenType.SEMICOLON)) {
      this.nextToken();
    }

    const statement = new ReturnStatement(token);

    return statement;
  }

  private parseLetStatement(): LetStatement | null {
    const token = this._currentToken;

    if (!this.expectPeek(tokenType.IDENT)) {
      return null;
    }

    const name = new Identifier(this._currentToken, this._currentToken.literal);

    if (!this.expectPeek(tokenType.ASSIGN)) {
      return null;
    }

    while (!this.currentTokenIs(tokenType.SEMICOLON)) {
      this.nextToken();
    }

    const statement = new LetStatement(token, name);

    return statement;
  }

  private currentTokenIs(type: TokenType): boolean {
    return this._currentToken.type === type;
  }

  private peekTokenIs(type: TokenType): boolean {
    return this._peekToken.type === type;
  }

  private expectPeek(type: TokenType): boolean {
    if (this.peekTokenIs(type)) {
      this.nextToken();

      return true;
    }

    this._errors.push(
      `expected next token to be ${tokenType}, got ${this._peekToken.type}`,
    );

    return false;
  }

  private nextToken(): void {
    this._currentToken = this._peekToken;
    this._peekToken = this._lexer.nextToken();
  }
}
