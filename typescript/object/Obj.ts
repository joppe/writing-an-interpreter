import { ObjType } from "./objType.ts";

export interface Obj {
  type(): ObjType;
  inspect(): string;
}
