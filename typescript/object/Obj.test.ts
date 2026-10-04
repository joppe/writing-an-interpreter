import { assertEquals, assertNotEquals } from "@std/assert";
import { Str } from "./index.ts";

Deno.test("Obj", async (t) => {
  await t.step("String Hash Key", () => {
    const hello1 = new Str("Hello World");
    const hello2 = new Str("Hello World");
    const diff1 = new Str("My name is Johnny");
    const diff2 = new Str("My name is Johnny");

    assertEquals(hello1.hashKey(), hello2.hashKey());
    assertEquals(diff1.hashKey(), diff2.hashKey());
    assertNotEquals(hello1.hashKey(), diff1.hashKey());
  });
});
