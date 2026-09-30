import { describe, expect, it } from "vitest";

import { extensionName } from "../src/extension/popup";

describe("extension shell", () => {
  it("uses the TruePost product identity without platform integration", () => {
    expect(extensionName).toBe("TruePost");
  });
});
