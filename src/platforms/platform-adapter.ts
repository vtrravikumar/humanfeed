import type { PlatformId, PostObservation } from "../core/observation";

/**
 * Translates a platform's rendered feed into platform-neutral observations.
 * Platform adapters own all DOM access and return a function that stops it.
 */
export interface PlatformAdapter {
  readonly platform: PlatformId;
  start(onPost: (post: PostObservation) => void): () => void;
}
