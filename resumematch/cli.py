"""Command-line entrypoint for ResumeMatch.

Usage:
    python -m resumematch.cli --resume tests/fixtures/sample_resume.txt \
        --job tests/fixtures/sample_job.txt
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(
        prog="resumematch",
        description="Analyze a resume against a job posting.",
    )
    parser.add_argument("--resume", required=True, help="Path to resume text file.")
    parser.add_argument("--job", required=True, help="Path to job posting text file.")
    parser.add_argument(
        "--indent", type=int, default=2, help="JSON indent (default 2)."
    )
    parser.add_argument(
        "--mock",
        action="store_true",
        help="Free mode: fake the paid Claude calls (no API key, no cost).",
    )
    args = parser.parse_args()

    try:
        resume = Path(args.resume).read_text(encoding="utf-8")
        job = Path(args.job).read_text(encoding="utf-8")
    except OSError as exc:
        print(f"Error reading input file: {exc}", file=sys.stderr)
        return 2

    # Import here so --help and arg errors don't require the API key / model load.
    from .analyzer import analyze

    try:
        result = analyze(resume, job, mock=args.mock)
    except ValueError as exc:  # e.g. missing API key
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    except Exception as exc:  # noqa: BLE001 - surface any runtime failure cleanly
        print(f"Analysis failed: {exc}", file=sys.stderr)
        return 1

    print(result.model_dump_json(indent=args.indent))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
