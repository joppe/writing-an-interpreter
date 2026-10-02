import { Obj } from "./Obj.ts";
import { ObjType, objType } from "./objType.ts";

export class Arr implements Obj {
  private readonly _elements: Obj[];

  public get elements(): Obj[] {
    return this._elements;
  }

  public constructor(elements: Obj[]) {
    this._elements = elements;
  }

  public type(): ObjType {
    return objType.ARRAY;
  }

  public inspect(): string {
    return `[${this._elements.map((element) => element.inspect()).join(", ")}]`;
  }
}
