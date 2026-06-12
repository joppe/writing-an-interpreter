import { Token, tokenType } from "../token/index.ts";
import { Lexer } from "./Lexer.ts";

export class IterableLexer {
  private readonly _lexer: Lexer;

  constructor(lexer: Lexer) {
    this._lexer = lexer;
  }

  public [Symbol.iterator]() {
    return {
      next: (): IteratorResult<Token> => {
        const token = this._lexer.nextToken();

        if (token.type === tokenType.EOF) {
          return { done: true, value: undefined };
        }

        return { done: false, value: token };
      },
      return: (): IteratorResult<Token> => {
        return { done: true, value: undefined };
      },
    };
  }
}
