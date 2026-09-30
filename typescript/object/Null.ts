import { Obj } from "./Obj.ts";
import { ObjType, objType } from "./objType.ts";

export class Null implements Obj {
  public type(): ObjType {
    return objType.NULL;
  }

  public inspect(): string {
    return "null";
  }
}
