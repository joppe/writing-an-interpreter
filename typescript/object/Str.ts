import { Hashable } from "./Hashable.ts";
import { hashKey } from "./hashKey.ts";
import { Obj } from "./Obj.ts";
import { ObjType, objType } from "./objType.ts";

export class Str implements Obj, Hashable {
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

  hashKey(): string {
    return hashKey("str", this._value);
  }
}
