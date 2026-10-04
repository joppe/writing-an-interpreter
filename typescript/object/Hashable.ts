import { HashKey } from "./hashKey.ts";

export interface Hashable {
  hashKey(): HashKey;
}

// deno-lint-ignore no-explicit-any
export function isHashable(obj: any): obj is Hashable {
  return "hashKey" in obj;
}
