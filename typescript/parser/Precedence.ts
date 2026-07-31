import { TokenType, tokenType } from "../token/index.ts";

export const PRECEDENCE = {
  LOWEST: 0,
  EQUALS: 1,
  LESSGREATER: 2,
  SUM: 3,
  PRODUCT: 4,
  PREFIX: 5,
  CALL: 6,
} as const;

export type Precedence = (typeof PRECEDENCE)[keyof typeof PRECEDENCE];

export const precedences = new Map<TokenType, Precedence>([
  [tokenType.EQ, PRECEDENCE.EQUALS],
  [tokenType.NOT_EQ, PRECEDENCE.EQUALS],
  [tokenType.LT, PRECEDENCE.LESSGREATER],
  [tokenType.GT, PRECEDENCE.LESSGREATER],
  [tokenType.PLUS, PRECEDENCE.SUM],
  [tokenType.MINUS, PRECEDENCE.SUM],
  [tokenType.SLASH, PRECEDENCE.PRODUCT],
  [tokenType.ASTERISK, PRECEDENCE.PRODUCT],
]);
