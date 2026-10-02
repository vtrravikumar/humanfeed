# HumanFeed evaluation harness

A dependency-free Python 3 harness for the pilot evaluation described in [docs/evaluation-plan.md](../../docs/evaluation-plan.md).

## Data separation

Keep real image files and completed manifests outside Git. The CSVs here are header-only templates. Maintain three separate files per split:

- **Ground truth**: what is known about the sample and its origin.
- **Evidence**: observations made by providers (one row per observation).
- **Assessments**: the final assessment produced for each sample (one row per sample).

Do not put expected assessments in the ground-truth file. Do not treat missing evidence as evidence of human origin.

## Start

Copy the templates to a private working directory, fill them, then run:

```sh
python3 tools/evaluation/evaluate.py validate \
  --ground-truth /path/to/evaluation-ground-truth.csv \
  --evidence /path/to/evaluation-evidence.csv \
  --assessments /path/to/evaluation-assessments.csv

python3 tools/evaluation/evaluate.py report \
  --ground-truth /path/to/evaluation-ground-truth.csv \
  --assessments /path/to/evaluation-assessments.csv \
  --output /path/to/evaluation-report.json
```

Use separate paths for development and held-out evaluation splits. Run validation on each split independently. The report prints counts with denominators and writes JSON. It reports false positives only for camera-originated samples (assessed likely/verified AI), and false negatives only for AI-generated samples assessed unknown, matching the pilot plan. AI-edited and unknown-origin groups are reported descriptively.

This harness checks data integrity and summarizes supplied assessments. It does **not** inspect images, run a detector, establish ground truth, or imply real-world accuracy. Empty/incomplete categories are valid; metrics are descriptive and must retain their denominators.
