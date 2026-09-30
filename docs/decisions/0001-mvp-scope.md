# ADR 0001: MVP Scope

- Status: Accepted
- Date: 2026-09-30

## Context
The product goal is to reduce exposure to visual content that is not real, with initial emphasis on AI-generated imagery and video.

## Decision
The MVP targets **AI-generated images and videos only**. AI-written text is excluded. Broader synthetic/manipulated media detection (including deepfakes and altered real photographs) may be considered later as scope C.

Manual account filtering is in scope. Automated account classification is a later, evidence-based feature.

## Consequences
- Keep media detection modular and distinct from filtering.
- Represent uncertainty explicitly.
- Do not treat unknown provenance as proof of AI generation.
- Defer video-frame analysis until the image/provenance path is validated.
