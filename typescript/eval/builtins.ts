import { Builtin, Err, Int, Obj, Str } from "../object/index.ts";

const builtins = new Map<string, Builtin>();

builtins.set(
  "len",
  new Builtin((...args: Obj[]): Obj => {
    if (args.length !== 1) {
      return new Err(`wrong number of arguments. got=${args.length}, want=1`);
    }

    const arg = args[0];

    if (arg instanceof Str) {
      return new Int(arg.value.length);
    }

    return new Err(`argument to 'len' not supported, got ${arg.type()}`);
  }),
);

export { builtins };
