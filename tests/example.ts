import {setup} from "../build/index.js";

const add = (a: number, b: number): number => a + b;

void setup("add", async (group) => {
  group.test("1 + 1", async (test) => {
    test.equals(add(1, 1), 2);
  });

  group.test("2 + 2", async (test) => {
    test.equals(add(2, 2), 5);
  });
});
