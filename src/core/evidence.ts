export type EvidenceKind =
  | "platform-label"
  | "content-credentials"
  | "metadata"
  | "visual-classifier";

export interface MediaEvidence {
  kind: EvidenceKind;
  result: "ai-generated" | "not-ai-generated" | "inconclusive";
  strength: "strong" | "moderate" | "weak";
  explanation: string;
}
