import type { MediaEvidence } from "../../core/evidence";

const LABEL_TEXT = "Made with AI";
const TWEET_TEXT_SELECTOR = '[data-testid="tweetText"]';

/**
 * Detects X's currently observed "Made with AI" badge inside one rendered post.
 * This is a DOM heuristic, not a stable X contract or cryptographic verification.
 */
export function detectXMadeWithAiLabel(post: Element): MediaEvidence | undefined {
  for (const label of post.querySelectorAll("span")) {
    if (label.closest(TWEET_TEXT_SELECTOR)) continue;
    if (normalizeText(label.textContent) !== LABEL_TEXT) continue;
    if (!hasBadgeSvg(label)) continue;

    return {
      providerId: "x-made-with-ai-label",
      kind: "platform-label",
      result: "ai-generated",
      strength: "strong",
      observedAt: Date.now(),
      explanation: 'The X "Made with AI" platform label was observed.'
    };
  }
}

function normalizeText(value: string | null): string {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function hasBadgeSvg(label: Element): boolean {
  // The badge icon shares the label's div[dir="ltr"] parent, but other elements
  // (such as a whitespace-only span) may sit between them. Generated CSS class
  // names are intentionally not used.
  const badge = label.parentElement;
  return badge?.matches('div[dir="ltr"]') === true && badge.querySelector("svg") !== null;
}
