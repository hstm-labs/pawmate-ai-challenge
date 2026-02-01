# Result File Specification

## Purpose

This document defines the standardized format for benchmark result files that enable automated collection, validation, and aggregation of results from multiple developers and AI tools.

Result files are JSON-only for maximum automation and programmatic processing.

## File Format

Result files MUST be JSON (`.json`) files containing structured data.

### Structure (v3.0 Schema)

```json
{
  "schema_version": "3.0",
  "result_data": {
    "run_identity": {
      "tool_name": "string",
      "tool_version": "string",
      "run_id": "string",
      "run_number": 1,
      "target_model": "A",
      "api_style": "REST",
      "spec_reference": "string",
      "workspace_path": "string",
      "run_environment": "string"
    },
    "implementations": {
      "api": {
        "generation_metrics": {
          "llm_model": "string (e.g., 'claude-sonnet-4.5', 'gpt-4-turbo')",
          "start_timestamp": "ISO-8601 string (UTC)",
          "end_timestamp": "ISO-8601 string (UTC)",
          "duration_minutes": "number",
          "clarifications_count": "integer",
          "interventions_count": "integer",
          "reruns_count": "integer",
          "test_runs": [
            {
              "run_number": "integer",
              "start_timestamp": "ISO-8601 string",
              "end_timestamp": "ISO-8601 string",
              "duration_minutes": "number",
              "total_tests": "integer",
              "passed": "integer",
              "failed": "integer",
              "pass_rate": "number (0.0-1.0)"
            }
          ],
          "test_iterations_count": "integer",
          "llm_usage": {
            "input_tokens": "integer or null",
            "output_tokens": "integer or null",
            "total_tokens": "integer or null",
            "requests_count": "integer or null",
            "estimated_cost_usd": "number or null",
            "usage_source": "tool_reported|operator_estimated|unknown"
          }
        },
        "acceptance": {
          "pass_count": "integer",
          "fail_count": "integer",
          "not_run_count": "integer",
          "passrate": "number (0.0-1.0)"
        },
        "artifacts": {
          "contract_artifact_path": "string (required)",
          "run_instructions_path": "string (required)",
          "acceptance_checklist_path": "string (optional)",
          "ai_run_report_path": "string (optional)",
          "automated_tests_path": "string (optional)"
        }
      },
      "ui": {
        "generation_metrics": {
          "llm_model": "string",
          "start_timestamp": "ISO-8601 string (UTC)",
          "end_timestamp": "ISO-8601 string (UTC)",
          "duration_minutes": "number",
          "clarifications_count": "integer",
          "interventions_count": "integer",
          "reruns_count": "integer",
          "backend_changes_required": "boolean",
          "llm_usage": { "...same as api..." }
        },
        "build_success": "boolean",
        "artifacts": {
          "ui_source_path": "string (required)",
          "ui_run_summary_path": "string (required)"
        }
      }
    },
    "submission": {
      "submitted_timestamp": "ISO-8601 string (UTC)",
      "submitted_by": "string",
      "submission_method": "automated|manual"
    }
  }
}
```

## Naming Convention

Result files MUST follow this naming pattern:

```
{tool-slug}_{model}_{api-type}_{run-number}_{timestamp}.json
```

Where:
- `tool-slug`: Lowercase, alphanumeric + hyphens (e.g., `cursor-v0-43`, `github-copilot`)
- `model`: `modelA` or `modelB`
- `api-type`: `REST` or `GraphQL`
- `run-number`: `run1` or `run2`
- `timestamp`: ISO-8601 format without colons (e.g., `20241218T1430`)

Example: `cursor-v0-43_modelA_REST_run1_20241218T1430.json`

## Required Fields

### Schema Version
- **Field**: `schema_version`
- **Type**: String
- **Required**: Yes
- **Description**: Version of this specification (currently "3.0" — see `pawmate-ai-results/schemas/result-schema-v3.0.json`)
- **Purpose**: Enables future schema evolution

### Run Identity
All fields in `result_data.run_identity` are required and MUST match the values from `run.config` or be explicitly provided.

