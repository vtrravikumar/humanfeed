# Roadmap

## Phase 0 — Product and technical foundation
- [x] Establish repository and MVP scope.
- [ ] Define functional and non-functional requirements.
- [ ] Document architecture and key decisions.
- [ ] Validate browser-extension constraints for target platforms.

## Phase 1 — Proof of concept
- [ ] Create a Manifest V3 TypeScript extension skeleton.
- [ ] Add an X web-feed adapter behind a platform interface.
- [ ] Detect feed post containers and associated media without disrupting scrolling.
- [ ] Add a reversible visual treatment (label/blur/hide and restore).
- [ ] Start with explicit labels and provenance signals; do not claim visual certainty.

## Phase 2 — Detection and account controls
- [ ] Define a media-evidence model with confidence and explanation.
- [ ] Evaluate image provenance/metadata and suitable local visual classifiers.
- [ ] Add manual account allowlist/blocklist.
- [ ] Design opt-in account-level recommendations based on observed evidence.

## Phase 3 — Evaluation and usability
- [ ] Build a representative, consented test set.
- [ ] Measure false positives and false negatives.
- [ ] Test dynamic loading, virtualization, and platform UI changes.
- [ ] Add settings, feedback, and local statistics.

## Later
- [ ] Evaluate Instagram web support.
- [ ] Consider broader synthetic/manipulated media detection (future scope C).
- [ ] Consider optional video-frame analysis after image pipeline validation.

## Non-goals for MVP
- AI-written text detection.
- General misinformation detection.
- Automatic judgments about whether an account or person is trustworthy.
- Server-side collection of users' browsing activity.
