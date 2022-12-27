import {type Result, Test, TestContext} from "./test.js";

/** Create a new test group and run it. */
export async function setup(
  name: string,
  fn: (group: Group) => Promise<void>,
  options?: GroupOptions,
): Promise<Group> {
  const group = new Group(name, options);
  await fn(group);
  await group.run();
  return group;
}

/** Options for test groups. */
export type GroupOptions = {
  parallel?: boolean;
};

/** A collection of tests. */
export class Group implements GroupOptions {
  public context: TestContext = new TestContext();
  public parallel: boolean;
  public results: Result[] = [];
  public tests: Test[] = [];

  private _afterAll: (() => Promise<void>) | undefined;
  private _beforeAll: (() => Promise<void>) | undefined;

  constructor(public name: string, options?: GroupOptions) {
    this.parallel = options?.parallel ?? false;
  }

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

    let results: Result[];
    if (this.parallel) {
      results = await Promise.all(
        this.tests.map(async (test) => test.run(this.context)),
      );
    } else {
      results = [];
      for (const test of this.tests) {
        // eslint-disable-next-line no-await-in-loop
        results.push(await test.run(this.context));
      }
    }

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
