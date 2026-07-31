import {
  Expression,
  ExpressionStatement,
  Identifier,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  Program,
  ReturnStatement,
  Statement,
} from "../ast/index.ts";
import { Lexer } from "../lexer/index.ts";
import { Token, TokenType, tokenType } from "../token/index.ts";
import { ParserError } from "./ParserError.ts";
import { PRECEDENCE, Precedence, precedences } from "./Precedence.ts";
import { InfixParserFn, PrefixParserFn } from "./types.ts";

export class Parser {
  private readonly _lexer: Lexer;
  private readonly _errors: ParserError[];
  private readonly _prefixParserFns: Map<TokenType, PrefixParserFn>;
  private readonly _infixParserFns: Map<TokenType, InfixParserFn>;
  private _currentToken: Token;
  private _peekToken: Token;

  get errors(): string[] {
    return this._errors.map((error) => error.toString());
  }

  public constructor(lexer: Lexer) {
    this._lexer = lexer;
    this._errors = [];
    this._prefixParserFns = new Map();
    this._infixParserFns = new Map();

    this._currentToken = this._lexer.nextToken();
    this._peekToken = this._lexer.nextToken();

    this.registerPrefix(tokenType.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(tokenType.INT, this.parseIntegerLiteral.bind(this));
    this.registerPrefix(tokenType.BANG, this.parsePrefixExpression.bind(this));
    this.registerPrefix(tokenType.MINUS, this.parsePrefixExpression.bind(this));

    this.registerInfix(tokenType.PLUS, this.parseInfixExpression.bind(this));
    this.registerInfix(tokenType.MINUS, this.parseInfixExpression.bind(this));
    this.registerInfix(tokenType.SLASH, this.parseInfixExpression.bind(this));
    this.registerInfix(
      tokenType.ASTERISK,
      this.parseInfixExpression.bind(this),
    );
    this.registerInfix(tokenType.EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(tokenType.NOT_EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(tokenType.LT, this.parseInfixExpression.bind(this));
    this.registerInfix(tokenType.GT, this.parseInfixExpression.bind(this));
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
        return this.parseExpressionStatement();
    }
  }

  private parseInfixExpression(left: Expression): InfixExpression | null {
    const token = this._currentToken;
    const operator = this._currentToken.literal;
    const precedence = this.currentPrecedence();

    this.nextToken();

    const right = this.parseExpression(precedence);

    if (right === null) {
      return null;
    }

    return new InfixExpression(token, operator, left, right);
  }

  private parsePrefixExpression(): PrefixExpression | null {
    const token = this._currentToken;
    const operator = this._currentToken.literal;

    this.nextToken();

    const right = this.parseExpression(PRECEDENCE.PREFIX);

    if (right === null) {
      return null;
    }

    return new PrefixExpression(token, operator, right);
  }

  private parseIntegerLiteral(): IntegerLiteral | null {
    const literal = this._currentToken;
    const value = parseInt(this._currentToken.literal, 10);

    if (Number.isNaN(value)) {
      this._errors.push(
        new ParserError(
          `could not parse ${this._currentToken.literal} as integer`,
          this._currentToken,
          this._lexer.getCurrentPosition(),
        ),
      );
      return null;
    }

    return new IntegerLiteral(literal, value);
  }

  private parseIdentifier(): Identifier {
    return new Identifier(
      this._currentToken,
      this._currentToken.literal,
    );
  }

  private parseExpressionStatement(): ExpressionStatement {
    const token = this._currentToken;
    const expression = this.parseExpression(PRECEDENCE.LOWEST);

    // semicolon is optional
    if (this.peekTokenIs(tokenType.SEMICOLON)) {
      this.nextToken();
    }

    return new ExpressionStatement(token, expression);
  }

  private parseExpression(precedence: Precedence): Expression | null {
    const prefix = this._prefixParserFns.get(this._currentToken.type);

    if (prefix === undefined) {
      this._errors.push(
        new ParserError(
          `no prefix parse function for ${this._currentToken.type} found`,
          this._currentToken,
          this._lexer.getCurrentPosition(),
        ),
      );

      return null;
    }

    let left = prefix();

    if (left === null) {
      return null;
    }

    while (
      !this.peekTokenIs(tokenType.SEMICOLON) &&
      precedence < this.peekPrecedence()
    ) {
      const infix = this._infixParserFns.get(this._peekToken.type);

      if (infix === undefined) {
        return left;
      }

      this.nextToken();

      left = infix(left);

      if (left === null) {
        return null;
      }
    }

    return left;
  }

  private parseReturnStatement(): ReturnStatement {
    const token = this._currentToken;

    this.nextToken();

    while (!this.currentTokenIs(tokenType.SEMICOLON)) {
      this.nextToken();
    }

    return new ReturnStatement(token, null);
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

    return new LetStatement(token, name, null);
  }

  private peekPrecedence(): Precedence {
    const precedence = precedences.get(this._peekToken.type);

    if (precedence === undefined) {
      return PRECEDENCE.LOWEST;
    }

    return precedence;
  }

  private currentPrecedence(): Precedence {
    const precedence = precedences.get(this._currentToken.type);

    if (precedence === undefined) {
      return PRECEDENCE.LOWEST;
    }

    return precedence;
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
      new ParserError(
        `expected next token to be ${tokenType}, got ${this._peekToken.type}`,
        this._currentToken,
        this._lexer.getCurrentPosition(),
      ),
    );

    return false;
  }

  private nextToken(): void {
    this._currentToken = this._peekToken;
    this._peekToken = this._lexer.nextToken();
  }

  private registerPrefix(tokenType: TokenType, fn: PrefixParserFn): void {
    this._prefixParserFns.set(tokenType, fn);
  }

  private registerInfix(tokenType: TokenType, fn: InfixParserFn): void {
    this._infixParserFns.set(tokenType, fn);
  }
}
