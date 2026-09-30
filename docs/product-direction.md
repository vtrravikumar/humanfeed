# TruePost — Product Direction

## Product idea

TruePost is a user-controlled trust and filtering layer for social-media feeds. The inspiration is the way caller-identification products add context to phone calls: TruePost should add useful context to posts and media as people encounter them.

The initial engineering project and repository remain **HumanFeed**. **TruePost** is the working product name, subject to naming and trademark review before public release.

## Product principles

1. **Evidence before labels.** Explain what signal supports an assessment; do not label a person or account from appearance, name, or one post.
2. **Post-level first.** Assess individual media items. Account-level signals, if introduced, must aggregate repeated observable evidence and show the basis.
3. **User control.** Let users show, blur, hide, restore, allow, or block. Automated actions should be configurable and reversible.
4. **Uncertainty is visible.** Distinguish verified provenance, likely AI-generated, and unknown. Unknown is not a negative or positive verdict.
5. **Local-first.** Keep processing and preferences on-device by default. No server or transmission of feed content is required for the MVP.
6. **Platform-neutral core.** Platform adapters translate rendered feed content into common observations; assessment and policy logic remain independent of the platform.
7. **No reputation verdicts about people.** Any future account-level summary describes observed media patterns, not whether a person is trustworthy.

## MVP and longer-term direction

### MVP
- Chrome extension, starting with the X web feed.
- Focus on AI-generated images and videos.
- Use available explicit labels and provenance signals first; evaluate visual classification separately.
- Reversible show/blur/hide controls.
- Manual account allowlist/blocklist.
- Local-only settings; no backend.

### Later, subject to evidence and user research
- Explainable account-level summaries based on repeated post-level evidence.
- Optional, privacy-preserving aggregate signals only after a separate design and consent review.
- Additional platforms, including Instagram, through separate adapters.
- Broader synthetic/manipulated media categories only through an explicit scope decision.

## Product language

Prefer descriptions such as:
- “This media has verified AI provenance.”
- “Signals suggest this image may be AI-generated.”
- “Origin unknown.”
- “This account has repeatedly shared media assessed as likely AI-generated.”

Avoid categorical labels such as “AI account,” “fake person,” or “untrustworthy account.” A media assessment is not an assessment of a person's identity or intent.
