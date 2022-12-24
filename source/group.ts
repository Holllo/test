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

  private _afterAll: (() => Promise<void>) | undefined;
  private _beforeAll: (() => Promise<void>) | undefined;

  constructor(public name: string) {}

  /** Set a function to run after all tests have finished. */
  afterAll(fn: Group["_afterAll"]): void {
    this._afterAll = fn;
  }

  /** Set a function to run before all tests begin. */
  beforeAll(fn: Group["_beforeAll"]): void {
    this._beforeAll = fn;
  }

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
    if (this._beforeAll !== undefined) {
      await this._beforeAll();
    }

    const results = await Promise.all(
      this.tests.map(async (test) => test.run(this.context)),
    );

    if (this._afterAll !== undefined) {
      await this._afterAll();
    }

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
