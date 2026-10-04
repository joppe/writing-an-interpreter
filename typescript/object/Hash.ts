import { HashKey } from "./hashKey.ts";
import { type HashPair } from "./HashPair.ts";
import { Obj } from "./Obj.ts";
import { ObjType, objType } from "./objType.ts";

export class Hash implements Obj {
  private readonly _pairs: Map<HashKey, HashPair>;

  public get pairs(): Map<HashKey, HashPair> {
    return this._pairs;
  }

  public constructor(
    pairs: Map<HashKey, HashPair>,
  ) {
    this._pairs = pairs;
  }

  public type(): ObjType {
    return objType.HASH;
  }

  public inspect(): string {
    return `{${
      Array.from(this._pairs.values()).map(({ key, value }) => {
        return `${key}: ${value}`;
      }).join(", ")
    }}`;
  }
}
