# HumanFeed — Initial Architecture

## Design goal
Separate platform-specific page integration from media assessment and user-facing filtering decisions.

## Logical components

1. **Platform adapter**
   - Finds feed items and extracts only information available in the rendered page.
   - Emits normalized post/media/account observations.
   - Owns selectors and mutation handling for a specific platform.

2. **Observation pipeline**
   - Deduplicates items and handles dynamically inserted or recycled feed nodes.
   - Avoids repeated expensive work.

3. **Media evidence providers**
   - Explicit platform labels and available provenance.
   - Metadata signals where accessible.
   - Optional visual classifier, evaluated separately before adoption.
   - Each provider returns evidence, not a final user action.

4. **Assessment engine**
   - Combines evidence into a typed assessment.
   - Preserves source, strength, and explanation.
   - Supports verified, likely, and unknown outcomes.

5. **Account rules and signals**
   - Manual allowlist/blocklist takes precedence.
   - Future account recommendations use repeated media evidence and remain opt-in.

6. **Filtering/presentation engine**
   - Maps assessments and user preferences to show, blur, or hide.
   - Supports restoration and user override.

7. **Settings**
   - Uses browser local storage for preferences and account rules.
   - No backend in the MVP.

## Data flow

Rendered feed -> platform adapter -> normalized observation -> evidence providers -> assessment -> user rules/policy -> reversible presentation.

## Initial technology direction
- Chrome Manifest V3
- TypeScript
- Vite (build tooling)
- Minimal popup/options UI; avoid a UI framework until needed
- Vitest for unit tests; browser-level tests introduced with the proof of concept

## Important constraints
- Social platforms frequently change their DOM and may virtualize feed items.
- A browser extension cannot reliably infer media origin from appearance alone.
- Provenance metadata may be stripped during upload/transcoding.
- Video analysis is deferred; first validate image and explicit-label handling.
- Platform terms and Chrome Web Store policies must be reviewed before distribution.
