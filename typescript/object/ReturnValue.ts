import { Obj } from "./Obj.ts";
import { ObjType, objType } from "./objType.ts";

export class ReturnValue implements Obj {
  private readonly _value: Obj;

  public get value(): Obj {
    return this._value;
  }

  public constructor(value: Obj) {
    this._value = value;
  }

  public type(): ObjType {
    return objType.RETURN_VALUE;
  }

  public inspect(): string {
    return this._value.inspect();
  }
}
