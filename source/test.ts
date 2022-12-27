export class AssertionError extends Error {
  public readonly actual: string;
  public readonly expected: string;
  public readonly title: string | undefined;

  constructor(message: string, actual: any, expected: any, title?: string) {
    super(message);

    this.actual = JSON.stringify(actual);
    this.expected = JSON.stringify(expected);
    this.title = title;
  }
}

/** Test execution context with assertions. */
export class TestContext {
  /** Assert strict equality with `===`. */
  equals<T>(actual: T, expected: T, title?: string): void {
    if (actual === expected) {
      return;
    }

    throw new AssertionError(
      "Failed equals assertion",
      actual,
      expected,
      title,
    );
  }

  /** Assert that the value is false. */
  false(actual: boolean, title?: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
    if (actual === false) {
      return;
    }

    throw new AssertionError("Failed false assertion", actual, false, title);
  }

  /** Assert that the value is true. */
  true(actual: boolean, title?: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
    if (actual === true) {
      return;
    }

    throw new AssertionError("Failed true assertion", actual, true, title);
  }
}

/** Special options for test cases. */
export type TestOptions = {
  skip?: boolean;
};

/** A test case. */
export class Test {
  constructor(
    public name: string,
    public fn: (test: TestContext) => Promise<void>,
    public options?: TestOptions,
  ) {}

  /** Run the test and return its result. */
  async run(test: TestContext): Promise<Result> {
    const data: ResultData = {
      duration: undefined,
      error: undefined,
      name: this.name,
      status: "unknown",
    };

    const start = performance.now();
    try {
      if (this.options?.skip) {
        data.status = "skipped";
      } else {
        await this.fn(test);
        data.duration = performance.now() - start;
        data.status = "passed";
      }
    } catch (_error: unknown) {
      data.duration = performance.now() - start;
      if (_error instanceof AssertionError) {
        data.error = _error;
      } else {
        throw _error;
      }

      data.status = "failed";
    }

    return new Result(data);
  }
}

/** Data created by a test case. */
type ResultData = {
  duration: number | undefined;
  error: AssertionError | undefined;
  name: string;
  status: "failed" | "passed" | "skipped" | "unknown";
};

/** The result of a test case. */
export class Result implements ResultData {
  public duration: ResultData["duration"];
  public error: ResultData["error"];
  public name: ResultData["name"];
  public status: ResultData["status"];

  constructor(data: ResultData) {
    this.duration = data.duration;
    this.error = data.error;
    this.name = data.name;
    this.status = data.status;
  }

  /** Get the color associated with a result status. */
  statusColor(): string {
    if (this.status === "failed") {
      return "red";
    }

    if (this.status === "passed") {
      return "green";
    }

    if (this.status === "skipped") {
      return "yellow";
    }

    return "white";
  }

  /** Print the result to the console. */
  display(): void {
    const bold = "font-weight: bold;";
    const styles = [bold, `color: ${this.statusColor()}; ${bold}`];

    let message = `- %c${this.name} %c${this.status}`;
    if (this.duration !== undefined && this.duration > 1) {
      message += ` %c${this.duration}ms`;
      styles.push("color: white;");
    }

    if (this.error !== undefined) {
      message += `\n  %c${this.error.message}`;
      message += this.error.title === undefined ? "" : `: ${this.error.title}`;
      message += `\n  |   Actual: ${this.error.actual}`;
      message += `\n  | Expected: ${this.error.expected}`;
      styles.push("color: pink;");
    }

    console.log(message, ...styles);
  }
}
