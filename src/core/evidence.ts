export type EvidenceKind =
  | "platform-label"
  | "content-credentials"
  | "metadata"
  | "visual-classifier";

export type EvidenceResult = "ai-generated" | "not-ai-generated" | "inconclusive";
export type EvidenceStrength = "strong" | "moderate" | "weak";

export interface MediaEvidence {
  /** Stable identifier for the evidence provider; trust is configured separately. */
  providerId: string;
  providerVersion?: string;
  kind: EvidenceKind;
  result: EvidenceResult;
  strength: EvidenceStrength;
  /** Unix epoch milliseconds when this evidence was observed. */
  observedAt: number;
  explanation: string;
}

export type MediaAssessment =
  | { status: "verified-ai-provenance"; evidence: MediaEvidence[] }
  | { status: "likely-ai-generated"; evidence: MediaEvidence[] }
  | { status: "unknown"; evidence: MediaEvidence[] };

/**
 * Maps evidence to product vocabulary. Trusted provider IDs must come from
 * application configuration, never from provider-supplied evidence.
 */
export function assessMedia(
  evidence: MediaEvidence[],
  trustedProvenanceProviderIds: ReadonlySet<string> = new Set(),
): MediaAssessment {
  const affirmative = evidence.filter(
    (item) => item.result === "ai-generated" && item.strength !== "weak",
  );
  const negative = evidence.filter(
    (item) => item.result === "not-ai-generated" && item.strength !== "weak",
  );

  // Weak signals do not create a verdict or a conflict.
  if (affirmative.length > 0 && negative.length > 0) {
    return { status: "unknown", evidence };
  }

  const verified = affirmative.some(
    (item) =>
      item.strength === "strong" &&
      trustedProvenanceProviderIds.has(item.providerId) &&
      (item.kind === "content-credentials" || item.kind === "platform-label"),
  );
  if (verified) return { status: "verified-ai-provenance", evidence };

  if (affirmative.length > 0) {
    return { status: "likely-ai-generated", evidence };
  }

  // Negative evidence never establishes human authorship.
  return { status: "unknown", evidence };
}
