import {type Result, Test, TestContext} from "./test.js";

/** Create a new test group and run it. */
export async function setup(
  name: string,
  fn: (group: Group) => Promise<void>,
): Promise<Group> {
  const group = new Group(name);
  await fn(group);
  await group.run();
  return group;
}

/** A collection of tests. */
export class Group {
  public context: TestContext = new TestContext();
  public results: Result[] = [];
  public tests: Test[] = [];

  constructor(public name: string) {}

  /** Create a new test case that doesn't get run. */
  skip(name: Test["name"], fn: Test["fn"]): void {
    this.tests.push(new Test(name, fn, {skip: true}));
  }

  /** Create a new test case. */
  test(name: Test["name"], fn: Test["fn"]): void {
    this.tests.push(new Test(name, fn));
  }

  /** Run all the tests from this group and display their results. */
  async run(): Promise<void> {
    const results = await Promise.all(
      this.tests.map(async (test) => test.run(this.context)),
    );

    console.log(
      `# %c${this.name}`,
      "font-weight: bold; text-decoration: underline;",
    );
    this.results = results;
    for (const result of results) {
      result.display();
    }
  }
}
