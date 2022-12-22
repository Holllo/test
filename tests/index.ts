import {setup} from "../source/index.js";

async function add(a: number, b: number): Promise<number> {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, Math.random() * 1000);
  });

  return a + b;
}

async function subtract(a: number, b: number): Promise<number> {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, Math.random() * 1000);
  });

  return a - b;
}

void setup("add", async (group) => {
  group.test("add(1, 1) = 2", async (test) => {
    test.equals(await add(1, 1), 2);
  });

  group.skip("add(1, 1) = 3", async (test) => {
    test.equals(await add(1, 1), 3);
  });

  group.test("add(1, 1) = 4", async (test) => {
    test.equals(await add(1, 1), 4);
  });
});

void setup("subtract", async (group) => {
  group.test("subtract(1, 1) = 0", async (test) => {
    test.equals(await subtract(1, 1), 0);
  });

  group.skip("subtract(1, 1) = 1", async (test) => {
    test.equals(await subtract(1, 1), 1);
  });

  group.test("subtract(1, 1) = 2", async (test) => {
    test.equals(await subtract(1, 1), 2);
  });
});
