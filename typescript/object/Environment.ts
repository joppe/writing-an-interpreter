import { Obj } from "../object/index.ts";

export class Environment {
  private _store: Map<string, Obj>;

  public constructor() {
    this._store = new Map();
  }

  public get(name: string): Obj | false {
    const value = this._store.get(name);

    if (value === undefined) {
      return false;
    }

    return value;
  }

  public set(name: string, value: Obj): Obj {
    this._store.set(name, value);

    return value;
  }
}
