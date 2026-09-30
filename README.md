# HumanFeed

A privacy-first browser extension to help users identify and filter AI-generated images and videos in social media feeds.

## MVP scope

The initial release focuses on **AI-generated visual media** (images and videos).

- No AI-written text detection in the MVP.
- No general deepfake, face-swap, misinformation, or manipulated-real-media detection in the MVP.
- Account-level filtering is in scope: manual allow/block controls first, with account-level AI-content signals developed carefully and transparently.
- The architecture should allow a later expansion to broader synthetic/manipulated media detection.

## Product principles

1. **User control:** show, blur, hide, and restore are user-configurable actions.
2. **Evidence-aware:** distinguish verified provenance from probabilistic visual classification and unknown origin.
3. **Privacy-first:** prefer local processing; do not collect or transmit browsing history or feed content by default.
4. **Explainable:** show why a post was flagged and avoid presenting uncertain classification as fact.
5. **Modular:** keep platform adapters, media analysis, account signals, and filtering separate.

## Status

Project initiated. Requirements and architecture are being defined before implementation.

See [ROADMAP.md](ROADMAP.md) and the documents in [docs/](docs/).
