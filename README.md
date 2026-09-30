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

The repository contains the initial platform-neutral TypeScript contracts and a buildable Chrome Manifest V3 skeleton. It does not yet include an X adapter, feed observation, media detection, AI-text detection, remote services, a backend, or a visual classifier.

## Local development

Prerequisites: Node.js 16.0 or later and npm.

```bash
npm install
npm run typecheck
npm test
npm run build
```

`npm run dev` rebuilds the extension bundle when local files change. `npm run build` creates a loadable unpacked extension in `dist/`. In Chrome, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select the `dist/` directory.

The current popup confirms that the extension skeleton loads. It does not interact with X or any other social-media page.

## Project structure

- `src/core/`: platform-neutral observation and evidence contracts.
- `src/platforms/`: the platform adapter boundary; no platform adapter is implemented yet.
- `src/extension/`: extension-specific build entries, kept separate from the core.
- `public/`: the Manifest V3 manifest and static popup shell.
- `tests/`: focused Vitest contract tests.

See the documents in [docs/](docs/) for requirements, architecture, detection strategy, and the data model.
