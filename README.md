# @holllo/test ✅

> **Tiny testing library designed to run anywhere.**

## Example

```ts
import {setup} from "@holllo/test";

const add = (a: number, b: number): number => a + b;

void setup("add", async (group) => {
  group.test("1 + 1", async (test) => {
    test.equals(add(1, 1), 2);
  });

  group.test("2 + 2", async (test) => {
    test.equals(add(2, 2), 5);
  });
});
```

```txt
# add
- 1 + 1 passed
- 2 + 2 failed
  Failed equals assertion
  |   Actual: 4
  | Expected: 5
```

## License

Distributed under the [AGPL-3.0-or-later](https://spdx.org/licenses/AGPL-3.0-or-later.html) license, see [LICENSE](https://git.bauke.xyz/Holllo/test/src/branch/main/LICENSE) for more information.
