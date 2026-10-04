import { Hashable } from "./Hashable.ts";
import { hashKey } from "./hashKey.ts";
import { Obj } from "./Obj.ts";
import { ObjType, objType } from "./objType.ts";

export class Int implements Obj, Hashable {
  private readonly _value: number;

  public get value(): number {
    return this._value;
  }

  public constructor(value: number) {
    this._value = value;
  }

  public type(): ObjType {
    return objType.INTEGER;
  }

  public inspect(): string {
    return `${this._value}`;
  }

  public hashKey(): string {
    return hashKey("int", this._value);
  }
}
