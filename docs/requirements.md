# HumanFeed — MVP Requirements

## 1. Purpose
Help a user reduce exposure to AI-generated images and videos in supported social-media web feeds, while keeping the user in control.

## 2. Scope
### In scope
- Chrome extension using Manifest V3.
- X web feed as the first proof-of-concept platform, subject to platform policy and technical review.
- Identify available AI-origin signals (for example, explicit labels or verifiable provenance).
- Treat visual-model output as probabilistic evidence, not proof.
- User actions: show, blur, hide, restore.
- Manual account allowlist and blocklist.
- Local-first settings and preferences.

### Out of scope
- AI-generated text.
- General deepfake or face-swap detection.
- Detecting all manipulated photographs.
- Misinformation or truth assessment.
- Instagram in the first proof of concept.
- Server-side user accounts or browsing-history collection.

## 3. Functional requirements
- FR-01: Observe supported feed items as they appear, including dynamically loaded items.
- FR-02: Associate media and account identifiers with a feed item where the page exposes them.
- FR-03: Produce a structured assessment containing signals, confidence/strength, and explanation.
- FR-04: Keep detection separate from presentation/filtering policy.
- FR-05: Allow users to choose show, blur, or hide behavior.
- FR-06: Allow a hidden/blurred item to be restored.
- FR-07: Support manual account allowlist and blocklist.
- FR-08: Never silently treat unknown origin as confirmed AI generation.
- FR-09: Provide a way to mark a classification as incorrect.

## 4. Non-functional requirements
- NFR-01: Local-first; no network transmission of feed content by default.
- NFR-02: Minimal permissions and clear disclosure.
- NFR-03: Avoid materially degrading scrolling, page responsiveness, or media playback.
- NFR-04: Platform-specific selectors and behavior must be isolated behind adapters.
- NFR-05: Detection results must be explainable and uncertainty visible.
- NFR-06: Unit-test core logic independently of the social-media website.

## 5. Classification vocabulary
- **Verified AI provenance:** a trustworthy provenance signal indicates AI generation.
- **Likely AI-generated:** a classifier or combination of signals suggests AI generation; not definitive.
- **Unknown:** insufficient or unavailable evidence.
- **User override:** an explicit allow/block choice takes precedence over automated assessment.

## 6. Account-level filtering
The MVP supports manual account rules. Automated account recommendations are a later increment and must be based on repeated, observable media evidence—not account name, profile image, or a single post alone. Recommendations must be reversible and explainable.
