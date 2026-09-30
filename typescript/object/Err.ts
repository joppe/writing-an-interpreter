import { Obj } from "./Obj.ts";
import { ObjType, objType } from "./objType.ts";

export class Err implements Obj {
  private readonly _message: string;

  public get message(): string {
    return this._message;
  }

  public constructor(value: string) {
    this._message = value;
  }

  public type(): ObjType {
    return objType.ERROR;
  }

  public inspect(): string {
    return `ERROR: ${this._message}`;
  }
}
