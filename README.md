# HumanFeed

HumanFeed is the engineering repository for **TruePost**, a privacy-first browser extension intended to help users identify and filter AI-generated images and videos in social-media feeds. TruePost is a working product name and has not yet undergone naming or trademark clearance.

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

The repository contains platform-neutral TypeScript contracts, a buildable Chrome Manifest V3 extension, and a read-only X (`x.com`) feed observer. Its popup presents the TruePost product identity, a privacy notice, and creator information for V.T.R. Ravi Kumar (VTRRK).

The X observer locally identifies rendered post containers and their image/video elements, then produces normalized observations in memory. It does not extract post text, fetch or download media, transmit feed data, assess media, modify the page, use storage, or contact a backend.

The foundation does not yet include media detection, AI-text detection, remote services, a backend, storage, a visual classifier, or any filtering/presentation behavior.

## Local development

Prerequisites: Node.js 16.0 or later and npm.

```bash
npm install
npm run typecheck
npm test
npm run build
```

`npm run dev` rebuilds the extension bundle when local files change. `npm run build` creates a loadable unpacked extension in `dist/`. In Chrome, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select the `dist/` directory.

The current popup is a branded TruePost shell. It provides an accessible external link to [vtrrk.in](https://vtrrk.in), opening in a new tab with `noopener` and `noreferrer`. It accurately describes the local, read-only X observation milestone.

To test the observer manually, build the extension, reload its unpacked `dist/` directory from `chrome://extensions`, then open or refresh `https://x.com/home`. This milestone has no visible UI or feed modifications; use Chrome DevTools breakpoints in `content.js` to inspect normalized observations while posts are added to the feed.

## Project structure

- `src/core/`: platform-neutral observation and evidence contracts.
- `src/platforms/`: the platform adapter boundary and X-specific DOM adapter.
- `src/extension/`: popup and X content-script build entries, kept separate from the core.
- `public/`: the Manifest V3 manifest and static popup shell.
- `tests/`: focused Vitest contract tests.

See the documents in [docs/](docs/) for requirements, architecture, detection strategy, and the data model.
