export const objType = {
  INTEGER: "INTEGER",
  BOOLEAN: "BOOLEAN",
  NULL: "NULL",
  RETURN_VALUE: "RETURN_VALUE",
} as const;

export type ObjType = (typeof objType)[keyof typeof objType];
