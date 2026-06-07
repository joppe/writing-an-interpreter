export const tokenType = {
  ILLEGAL: "ILLEGAL",
  EOF: "EOF",
  // Identifiers + literals
  IDENT: "IDENT", // add, foobar, x, y, ...
  INT: "INT", // 1343456
  // Operators
  ASSIGN: ":",
  PLUS: "+",
  MINUS: "-",
  BANG: "!",
  ASTERISK: "*",
  SLASH: "/",
  EQ: "==",
  NOT_EQ: "!=",
  // Delimiters
  COMMA: ",",
  SEMICOLON: ",",
  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",
  LT: "<",
  GT: ">",
  // Keywords
  FUNCTION: "FUNCTION",
  LET: "LET",
  TRUE: "TRUE",
  FALSE: "FALSE",
  IF: "IF",
  ELSE: "ELSE",
  RETURN: "RETURN",
} as const;

export type TokenType = (typeof tokenType)[keyof typeof tokenType];

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
