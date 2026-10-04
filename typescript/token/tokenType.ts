export const tokenType = {
  ILLEGAL: "ILLEGAL",
  EOF: "EOF",
  // Identifiers + literals
  IDENT: "IDENT", // add, foobar, x, y, ...
  INT: "INT", // 1343456
  // Operators
  ASSIGN: "=",
  PLUS: "+",
  MINUS: "-",
  BANG: "!",
  ASTERISK: "*",
  SLASH: "/",
  EQ: "==",
  NOT_EQ: "!=",
  // Delimiters
  COMMA: ",",
  COLON: ":",
  SEMICOLON: ";",
  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",
  LBRACKET: "[",
  RBRACKET: "]",
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
  STRING: "STRING",
} as const;

export type TokenType = (typeof tokenType)[keyof typeof tokenType];