### Metrics
All fields in `result_data.metrics` are required. Use `"Unknown"` if evidence is missing (per `docs/Benchmarking_Method.md` evidence-first rule).

#### Operator Intervention Tracking (v3.0 Schema)

The benchmark measures how well the AI creates the entire application from the initial prompts without operator assistance. The following fields track operator interventions:

**For API Implementation** (`result_data.implementations.api.generation_metrics`):
- **`clarifications_count`**: Number of questions the AI asked that required operator input to proceed. Ideal: 0
- **`interventions_count`**: Number of manual code edits, config changes, or file modifications performed by the operator. Ideal: 0 (any non-zero value indicates the AI needed manual fixes)
- **`reruns_count`**: Number of times the prompt was re-issued or the run was restarted. Ideal: 0

**For UI Implementation** (`result_data.implementations.ui.generation_metrics`):
- **`clarifications_count`**: Number of questions the AI asked that required operator input to proceed. Ideal: 0
- **`interventions_count`**: Number of manual code edits, config changes, or file modifications performed by the operator. Ideal: 0
- **`reruns_count`**: Number of times the prompt was re-issued or the run was restarted. Ideal: 0
- **`backend_changes_required`**: Boolean indicating whether the UI build required changes to the backend/API code. Ideal: false

**Note on Continuation Prompts**: The number of "continue" messages sent when the AI stops before completion should be included in `interventions_count` if they were necessary to complete the work. The ideal benchmark run requires zero continuation prompts — the AI should work autonomously from the initial prompts to completion.

**Recording Interventions**: Operators should track these counts during the run and record them in the AI run report or run notes. The result file generation script will attempt to extract these from the AI run report, but operators may need to manually add them if not automatically detected.

### Scores
All fields in `result_data.scores` are required. May be `"Unknown"` if required metrics are unknown.

### Artifacts
All fields in `result_data.artifacts` are required. Paths MUST be relative to the repository root or absolute paths. Use empty string `""` if artifact is missing.

### Submission Metadata
- **submitted_timestamp**: ISO-8601 UTC timestamp when result was generated/submitted
- **submitted_by**: Identifier of submitter (e.g., GitHub username, email, or "AI-tool-name")
- **submission_method**: `"automated"` if generated by AI tool, `"manual"` if created by operator

## Notes

Result files are JSON-only for maximum automation. For human-readable reports, see the generated comparison reports in `pawmate-ai-results/results/compiled/` (generated after submitting result files to the results repository).

## Validation Rules

### Format Validation
1. File MUST be valid JSON
2. File MUST validate against JSON schema (`pawmate-ai-results/schemas/result-schema-v3.0.json`)
3. All required fields MUST be present
4. Field types MUST match specification
5. Enum values MUST be from allowed sets
6. Timestamps MUST be valid ISO-8601 UTC format (YYYY-MM-DDTHH:MM:SS.sssZ)
7. File name MUST match naming convention

### Data Validation
1. `run_number` MUST be 1 or 2
2. `target_model` MUST be "A" or "B"
3. `api_style` MUST be "REST" or "GraphQL"
4. `acceptance.model` MUST match `target_model`
5. Numeric scores MUST be in range 0-100 (or "Unknown")
6. Pass rates MUST be in range 0-1 (or "Unknown")
7. Timestamps MUST be chronologically valid (end >= start)

### Evidence Validation
1. Referenced artifact paths SHOULD exist (warning if missing, not error)
2. Evidence paths SHOULD be accessible (warning if not, not error)

## Schema Evolution

Future schema versions will:
- Maintain backward compatibility where possible
- Use semantic versioning (MAJOR.MINOR.PATCH)
- Document migration paths for breaking changes
- Support multiple schema versions during transition periods

## Example

See `results/result_template.json` for a complete example with all required fields populated.

## Related Documents

- `docs/Benchmarking_Method.md` - Metric definitions and evidence requirements
- `docs/Scoring_Rubric.md` - Scoring calculations
- `docs/Comparison_Report_Template.md` - Aggregation output format

