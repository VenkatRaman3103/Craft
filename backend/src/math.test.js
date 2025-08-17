import { expect, test } from "vitest";
import { add } from "./math";

test("adds numbers", () => {
    expect(add(2, 3)).toBe(5);
});
