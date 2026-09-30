/** Identifies a social-media platform supported by an adapter. */
export type PlatformId = "x" | "instagram";

/** A media type included in the MVP observation contract. */
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
