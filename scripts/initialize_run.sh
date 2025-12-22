#!/usr/bin/env bash
#
# initialize_run.sh — Generate a benchmark run folder and start build prompts (API + UI)
#
# Usage:
#   ./scripts/initialize_run.sh --profile <profile> --tool "<tool name>" [--tool-ver "<version/build id>"]
#
# Options:
#   --profile <name>      Required. One of: model-a-rest, model-a-graphql, model-b-rest, model-b-graphql
#   --tool "<name>"       Required. Tool under test (name)
#   --tool-ver "<ver>"    Optional. Tool version/build id (written to run.config)
#   --spec-ver <ver>      Optional. Frozen spec version (defaults to SPEC_VERSION file contents)
#   --run-dir <path>      Optional. Override the auto-generated run folder path
#
# Example:
#   ./scripts/initialize_run.sh --profile model-a-rest --tool "YourTool" --tool-ver "1.0"
#

set -euo pipefail

# Resolve script and repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Defaults
PROFILE=""
TOOL=""
TOOL_VER=""
SPEC_VER=""
RUN_DIR=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --profile)
            PROFILE="$2"
            shift 2
            ;;
        --tool)
            TOOL="$2"
            shift 2
            ;;
        --tool-ver)
            TOOL_VER="$2"
            shift 2
            ;;
        --spec-ver)
            SPEC_VER="$2"
            shift 2
            ;;
        --run-dir)
            RUN_DIR="$2"
            shift 2
            ;;
        -h|--help)
            sed -n '2,/^$/p' "$0" | grep '^#' | sed 's/^# \?//'
            exit 0
            ;;
        *)
            echo "Error: Unknown option: $1" >&2
            exit 1
            ;;
    esac
done

# Validate required arguments
if [[ -z "$PROFILE" ]]; then
    echo "Error: --profile is required" >&2
    echo "Available profiles: model-a-rest, model-a-graphql, model-b-rest, model-b-graphql" >&2
    exit 1
fi

if [[ -z "$TOOL" ]]; then
    echo "Error: --tool is required" >&2
    exit 1
fi

# Load profile
PROFILE_FILE="$REPO_ROOT/profiles/${PROFILE}.profile"
if [[ ! -f "$PROFILE_FILE" ]]; then
    echo "Error: Profile not found: $PROFILE_FILE" >&2
    echo "Available profiles: model-a-rest, model-a-graphql, model-b-rest, model-b-graphql" >&2
    exit 1
fi

# Source profile (sets model, api_type, contract_artifact)
# shellcheck disable=SC1090
source "$PROFILE_FILE"

# Default spec_ver from SPEC_VERSION file
if [[ -z "$SPEC_VER" ]]; then
    SPEC_VER="$(tr -d '[:space:]' < "$REPO_ROOT/SPEC_VERSION")"
fi

# Generate run folder path if not provided
if [[ -z "$RUN_DIR" ]]; then
    TIMESTAMP="$(date +%Y%m%dT%H%M)"
    RUN_DIR="$REPO_ROOT/runs/$TIMESTAMP"
fi

# Create run folder structure
mkdir -p "$RUN_DIR/PawMate"

# Workspace path is the PawMate subfolder
WORKSPACE_PATH="$RUN_DIR/PawMate"

# Generate run ID
RUN_ID="${TOOL// /-}-Model${model}-$(basename "$RUN_DIR")"

# Determine run number from run_id or default to 1
RUN_NUMBER=1
if echo "$RUN_ID" | grep -qi "run2\|run-2"; then
    RUN_NUMBER=2
fi

