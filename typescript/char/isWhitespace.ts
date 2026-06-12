import { NEW_LINE, TAB } from "./special.ts";

export function isWhitespace(char: string): boolean {
  return char === " " || char === TAB || char === NEW_LINE;
}
