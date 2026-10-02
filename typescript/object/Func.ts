import { BlockStatement, Identifier } from "../ast/index.ts";
import { Environment } from "./Environment.ts";
import { Obj } from "./Obj.ts";
import { ObjType, objType } from "./objType.ts";

export class Func implements Obj {
  private readonly _parameters: Identifier[];
  private readonly _body: BlockStatement;
  private readonly _env: Environment;

  public get parameters(): Identifier[] {
    return this._parameters;
  }

  public get body(): BlockStatement {
    return this._body;
  }

  public get env(): Environment {
    return this._env;
  }

  public constructor(
    parameters: Identifier[],
    body: BlockStatement,
    env: Environment,
  ) {
    this._parameters = parameters;
    this._body = body;
    this._env = env;
  }

  public type(): ObjType {
    return objType.FUNCTION;
  }

  public inspect(): string {
    return `fn(${
      this._parameters.map((parameter) => parameter.toString()).join(", ")
    }) {
${this._body.toString()}
}`;
  }
}