# Generate tool slug (lowercase, alphanumeric + hyphens)
TOOL_SLUG=$(echo "$TOOL" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')

# Generate timestamp from run directory name or current time
RUN_DIR_NAME=$(basename "$RUN_DIR")
TIMESTAMP=""
if [[ "$RUN_DIR_NAME" =~ ^[0-9]{8}T[0-9]{4}$ ]]; then
    TIMESTAMP="$RUN_DIR_NAME"
else
    TIMESTAMP=$(date +%Y%m%dT%H%M)
fi

# Write run.config
cat > "$RUN_DIR/run.config" <<EOF
# run.config — Benchmark Run Configuration
# Generated: $(date -Iseconds)

spec_version=$SPEC_VER
spec_root=$REPO_ROOT
tool=$TOOL
tool_ver=$TOOL_VER
model=$model
api_type=$api_type
workspace=$WORKSPACE_PATH
EOF

# --- Render API Start Prompt ---
API_TEMPLATE="$REPO_ROOT/prompts/api_start_prompt_template.md"
if [[ ! -f "$API_TEMPLATE" ]]; then
    echo "Error: API start prompt template not found: $API_TEMPLATE" >&2
    exit 1
fi

# Build tool display string (include version if provided)
if [[ -n "$TOOL_VER" ]]; then
    TOOL_DISPLAY="$TOOL $TOOL_VER"
else
    TOOL_DISPLAY="$TOOL"
fi

# Transform the API template
# 1. Fill in header fields
# 2. Check the correct model checkbox
# 3. Check the correct API style checkbox

API_RENDERED=$(cat "$API_TEMPLATE")

# Fill header fields
API_RENDERED="${API_RENDERED//\[Tool name + version\/build id\]/$TOOL_DISPLAY}"
API_RENDERED="${API_RENDERED//\[e.g., ToolX-ModelA-Run1\]/$RUN_ID}"
API_RENDERED="${API_RENDERED//\[commit\/tag\/hash or immutable archive id\]/$SPEC_VER}"
API_RENDERED="${API_RENDERED//\[repo-root-path\]/$REPO_ROOT}"
API_RENDERED="${API_RENDERED//\[workspace-path\]/$WORKSPACE_PATH}"

# Replace {Spec Root} placeholders in doc paths with actual repo root
API_RENDERED="${API_RENDERED//\{Spec Root\}/$REPO_ROOT}"

# Replace {Workspace Path} placeholders with actual workspace path
API_RENDERED="${API_RENDERED//\{Workspace Path\}/$WORKSPACE_PATH}"

# Check model checkbox
if [[ "$model" == "A" ]]; then
    API_RENDERED="${API_RENDERED//  - \[ \] \*\*Model A (Minimum)\*\*/  - [x] **Model A (Minimum)**}"
elif [[ "$model" == "B" ]]; then
    API_RENDERED="${API_RENDERED//  - \[ \] \*\*Model B (Full)\*\*/  - [x] **Model B (Full)**}"
fi

# Check API style checkbox
if [[ "$api_type" == "REST" ]]; then
    API_RENDERED="${API_RENDERED//  - \[ \] \*\*REST\*\* (produce an OpenAPI contract artifact)/  - [x] **REST** (produce an OpenAPI contract artifact)}"
elif [[ "$api_type" == "GraphQL" ]]; then
    API_RENDERED="${API_RENDERED//  - \[ \] \*\*GraphQL\*\* (produce a GraphQL schema contract artifact)/  - [x] **GraphQL** (produce a GraphQL schema contract artifact)}"
fi

# Save API start prompt to run folder
API_PROMPT_FILE="$RUN_DIR/start_build_api_prompt.txt"
echo "$API_RENDERED" > "$API_PROMPT_FILE"

# --- Render UI Start Prompt ---
UI_TEMPLATE="$REPO_ROOT/prompts/ui_start_prompt_template.md"
if [[ ! -f "$UI_TEMPLATE" ]]; then
    echo "Warning: UI start prompt template not found: $UI_TEMPLATE" >&2
    echo "         Skipping UI prompt generation." >&2
    UI_PROMPT_FILE=""
else
    UI_RENDERED=$(cat "$UI_TEMPLATE")

    # Fill header fields
    UI_RENDERED="${UI_RENDERED//\[Tool name + version\/build id\]/$TOOL_DISPLAY}"
    UI_RENDERED="${UI_RENDERED//\[e.g., ToolX-ModelA-Run1-UI\]/$RUN_ID-UI}"
    UI_RENDERED="${UI_RENDERED//\[commit\/tag\/hash or immutable archive id\]/$SPEC_VER}"
    UI_RENDERED="${UI_RENDERED//\[repo-root-path\]/$REPO_ROOT}"
    UI_RENDERED="${UI_RENDERED//\[workspace-path\]/$WORKSPACE_PATH}"

    # Replace {Spec Root} placeholders in doc paths with actual repo root
    UI_RENDERED="${UI_RENDERED//\{Spec Root\}/$REPO_ROOT}"

    # Replace {Workspace Path} placeholders with actual workspace path
    UI_RENDERED="${UI_RENDERED//\{Workspace Path\}/$WORKSPACE_PATH}"

    # Check model checkbox
    if [[ "$model" == "A" ]]; then
        UI_RENDERED="${UI_RENDERED//  - \[ \] \*\*Model A (Minimum)\*\*/  - [x] **Model A (Minimum)**}"
    elif [[ "$model" == "B" ]]; then
        UI_RENDERED="${UI_RENDERED//  - \[ \] \*\*Model B (Full)\*\*/  - [x] **Model B (Full)**}"
    fi

    # Check API style checkbox
    if [[ "$api_type" == "REST" ]]; then
        UI_RENDERED="${UI_RENDERED//  - \[ \] \*\*REST\*\*/  - [x] **REST**}"
    elif [[ "$api_type" == "GraphQL" ]]; then
        UI_RENDERED="${UI_RENDERED//  - \[ \] \*\*GraphQL\*\*/  - [x] **GraphQL**}"
    fi

    # Save UI start prompt to run folder
    UI_PROMPT_FILE="$RUN_DIR/start_build_ui_prompt.txt"
    echo "$UI_RENDERED" > "$UI_PROMPT_FILE"
fi

# Generate result submission instructions
cat > "$RUN_DIR/result_submission_instructions.md" <<EOF
# Result Submission Instructions

## Overview
After completing your benchmark run (API and optionally UI), you need to generate and submit a standardized result file.

## Automated Generation

### Step 1: Generate Result File
Run the result generation script from the repository root:

\`\`\`bash
cd "$REPO_ROOT"
./scripts/generate_result_file.sh --run-dir "$RUN_DIR"
\`\`\`

This will create a standardized result file (defaults to current directory) with a name like:
\`${TOOL_SLUG}_model${model}_${api_type}_run${RUN_NUMBER}_${TIMESTAMP}.json\`

**Note**: Copy the generated file to \`pawmate-ai-results/results/submitted/\` for processing.

### Step 2: Complete Result File
The generated file will contain placeholders for metrics that must be filled in. Review the file and:

1. Extract acceptance criteria results from your run
2. Fill in determinism compliance status
3. Calculate contract completeness passrate
4. Rate instructions quality (100/70/40/0)
5. Calculate scores using \`docs/Scoring_Rubric.md\`

### Step 3: Copy to Results Repository
Copy the generated result file to the results repository:

\`\`\`bash
cp {generated-filename}.json /path/to/pawmate-ai-results/results/submitted/
\`\`\`

### Step 4: Validate Result File
Before submitting, validate the result file (in the results repository):

\`\`\`bash
cd /path/to/pawmate-ai-results
./scripts/validate_result.sh results/submitted/{generated-filename}.json
\`\`\`

Fix any validation errors before proceeding.

### Step 5: Submit via Git
Once validation passes (in the results repository):

\`\`\`bash
cd /path/to/pawmate-ai-results
# Add the result file
git add results/submitted/{generated-filename}.json

# Commit
git commit -m "Add benchmark result: ${TOOL} Model ${model} ${api_type} Run ${RUN_NUMBER}"

# Push and create pull request
git push origin HEAD
# Then create a PR on GitHub
\`\`\`

## Manual Generation (if script unavailable)

If you cannot run the generation script, create the result file manually:

1. Copy \`results/result_template.json\` as a starting point
2. Follow \`docs/Result_File_Spec.md\` for the exact format
3. Fill in all required fields
4. Ensure the filename follows the naming convention
5. Validate JSON syntax before submitting

## Resources

- \`docs/Result_File_Spec.md\` - Complete specification
- \`docs/Scoring_Rubric.md\` - Score calculation rules
- \`docs/Submitting_Results.md\` - Detailed submission guide
- \`results/result_template.md\` - Template file

## Run Information

- **Run Directory**: \`$RUN_DIR\`
- **Workspace**: \`$WORKSPACE_PATH\`
- **Tool**: ${TOOL}${TOOL_VER:+ }${TOOL_VER}
- **Model**: ${model}
- **API Style**: ${api_type}
- **Spec Version**: ${SPEC_VER}
EOF

# Output summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Run initialized!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Run folder:  $RUN_DIR"
echo "  Workspace:   $WORKSPACE_PATH"
echo ""
echo "  Generated prompts:"
echo "    API: $API_PROMPT_FILE"
if [[ -n "$UI_PROMPT_FILE" ]]; then
    echo "    UI:  $UI_PROMPT_FILE"
fi
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "NEXT STEPS:"
echo ""
echo "  1. Open a new AI agent/chat session"
echo "  2. Copy the contents of the API start prompt:"
echo "     $API_PROMPT_FILE"
echo "  3. Paste it as the first message to build the API/backend"
echo ""
if [[ -n "$UI_PROMPT_FILE" ]]; then
    echo "  4. After API is complete, start a new session (or continue)"
    echo "  5. Copy the contents of the UI start prompt:"
    echo "     $UI_PROMPT_FILE"
    echo "  6. Paste it to build the UI (assumes API already exists)"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

