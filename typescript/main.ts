import os from "node:os";
import { sprintf } from "@std/fmt/printf";
import { repl } from "./repl/repl.ts";

const user = os.userInfo({ encoding: "buffer" });
const decoder = new TextDecoder();
const encoder = new TextEncoder();

const username = decoder.decode(user.username);

await Deno.stdout.write(
  encoder.encode(
    sprintf("Hello %s! This is the Monkey programming language!\n", username),
  ),
);

await Deno.stdout.write(
  encoder.encode(
    sprintf("Feel free to type in commands\n"),
  ),
);

repl();
