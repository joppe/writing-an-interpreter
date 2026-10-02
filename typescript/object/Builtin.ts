import { Obj } from "./Obj.ts";
import { ObjType, objType } from "./objType.ts";

export type BuiltinFunction = (...args: Obj[]) => Obj;

export class Builtin implements Obj {
  private readonly _fn: BuiltinFunction;

  public get fn(): BuiltinFunction {
    return this._fn;
  }

  public constructor(fn: BuiltinFunction) {
    this._fn = fn;
  }

  public type(): ObjType {
    return objType.BUILTIN;
  }

  public inspect(): string {
    return "builtin function";
  }
}
