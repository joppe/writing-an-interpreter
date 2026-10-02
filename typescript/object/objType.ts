export const objType = {
  INTEGER: "INTEGER",
  BOOLEAN: "BOOLEAN",
  NULL: "NULL",
  RETURN_VALUE: "RETURN_VALUE",
  ERROR: "ERROR",
  FUNCTION: "FUNCTION",
  STRING: "STRING",
} as const;

export type ObjType = (typeof objType)[keyof typeof objType];
