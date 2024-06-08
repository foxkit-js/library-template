import { test } from "uvu";
import * as assert from "uvu/assert";

test("tests are running", () => {
  assert.type(
    "Hello, World!",
    "string",
    "Test that uvu and uvu/assert are installed and running"
  );
});

test.run();
