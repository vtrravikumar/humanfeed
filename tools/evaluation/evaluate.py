#!/usr/bin/env python3
"""Validate and summarize HumanFeed pilot evaluation CSVs (stdlib only)."""
import argparse
import csv
import json
import sys
from collections import Counter
from pathlib import Path

GT = {"ai-generated", "camera-originated", "ai-edited", "unknown-origin"}
ASSESS = {"verified-ai-provenance", "likely-ai-generated", "unknown"}
EVIDENCE_RESULT = {"ai-generated", "not-ai-generated", "inconclusive"}
STRENGTH = {"strong", "moderate", "weak"}
GT_FIELDS = ["sample_id", "ground_truth", "source_type", "source_reference", "original_available", "notes"]
EVIDENCE_FIELDS = ["sample_id", "provider_id", "provider_version", "evidence_kind", "evidence_result", "evidence_strength", "explanation", "observed_at"]
ASSESS_FIELDS = ["sample_id", "assessment", "explanation", "evaluated_at"]


class EvaluationError(ValueError):
    pass


def read_csv(path, required):
    with Path(path).open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames is None:
            raise EvaluationError(f"{path}: missing CSV header")
        missing = sorted(set(required) - set(reader.fieldnames))
        if missing:
            raise EvaluationError(f"{path}: missing columns: {', '.join(missing)}")
        rows = list(reader)
    return rows


def unique_ids(rows, path):
    ids = [r["sample_id"].strip() for r in rows]
    if any(not x for x in ids):
        raise EvaluationError(f"{path}: sample_id must not be blank")
    duplicates = sorted(x for x, n in Counter(ids).items() if n > 1)
    if duplicates:
        raise EvaluationError(f"{path}: duplicate sample_id(s): {', '.join(duplicates)}")
    return set(ids)


def load_inputs(gt_path, evidence_path=None, assessments_path=None):
    gt = read_csv(gt_path, GT_FIELDS)
    gt_ids = unique_ids(gt, gt_path)
    for row in gt:
        if row["ground_truth"] not in GT:
            raise EvaluationError(f"{gt_path}: invalid ground_truth for {row['sample_id']}: {row['ground_truth']}")
        if row["original_available"] not in {"yes", "no", "unknown"}:
            raise EvaluationError(f"{gt_path}: original_available must be yes/no/unknown for {row['sample_id']}")
    evidence = []
    if evidence_path:
        evidence = read_csv(evidence_path, EVIDENCE_FIELDS)
        for row in evidence:
            if not row["sample_id"].strip():
                raise EvaluationError(f"{evidence_path}: blank sample_id")
            if row["sample_id"] not in gt_ids:
                raise EvaluationError(f"{evidence_path}: sample_id not in ground truth: {row['sample_id']}")
            if row["evidence_result"] not in EVIDENCE_RESULT:
                raise EvaluationError(f"{evidence_path}: invalid evidence_result for {row['sample_id']}")
            if row["evidence_strength"] not in STRENGTH:
                raise EvaluationError(f"{evidence_path}: invalid evidence_strength for {row['sample_id']}")
    assessments = []
    if assessments_path:
        assessments = read_csv(assessments_path, ASSESS_FIELDS)
        assess_ids = unique_ids(assessments, assessments_path)
        extra = assess_ids - gt_ids
        if extra:
            raise EvaluationError(f"{assessments_path}: sample_id not in ground truth: {', '.join(sorted(extra))}")
        for row in assessments:
            if row["assessment"] not in ASSESS:
                raise EvaluationError(f"{assessments_path}: invalid assessment for {row['sample_id']}: {row['assessment']}")
    return gt, evidence, assessments


def report(gt, assessments):
    by_id = {r["sample_id"]: r["assessment"] for r in assessments}
    groups = {}
    for label in sorted(GT):
        rows = [r for r in gt if r["ground_truth"] == label]
        total = len(rows)
        present = [r for r in rows if r["sample_id"] in by_id]
        states = Counter(by_id[r["sample_id"]] for r in present)
        unknown = states["unknown"]
        item = {
            "samples": total,
            "assessed": len(present),
            "missing_assessments": total - len(present),
            "assessment_counts": {s: states[s] for s in sorted(ASSESS)},
            "coverage": {"count": len(present) - unknown, "denominator": total},
            "unknown_rate": {"count": unknown, "denominator": total},
        }
        if label == "camera-originated":
            fp = states["likely-ai-generated"] + states["verified-ai-provenance"]
            item["false_positives"] = {"count": fp, "denominator": total}
        if label == "ai-generated":
            item["false_negatives"] = {"count": unknown, "denominator": total}
        if label == "ai-generated":
            item["verified_provenance_rate"] = {"count": states["verified-ai-provenance"], "denominator": total}
        groups[label] = item
    return {
        "schema_version": 1,
        "note": "Descriptive pilot metrics only; missing assessments remain in denominators. No image detection is performed by this harness.",
        "total_samples": len(gt),
        "assessments_supplied": len(assessments),
        "groups": groups,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    for name in ("validate", "report"):
        p = sub.add_parser(name)
        p.add_argument("--ground-truth", required=True)
        p.add_argument("--evidence")
        p.add_argument("--assessments", required=(name == "report"))
        if name == "report":
            p.add_argument("--output")
    args = parser.parse_args()
    try:
        gt, evidence, assessments = load_inputs(args.ground_truth, args.evidence, args.assessments)
        if args.command == "validate":
            print(f"Valid: {len(gt)} ground-truth samples, {len(evidence)} evidence rows, {len(assessments)} assessments.")
        else:
            result = report(gt, assessments)
            rendered = json.dumps(result, indent=2) + "\n"
            if args.output:
                Path(args.output).write_text(rendered, encoding="utf-8")
                print(f"Report written: {args.output}")
            else:
                print(rendered, end="")
    except (OSError, csv.Error, EvaluationError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
