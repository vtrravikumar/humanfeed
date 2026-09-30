# Roadmap

This roadmap tracks the first usable, X-only TruePost MVP. Checkboxes describe delivered repository work, not product quality or detection accuracy. A completed engineering milestone does not imply that AI-media detection is reliable or ready for users.

## Baseline — engineering foundation

- [x] Establish repository, product direction, and MVP boundaries.
- [x] Define platform-neutral post/media observation contracts.
- [x] Create a buildable Chrome Manifest V3 TypeScript extension.
- [x] Add a platform adapter boundary and read-only X web-feed observer.
- [x] Observe image/video elements and update observations when media appears late.
- [x] Add automated typecheck, test, and build CI.
- [x] Verify the observer manually against the X web feed.

**Current capability:** the extension observes rendered X post/media structure in memory. It does not assess media, change the feed, store preferences, or contact a backend.

## Milestone 1 — evidence and assessment contract

- [x] Review and finalize the evidence vocabulary and its semantics.
- [x] Define how evidence from different providers is combined without overstating certainty.
- [x] Define assessment states: verified AI provenance, likely AI-generated, and unknown.
- [x] Specify evidence provenance, timestamps, provider/version, and explanation fields.
- [x] Add unit tests for conflicting, missing, weak, and strong evidence.
- [x] Document explicit rules preventing missing evidence or weak visual signals from becoming a human/AI verdict.

**Exit criteria:** met. The repository now has a deterministic, tested mapping from evidence to assessment states; no classifier is required.

## Milestone 2 — first evidence providers

- [ ] Inventory browser-accessible platform labels and media provenance signals.
- [ ] Implement a local evidence-provider interface.
- [ ] Evaluate Content Credentials/C2PA and other available provenance signals within browser constraints.
- [ ] Treat absent, stripped, invalid, or unverifiable metadata as unknown—not evidence of human authorship.
- [ ] Add fixtures and tests for valid, invalid, absent, and conflicting provenance.
- [ ] Document any media-fetching, permission, and privacy implications before implementation.

**Exit criteria:** at least one evidence path produces explainable, testable results without a visual classifier.

## Milestone 3 — user-visible feed controls

- [ ] Add a clear, accessible per-media assessment label and explanation.
- [ ] Add reversible show/blur/hide controls.
- [ ] Ensure unknown media is not automatically hidden or presented as human-authored.
- [ ] Handle multiple media items per post and dynamically inserted/virtualized posts.
- [ ] Add local settings and persist only the minimum user preferences.
- [ ] Add manual account allowlist/blocklist, with user-controlled precedence.

**Exit criteria:** a user can understand an assessment and control presentation without losing access to the original post.

## Milestone 4 — evaluation and hardening

- [ ] Build a representative, documented, consented evaluation set.
- [ ] Measure false positives, false negatives, coverage, and unknown rate by evidence type.
- [ ] Test X feed virtualization, dynamic loading, accessibility, and UI changes.
- [ ] Review permissions, data flows, privacy disclosures, and failure behavior.
- [ ] Establish release packaging and Chrome Web Store readiness.
- [ ] Decide whether evidence supports a limited beta; do not make accuracy claims without measured results.

## Later, subject to separate scope decisions

- [ ] Evaluate optional local visual classification after provenance paths are measured.
- [ ] Evaluate video-frame analysis after the image pipeline is validated.
- [ ] Consider Instagram through a separate adapter.
- [ ] Consider broader synthetic/manipulated media categories.

## Non-goals for the first MVP

- AI-written text detection.
- General misinformation detection.
- General deepfake, face-swap, or manipulated-real-media detection.
- Automatic reputation judgments about people or accounts.
- Server-side collection of browsing activity or feed content.
