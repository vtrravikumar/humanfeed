# TruePost — Initial Image Evaluation Plan

## 1. Purpose

Define a small, controlled evaluation of TruePost's image evidence and assessment pipeline before integrating a visual classifier or making detection-quality claims.

This plan evaluates what evidence is available, how the system handles it, and where it returns `unknown`.

The initial dataset uses images owned by the project creator. It is intended for development and pipeline validation, not as a representative measure of real-world AI-image detection performance.

## 2. Initial scope

| Dimension | Initial scope |
|---|---|
| Media | Still images |
| Platform context | X is the first target platform, but initial examples are collected independently of X |
| Image sources | AI-generated images and photographs owned by the project creator |
| Evidence | Platform labels, Content Credentials/C2PA, other available provenance signals, and visual analysis if evaluated offline |
| Assessment states | Verified AI provenance, likely AI-generated, unknown |
| Dataset handling | Image files stored locally and excluded from Git |
| Out of scope | Videos, AI-written text, general deepfakes, face swaps, and general manipulated-real-media detection |

An image with no available AI evidence must remain `unknown`. Absence of a label, metadata, or credential is not evidence of human authorship.

## 3. Dataset categories

Record ground truth separately from evidence observed by TruePost.

| Category | Description | Ground-truth basis |
|---|---|---|
| AI-generated | Image generated entirely by an AI image-generation tool | Creation record and original generated file |
| Camera-originated | Ordinary photograph captured using a camera or phone | Original photograph and available capture context |
| AI-edited | Real photograph substantially edited or transformed using AI | Original photograph and documented editing process |
| Unknown origin | Creation process cannot be established with sufficient confidence | Explicitly unresolved |

Categories AI-generated and camera-originated form the initial core comparison. AI-edited and unknown-origin examples are exploratory and must be reported separately.

Do not force uncertain examples into the AI-generated or camera-originated categories.

## 4. Initial sample targets

| Category | Development set | Held-out evaluation set | Total |
|---|---:|---:|---:|
| AI-generated | 10 | 15 | 25 |
| Camera-originated | 10 | 15 | 25 |
| AI-edited | 5 | 5 | 10 |
| Unknown origin | 5 | 5 | 10 |
| **Total** | **30** | **40** | **70** |

These are initial collection targets, not statistical power requirements.

The held-out evaluation set must not be used to tune detection rules or select classifier thresholds. If it is used for tuning, it must be reclassified as development data and a new held-out set must be collected.

Avoid duplicates and near-duplicates across the two sets. Where multiple images come from the same generation session, source image, or editing workflow, keep related examples together in one set to reduce leakage.

## 5. Ground truth and evidence

Ground truth describes how an image was created. Evidence describes what a provider can observe.

Keep these separate.

### Ground-truth fields

- `sample_id`: anonymous identifier.
- `ground_truth`: `ai-generated`, `camera-originated`, `ai-edited`, or `unknown`.
- `source_type`: generator, camera, editing workflow, or unknown.
- `source_reference`: local note or reference sufficient to explain the ground-truth basis.
- `original_available`: whether the original file is available.
- `notes`: relevant limitations; do not include unrelated personal information.

### Evidence fields

Record each evidence type independently:

- `x_ai_label`: present, absent, or not checked.
- `c2pa_status`: valid, invalid, absent, unverifiable, or not checked.
- `other_evidence`: documented evidence and its source.
- `image_variant`: original, resized, recompressed, or downloaded copy.
- `checked_at`: date the evidence was inspected.

An absent or unchecked signal must not be recorded as negative evidence.

### Assessment results

Record actual TruePost output separately from ground truth and observed evidence. Include:

- `sample_id`
- provider IDs and versions used
- evidence results and strengths
- resulting assessment: `verified-ai-provenance`, `likely-ai-generated`, or `unknown`
- explanation
- evaluation notes

Do not pre-fill expected assessments in the dataset manifest. The assessment is an output to be evaluated, not part of ground truth.

## 6. Dataset organization and storage

Proposed repository documentation:

```text
docs/
└── evaluation-plan.md




humanfeed-evaluation/
├── images/
│   ├── development/
│   └── evaluation/
├── manifests/
│   ├── development.csv
│   └── evaluation.csv
└── results/
Image files and manifests containing local paths remain outside Git initially. The repository contains the evaluation plan and, later, anonymized aggregate results where appropriate.

Do not collect or retain post text, account identifiers, or unrelated personal information for this evaluation.

## 7. Evaluation procedure

1. Collect owned images and establish their ground-truth basis.
2. Assign anonymous sample IDs.
3. Place related images and variants in the same dataset split.
4. Record available evidence without treating absence as a negative result.
5. Run the evidence providers and assessment logic on the development set.
6. Review failures and refine the implementation using development data only.
7. Freeze the provider versions and relevant configuration.
8. Run the held-out evaluation set without tuning against its results.
9. Record results by ground-truth category and evidence type.
10. Document limitations and decide what further data is needed.

## 8. Metrics

Report results separately for each ground-truth category and, where relevant, each evidence provider.

| Metric | Meaning |
|---|---|
| False positives | Camera-originated examples assessed as likely or verified AI |
| False negatives | AI-generated examples assessed as unknown |
| Coverage | Proportion of samples receiving a non-unknown assessment |
| Unknown rate | Proportion of samples assessed as unknown |
| Verified-provenance rate | Proportion assessed as verified AI provenance |
| Evidence availability | Proportion of samples for which each evidence type could be checked |

Do not combine verified provenance and likely AI-generated into one result without also reporting them separately.

For this initial small dataset, report counts and denominators alongside percentages. Do not make public accuracy claims from these results.

## 9. Interpretation safeguards

- `unknown` is a valid outcome, not a failure to classify.
- No label or missing metadata does not establish human authorship.
- A platform label establishes that the platform displayed a label; it is not automatically independent or cryptographic provenance.
- A valid Content Credential supports a verifiable provenance claim, not the truth of every claim about the depicted scene.
- Visual-classifier results are probabilistic and must be evaluated against the held-out set before product integration.
- Results from owned images do not establish performance on the broader population of images encountered on X.
- Results from this initial pilot must not be used to claim a target detection rate such as 90%.

## 10. Completion criteria

The initial evaluation exercise is complete when:

- The planned dataset categories and splits are documented.
- Each collected sample has a ground-truth basis or is explicitly marked unknown.
- Evidence observations and assessment outputs are stored separately.
- The held-out set has not been used for tuning.
- Results include false positives, false negatives, coverage, and unknown rate.
- Limitations and next steps are documented.

Completion of this exercise does not, by itself, establish that TruePost is ready for beta or that its detection is reliable in real-world use.
