import { Arr, Builtin, Err, Int, Obj, Str } from "../object/index.ts";
import { NULL } from "./singletons.ts";

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

    if (arg instanceof Arr) {
      return new Int(arg.elements.length);
    }

    return new Err(`argument to 'len' not supported, got ${arg.type()}`);
  }),
);

builtins.set(
  "first",
  new Builtin((...args: Obj[]): Obj => {
    if (args.length !== 1) {
      return new Err(`wrong number of arguments. got=${args.length}, want=1`);
    }

    const arg = args[0];

    if (!(arg instanceof Arr)) {
      return new Err(`argument to 'first' must be ARRAY, got=${arg.type()}`);
    }

    if (arg.elements.length > 0) {
      return arg.elements[0];
    }

    return NULL;
  }),
);

builtins.set(
  "last",
  new Builtin((...args: Obj[]): Obj => {
    if (args.length !== 1) {
      return new Err(`wrong number of arguments. got=${args.length}, want=1`);
    }

    const arr = args[0];

    if (!(arr instanceof Arr)) {
      return new Err(`argument to 'first' must be ARRAY, got=${arr.type()}`);
    }

    const length = arr.elements.length;

    if (length > 0) {
      return arr.elements[length - 1];
    }

    return NULL;
  }),
);

builtins.set(
  "rest",
  new Builtin((...args: Obj[]): Obj => {
    if (args.length !== 1) {
      return new Err(`wrong number of arguments. got=${args.length}, want=1`);
    }

    const arr = args[0];

    if (!(arr instanceof Arr)) {
      return new Err(`argument to 'first' must be ARRAY, got=${arr.type()}`);
    }

    const length = arr.elements.length;

    if (length > 0) {
      return new Arr(arr.elements.slice(1));
    }

    return NULL;
  }),
);

builtins.set(
  "push",
  new Builtin((...args: Obj[]): Obj => {
    if (args.length !== 2) {
      return new Err(`wrong number of arguments. got=${args.length}, want=2`);
    }

    const arr = args[0];

    if (!(arr instanceof Arr)) {
      return new Err(`argument to 'first' must be ARRAY, got=${arr.type()}`);
    }

    return new Arr(arr.elements.concat(args[1]));
  }),
);

builtins.set(
  "puts",
  new Builtin((...args: Obj[]): Obj => {
    const encoder = new TextEncoder();

    for (const arg of args) {
      Deno.stdout.writeSync(encoder.encode(`${arg.inspect()}\n`));
    }

    return NULL;
  }),
);

export { builtins };
