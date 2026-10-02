import { Obj } from "../object/index.ts";

export class Environment {
  private readonly _store: Map<string, Obj>;
  private readonly _outer: Environment | undefined;

  public constructor(outer?: Environment) {
    this._store = new Map();
    this._outer = outer;
  }

  public get(name: string): Obj | false {
    const value = this._store.get(name);

    if (value !== undefined) {
      return value;
    }

    if (this._outer !== undefined) {
      return this._outer.get(name);
    }

    return false;
  }

  public set(name: string, value: Obj): Obj {
    this._store.set(name, value);

    return value;
  }

  public extend(): Environment {
    return new Environment(this);
  }
}
