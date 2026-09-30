# Milestone 2 — initial signal inventory

**Research date:** 2026-09-30  
**Scope:** public documentation review only. No media was fetched, no feed content was collected, and no browser permissions were changed.

## Findings

### 1. X platform labels

X's public help material describes “Made with AI” indicators and says X has integrated with C2PA to strengthen detection and provenance. Its media-literacy page also describes labels for AI-generated and manipulated media.

Sources:
- X, [Industry Leadership and Partnerships](https://help.x.com/en/business-and-advertising/brand-safety/industry-leadership-and-partnerships)
- X, [Media Literacy Action Plan](https://help.x.com/en/rules-and-policies/media-literacy-plan)

**What this establishes:** X documents that such labels exist as a platform capability.

**What it does not establish:** whether the label is present in every geography/account/feed surface, what stable DOM marker exposes it, whether it is attached to a post or individual media item, or whether a content script can reliably read it. Those are live-browser validation questions. Do not infer “not AI” when no label is found.

X separately documents a “Manipulated media” notice for certain content and says the notice may not appear in Home timelines, notifications, or search. This is a different policy signal from an AI-provenance claim and should not be conflated with one.

Source: [Notices on X and what they mean](https://help.x.com/en/rules-and-policies/notices-on-x)

### 2. C2PA / Content Credentials

C2PA is a provenance standard. Its specification describes manifests embedded in media and manifests located by reference. For HTTP-delivered assets, the specification describes looking for a response Link header with rel=c2pa-manifest; it also describes embedded manifests.

Sources:
- [C2PA specifications](https://spec.c2pa.org/specifications/)
- [C2PA 2.3 specification — locating manifests](https://spec.c2pa.org/specifications/specifications/2.3/specs/C2PA_Specification.html)

**Implication for TruePost:** reading a rendered image's src URL is not equivalent to obtaining or validating its original bytes or HTTP response headers. Cross-origin fetching, response-header visibility, transformed/resized CDN assets, and browser permissions need investigation before choosing an implementation. A missing manifest, inaccessible response, or failed retrieval must remain unknown.

A valid provenance manifest can describe an asset's history; it is not, by itself, a universal visual AI detector. The assessment contract should only emit verified AI provenance when the validated evidence actually supports that claim.

### 3. Browser feasibility — unresolved

No public documentation reviewed here confirms that X exposes its Made with AI label through a stable, machine-readable DOM attribute to a Chrome content script. Nor does it confirm that X's media CDN preserves C2PA manifests or exposes the relevant Link header to an extension.

These questions require controlled manual inspection in the user's own X web session and, if needed, a minimal local test page/fixture. Do not add host permissions or fetch media as part of this research step.

## Proposed validation sequence

1. Inspect a small number of X posts where the platform visibly shows a Made with AI label; record only the relevant DOM structure/attributes, not post text or account identity.
2. Inspect a known C2PA test image served from a controlled origin, confirming embedded-manifest validation independently of X.
3. If a suitable labeled X example is available, compare its rendered media URL and response behavior with the source asset; do not assume the CDN copy is byte-identical.
4. Document whether any signal is stable and accessible from a content script before implementing a provider.
5. Keep platform label and C2PA validation as separate evidence providers with distinct explanations and trust rules.

## Decision

**No provider implementation is approved by this inventory.** Next work should be a narrow, read-only browser feasibility check. Preserve the current local-first design and request no new permissions until the test demonstrates they are necessary.
