#!/usr/bin/env bash
#
# verify_spec_version.sh
#
# Validates that:
#   1. SPEC_VERSION file exists and contains a valid vX.Y.Z string.
#   2. docs/Master_Functional_Spec.md contains the same version string.
#   3. (Optional, on tag builds) A git tag with that name exists and points to HEAD.
#
# Usage:
#   ./scripts/verify_spec_version.sh [--require-tag]
#
# Options:
#   --require-tag   Fail if the git tag does not exist or does not point to HEAD.
#                   Use this on release/tag CI jobs.
#
# Exit codes:
#   0  All checks passed.
#   1  A check failed.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SPEC_VERSION_FILE="$REPO_ROOT/SPEC_VERSION"
SPEC_DOC="$REPO_ROOT/docs/Master_Functional_Spec.md"

REQUIRE_TAG=false
if [[ "${1:-}" == "--require-tag" ]]; then
  REQUIRE_TAG=true
fi

# -----------------------------------------------------------------------------
# 1. Check SPEC_VERSION file exists and has valid format
# -----------------------------------------------------------------------------
if [[ ! -f "$SPEC_VERSION_FILE" ]]; then
  echo "ERROR: SPEC_VERSION file not found at $SPEC_VERSION_FILE" >&2
  exit 1
fi

VERSION="$(tr -d '[:space:]' < "$SPEC_VERSION_FILE")"

# Validate format: vMAJOR.MINOR.PATCH (semver-like)
if [[ ! "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "ERROR: SPEC_VERSION contains invalid format: '$VERSION'" >&2
  echo "       Expected format: vX.Y.Z (e.g., v1.0.0)" >&2
  exit 1
fi

echo "SPEC_VERSION: $VERSION"

# -----------------------------------------------------------------------------
# 2. Check spec doc contains the same version string
# -----------------------------------------------------------------------------
if [[ ! -f "$SPEC_DOC" ]]; then
  echo "ERROR: Spec document not found at $SPEC_DOC" >&2
  exit 1
fi

if ! grep -q "$VERSION" "$SPEC_DOC"; then
  echo "ERROR: Spec document does not contain version '$VERSION'" >&2
  echo "       Update the 'Spec Version' header in $SPEC_DOC to match SPEC_VERSION." >&2
  exit 1
fi

echo "Spec doc contains version: OK"

# -----------------------------------------------------------------------------
# 3. (Optional) Check git tag exists and points to HEAD
# -----------------------------------------------------------------------------
if [[ "$REQUIRE_TAG" == true ]]; then
  # Check if tag exists
  if ! git rev-parse "$VERSION" >/dev/null 2>&1; then
    echo "ERROR: Git tag '$VERSION' does not exist." >&2
    echo "       Create the tag with: git tag -a $VERSION -m \"Spec version $VERSION\"" >&2
    exit 1
  fi

  TAG_COMMIT="$(git rev-parse "$VERSION^{commit}")"
  HEAD_COMMIT="$(git rev-parse HEAD)"

  if [[ "$TAG_COMMIT" != "$HEAD_COMMIT" ]]; then
    echo "ERROR: Git tag '$VERSION' points to $TAG_COMMIT, but HEAD is $HEAD_COMMIT" >&2
    echo "       The tag must point to the current commit." >&2
    exit 1
  fi

  echo "Git tag '$VERSION' points to HEAD: OK"
else
  # Informational check (non-fatal)
  if git rev-parse "$VERSION" >/dev/null 2>&1; then
    TAG_COMMIT="$(git rev-parse "$VERSION^{commit}")"
    HEAD_COMMIT="$(git rev-parse HEAD)"
    if [[ "$TAG_COMMIT" == "$HEAD_COMMIT" ]]; then
      echo "Git tag '$VERSION' exists and points to HEAD: OK"
    else
      echo "INFO: Git tag '$VERSION' exists but points to a different commit."
      echo "      Tag commit: $TAG_COMMIT"
      echo "      HEAD:       $HEAD_COMMIT"
    fi
  else
    echo "INFO: Git tag '$VERSION' does not exist yet."
    echo "      Create it with: git tag -a $VERSION -m \"Spec version $VERSION\""
  fi
fi

echo ""
echo "All spec version checks passed."
exit 0

