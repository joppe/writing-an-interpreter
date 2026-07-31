import { Expression } from "../ast/index.ts";

export type PrefixParserFn = () => Expression | null;

export type InfixParserFn = (expression: Expression) => Expression | null;
