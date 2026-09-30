import { describe, expect, it } from "vitest";
import { assessMedia, type MediaEvidence } from "../src/core/evidence";

const item = (overrides: Partial<MediaEvidence> = {}): MediaEvidence => ({
  providerId: "provider-a",
  kind: "visual-classifier",
  result: "ai-generated",
  strength: "moderate",
  observedAt: 1_800_000_000_000,
  explanation: "Test evidence",
  ...overrides,
});

describe("assessMedia", () => {
  it("returns unknown for no evidence", () => {
    expect(assessMedia([]).status).toBe("unknown");
  });

  it("returns verified only for strong affirmative provenance from a trusted provider", () => {
    const evidence = item({
      kind: "content-credentials",
      strength: "strong",
    });
    expect(assessMedia([evidence], new Set(["provider-a"])).status).toBe(
      "verified-ai-provenance",
    );
  });

  it("does not trust a provenance-shaped claim from an untrusted provider", () => {
    expect(
      assessMedia(
        [item({ kind: "content-credentials", strength: "strong" })],
      ).status,
    ).toBe("likely-ai-generated");
  });

  it("maps moderate or strong affirmative evidence to likely", () => {
    expect(assessMedia([item()]).status).toBe("likely-ai-generated");
    expect(
      assessMedia([item({ strength: "strong" })]).status,
    ).toBe("likely-ai-generated");
  });

  it("keeps weak affirmative evidence unknown", () => {
    expect(assessMedia([item({ strength: "weak" })]).status).toBe("unknown");
  });

  it("keeps negative-only evidence unknown", () => {
    expect(
      assessMedia([item({ result: "not-ai-generated" })]).status,
    ).toBe("unknown");
  });

  it("returns unknown for conflicting qualifying evidence", () => {
    expect(
      assessMedia([
        item(),
        item({ providerId: "provider-b", result: "not-ai-generated" }),
      ]).status,
    ).toBe("unknown");
  });

  it("ignores weak contradictory evidence when assessing conflict", () => {
    expect(
      assessMedia([
        item({ kind: "content-credentials", strength: "strong" }),
        item({
          providerId: "provider-b",
          result: "not-ai-generated",
          strength: "weak",
        }),
      ], new Set(["provider-a"])).status,
    ).toBe("verified-ai-provenance");
  });

  it("does not let inconclusive evidence override qualifying evidence", () => {
    expect(
      assessMedia([
        item(),
        item({ providerId: "provider-b", result: "inconclusive" }),
      ]).status,
    ).toBe("likely-ai-generated");
  });
});
