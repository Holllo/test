import {setup} from "../source/index.js";

await setup("Assertions", async (group) => {
  group.test("equals", async (test) => {
    test.equals(true, true, "boolean");
    test.equals(Math.PI, Math.PI, "number");
    test.equals("A string!", "A string!", "string");
  });

  group.test("true", async (test) => {
    test.true(1 > 0, "logic");
    test.true(new Date() instanceof Date, "instanceof");
  });
});
