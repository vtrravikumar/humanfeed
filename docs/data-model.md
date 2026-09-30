# HumanFeed — Normalized Data Model (MVP)

## Purpose

Define the platform-neutral contract between feed adapters and the core assessment pipeline. Platform-specific DOM details must not escape an adapter.

## MVP boundary: text-only posts

Text-only posts are easier to extract than media, but AI-written-text detection is a separate and substantially less dependable classification problem. It is not part of the MVP.

The observation contract permits a post with an empty `media` array. This supports account-level rules and future adapter needs without requiring the extension to capture or retain post text. For the MVP:

- Do not extract or store post text for AI-writing analysis.
- Do not run AI-text detection.
- A text-only post may be represented only when needed to apply an explicit account rule; otherwise the adapter may ignore it.
- Media assessment applies only to observed images and videos.
- An empty media array means “no supported media observed,” not “human-authored.”

## Types

```ts
export type PlatformId = "x" | "instagram";
export type MediaKind = "image" | "video";

export interface AccountObservation {
  platform: PlatformId;
  platformAccountId?: string;
  handle?: string;
  displayName?: string;
}

export interface MediaObservation {
  mediaId: string;
  kind: MediaKind;
  sourceUrl?: string;
  altText?: string;
  width?: number;
  height?: number;
  durationMs?: number;
}

export interface PostObservation {
  observationId: string;
  platform: PlatformId;
  platformPostId?: string;
  account?: AccountObservation;
  media: MediaObservation[];
  observedAt: number;
}
```

All IDs are optional when the platform does not expose a stable identifier, except the locally generated `observationId` and adapter-provided `mediaId`. Do not derive stable identity from DOM position. If a stable media ID is unavailable, the adapter may use an observation-scoped identifier and must not imply it is stable across page reloads.

`sourceUrl` is descriptive page data, not permission or a guarantee that the extension can fetch the resource. Any fetching or analysis must be separately designed and tested against browser and platform constraints.

No DOM nodes, selectors, or platform-specific objects belong in these core types.

## Adapter interface

```ts
export interface PlatformAdapter {
  readonly platform: PlatformId;
  start(onPost: (post: PostObservation) => void): () => void;
}
```

Calling `start` begins observing the supported feed and emits normalized post snapshots. When rendered media changes, an adapter may emit an updated snapshot with the same `observationId`; consumers should treat it as the latest state for that post, not as a new post. An empty media array means no supported media was observed at that moment and may be followed by a later snapshot containing media. The adapter returns a cleanup function that disconnects observers and listeners, and owns selectors, mutation handling, and DOM lifecycle details.

## Evidence contract

Adapters report observations; evidence providers report evidence. Neither should decide the final presentation action.

```ts
export type EvidenceKind =
  | "platform-label"
  | "content-credentials"
  | "metadata"
  | "visual-classifier";

export interface MediaEvidence {
  providerId: string;
  providerVersion?: string;
  kind: EvidenceKind;
  result: "ai-generated" | "not-ai-generated" | "inconclusive";
  strength: "strong" | "moderate" | "weak";
  observedAt: number; // Unix epoch milliseconds
  explanation: string;
}
```

Provider identity and version make evidence traceable. Trust is configured by the application using provider IDs; a provider cannot make itself authoritative by setting a field in its own evidence. Explanations should state what the provider actually observed, not overclaim.

The deterministic assessment rules are:

- **Verified AI provenance:** at least one strong affirmative item from a configured trusted provider, using a provenance-capable kind (`content-credentials` or `platform-label`).
- **Likely AI-generated:** at least one moderate or strong affirmative item, unless qualifying affirmative and negative evidence conflict.
- **Unknown:** no qualifying affirmative evidence; any qualifying conflict; weak-only evidence; missing evidence; or negative-only evidence.
- Weak evidence does not create a verdict or a conflict. Inconclusive evidence does not vote.
- Negative evidence never establishes human authorship. Unknown is not a synonym for human-made.
- A qualifying conflict (moderate/strong affirmative and moderate/strong negative) results in unknown, including when one item would otherwise qualify as verified.

The assessment function does not fetch media, call providers, or classify content. A weak visual signal or missing metadata must never be treated as proof.

## Design constraints

- Keep platform adapters separate from core types and assessment logic.
- Support multiple media items per post.
- Treat missing fields as unavailable, not as negative evidence.
- Keep text content out of the MVP observation contract.
- Keep the model small until the X proof of concept demonstrates additional needs.
