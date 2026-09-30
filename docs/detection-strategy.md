# Detection Strategy — MVP

## Principle
Do not claim that a visual item is AI-generated based only on appearance. Treat detection as evidence aggregation with explicit uncertainty.

## Signal tiers
1. **Provenance/explicit signal:** platform label or verifiable content credentials, when available.
2. **Supporting metadata:** creator/tool metadata that survives platform processing; absence is not evidence of human origin.
3. **Visual classification:** optional probabilistic classifier, evaluated against a representative test set.
4. **Unknown:** no adequate signal.

## MVP sequence
1. Inventory signals exposed by the first platform.
2. Implement normalized evidence types and tests.
3. Test provenance/label handling.
4. Evaluate candidate visual classifiers offline before integrating one.
5. Measure false positives and false negatives; do not enable automatic hiding by default until quality is understood.

## Account-level signals
Manual account allow/block rules are the first implementation. Automated account recommendations are later and should aggregate repeated post-level evidence with a minimum sample size, explain the basis, and allow correction.

## Privacy
Prefer on-device analysis. Do not upload post text, images, video, account browsing history, or identifiers to a service by default. Any future remote analysis requires an explicit product and privacy decision.
