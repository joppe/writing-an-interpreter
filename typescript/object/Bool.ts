import { Hashable } from "./Hashable.ts";
import { hashKey } from "./hashKey.ts";
import { Obj } from "./Obj.ts";
import { ObjType, objType } from "./objType.ts";

export class Bool implements Obj, Hashable {
  private readonly _value: boolean;

  public get value(): boolean {
    return this._value;
  }

  public constructor(value: boolean) {
    this._value = value;
  }

  public type(): ObjType {
    return objType.BOOLEAN;
  }

  public inspect(): string {
    return `${this._value}`;
  }

  public hashKey(): string {
    return hashKey("bool", this._value);
  }
}
