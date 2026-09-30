import { TokenType, tokenType } from "./tokenType.ts";

const keywords: Record<string, TokenType> = {
  "fn": tokenType.FUNCTION,
  "let": tokenType.LET,
  "true": tokenType.TRUE,
  "false": tokenType.FALSE,
  "if": tokenType.IF,
  "else": tokenType.ELSE,
  "return": tokenType.RETURN,
};

export function lookupIdent(ident: string): TokenType {
  if (ident in keywords) {
    return keywords[ident];
  }

  return tokenType.IDENT;
}
