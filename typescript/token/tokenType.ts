export const tokenType = {
  ILLEGAL: "ILLEGAL",
  EOF: "EOF",
  // Identifiers + literals
  IDENT: "IDENT", // add, foobar, x, y, ...
  INT: "INT",
  // 1343456
  // Operators
  ASSIGN: ":",
  PLUS: "+",
  // Delimiters
  COMMA: ",",
  SEMICOLON: ",",
  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",
  // Keywords
  FUNCTION: "FUNCTION",
  LET: "LET",
} as const;

export type TokenType = (typeof tokenType)[keyof typeof tokenType];

const keywords: Record<string, TokenType> = {
  "fn": tokenType.FUNCTION,
  "let": tokenType.LET,
};

export function lookupIdent(ident: string): TokenType {
  if (ident in keywords) {
    return keywords[ident];
  }

  return tokenType.IDENT;
}
