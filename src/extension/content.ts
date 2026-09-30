import { XAdapter } from "../platforms/x/x-adapter";
import type { PostObservation } from "../core/observation";

// Temporary local diagnostic for validating adapter emissions during manual testing.
function logObservation({ observationId, media }: PostObservation): void {
  console.debug("[TruePost] observation", {
    observationId,
    mediaKinds: media.map(({ kind }) => kind)
  });
}

// This read-only entry point intentionally has no assessment or presentation layer.
const stopObserving = new XAdapter().start(logObservation);

void stopObserving;
