import { Obj } from "./Obj.ts";
import { ObjType, objType } from "./objType.ts";

export class Str implements Obj {
  private readonly _value: string;

  public get value(): string {
    return this._value;
  }

  public constructor(value: string) {
    this._value = value;
  }

  public type(): ObjType {
    return objType.STRING;
  }

  public inspect(): string {
    return this._value;
  }
}
