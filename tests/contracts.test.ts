import { describe, expect, expectTypeOf, it } from "vitest";

import type {
  MediaEvidence,
  PlatformAdapter,
  PostObservation
} from "../src/index";

const observedPost = {
  observationId: "local-observation-1",
  platform: "x",
  account: {
    platform: "x",
    handle: "example"
  },
  media: [
    {
      mediaId: "media-in-observation-1",
      kind: "image",
      altText: "Descriptive page text"
    }
  ],
  observedAt: 1_700_000_000_000
} satisfies PostObservation;

describe("platform-neutral contracts", () => {
  it("allows a post with multiple media items or no media", () => {
    const textOnlyPost: PostObservation = {
      observationId: "local-observation-2",
      platform: "instagram",
      media: [],
      observedAt: 1_700_000_000_001
    };

    expect(observedPost.media).toHaveLength(1);
    expect(textOnlyPost.media).toEqual([]);
  });

  it("models evidence as a signal rather than a presentation decision", () => {
    const evidence: MediaEvidence = {
      providerId: "test-provenance-provider",
      kind: "content-credentials",
      result: "ai-generated",
      strength: "strong",
      observedAt: 1_700_000_000_002,
      explanation: "Verifiable provenance is present."
    };

    expect(evidence.result).toBe("ai-generated");
    expectTypeOf<MediaEvidence>().not.toHaveProperty("action");
  });

  it("requires adapters to provide cleanup for observation lifecycle", () => {
    let receivedPost: PostObservation | undefined;
    let cleanedUp = false;

    const adapter: PlatformAdapter = {
      platform: "x",
      start(onPost) {
        onPost(observedPost);
        return () => {
          cleanedUp = true;
        };
      }
    };

    const stop = adapter.start((post) => {
      receivedPost = post;
    });
    stop();

    expect(receivedPost).toEqual(observedPost);
    expect(cleanedUp).toBe(true);
  });
});
