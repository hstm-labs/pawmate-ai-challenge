# Result Schema Improvement Proposal - v2.0

## Issue

The current result schema (v1.0) fundamentally misunderstands the relationship between API and UI generation by treating them as sequential phases of a single run. This creates several problems:

1. **API and UI are independent implementations** - The UI might be built days, weeks, or never after the API
2. **Combined timing doesn't make sense** - TTFC combines unrelated time periods
3. **Can't track separate quality metrics** - UI has different success criteria than API
4. **Prevents meaningful comparisons** - Can't compare API-only runs with API+UI runs

## Fundamental Conceptual Issue

**Current v1.0 thinking:**
```
Run = API Generation → UI Generation (combined total time)
```

**Correct v2.0 thinking:**
```
Run = {
  API Implementation (independent, with its own timing/metrics),
  UI Implementation (optional, independent, with its own timing/metrics)
}
```

The API and UI are **separate implementations**, not sequential phases. They:
- Can be built at different times (even by different agents)
- Have different acceptance criteria and quality metrics
- Should have independent timing and scoring
- May or may not both exist for a given run

## Proposed Schema v2.0 - Complete Restructure

### Core Concept: `implementations` object

Instead of a single flat `metrics` object, separate implementations into independent sections:

```json
{
  "implementations": {
    "api": {
      "generation_metrics": {
        "llm_model": "claude-sonnet-4.5",
        "start_timestamp": "2025-12-18T14:07:00.000Z",
        "end_timestamp": "2025-12-18T14:20:40.000Z",
        "duration_minutes": 13.67,
        "clarifications_count": 0,
        "interventions_count": 0,
        "reruns_count": 1
      },
      "acceptance": { /* API acceptance metrics */ },
      "quality_metrics": { /* API quality */ },
      "artifacts": { /* API artifacts */ },
      "scores": { /* API scores */ }
    },
    "ui": {
      "generation_metrics": {
        "llm_model": "claude-sonnet-4.5",
        "start_timestamp": "2025-12-18T20:30:45.123Z",
        "end_timestamp": "2025-12-18T21:10:00.000Z",
        "duration_minutes": 39.25,
        "clarifications_count": 0,
        "interventions_count": 1,
        "reruns_count": 0,
        "backend_changes_required": false
      },
      "quality_metrics": { /* UI quality */ },
      "artifacts": { /* UI artifacts */ },
      "scores": { /* UI scores */ }
    }
  }
}
```

### Key Changes from v1.0:

1. **Removed `ttfr` and `ttfc`** - These concepts don't make sense when API and UI are independent
2. **Added `llm_model` field** - Track which LLM was used for each implementation (can be different)
3. **Each implementation has its own timing** - Independent start/end/duration
4. **Separate quality metrics** - API has determinism/contract, UI has integration/UX
5. **Separate scoring** - API and UI scored independently
6. **UI is optional** - Can have API-only results
7. **No combined metrics** - Each implementation stands alone

## Benefits

1. **Conceptually correct** - API and UI are independent implementations, schema reflects this
2. **Independent timing** - Each implementation tracked separately, no artificial "total"
3. **Flexible workflow** - UI can be added later, by different agent, or not at all
4. **Better comparison** - Can compare:
   - Tool A API vs Tool B API (apples to apples)
   - Tool A UI vs Tool B UI (separate comparison)
   - Tool A with UI vs Tool A without UI (understand overhead)
5. **Independent scoring** - API excellence doesn't depend on UI being built
6. **Clearer metrics** - Each implementation has appropriate quality measures

## Migration Path

**v1.0 → v2.0 is a breaking change** (not backward compatible). Migration:

1. **For API-only results**: Extract metrics from v1.0 into `implementations.api`
2. **For API+UI results**: Split v1.0 metrics into separate `api` and `ui` sections
3. **For new runs**: Use v2.0 from the start
4. **Tooling**: Update validation and aggregation scripts to handle v2.0
5. **Coexistence**: Can maintain both schemas during transition period

## Implementation Example

See:
- `results/submitted/cursor_modelA_REST_run1_20251218T1407_v2.json` (example with both API and UI)
- `results/schemas/result-schema-v2.0-proposed.json` (proposed schema)

## Data Capture Best Practices

For AI agents generating API and/or UI:

### API Implementation:
1. **Record LLM model:**
   ```
   llm_model: "claude-sonnet-4.5"  (or "gpt-4", "claude-opus-3", etc.)
   ```

2. **Record at start:**
   ```
   api_generation_started: [timestamp in ISO-8601 UTC]
   ```

3. **Record at completion:**
   ```
   api_generation_completed: [timestamp in ISO-8601 UTC]
   ```

4. **Calculate duration:**
   ```
   duration_minutes = (end - start) in minutes
   ```

### UI Implementation (if applicable):
1. **Record LLM model:**
   ```
   llm_model: "claude-sonnet-4.5"  (may differ from API model!)
   ```

2. **Record at start:**
   ```
   ui_generation_started: [timestamp in ISO-8601 UTC]
   ```
   
3. **Record at completion:**
   ```
   ui_generation_completed: [timestamp in ISO-8601 UTC]
   ```

4. **Calculate duration:**
   ```
   duration_minutes = (end - start) in minutes
   ```

### Key Points:
- **Track LLM model separately** - API and UI may use different models
- **No combined timing** - API and UI durations are independent
- **UTC timestamps** - Always use UTC with timezone (Z suffix)
- **Separate interventions** - Track clarifications/interventions per implementation
- **UI can be later** - UI start timestamp might be hours/days after API completion

### LLM Model Naming Convention:
Use descriptive model names:
- `"claude-sonnet-4.5"` (not just "claude")
- `"gpt-4-turbo"` (not just "gpt-4")
- `"claude-opus-3"` 
- `"gpt-4o"`
- Include version/variant for comparison accuracy

## Recommendation

**Adopt schema v2.0** for all future benchmark runs. This schema:
- Correctly models API and UI as independent implementations
- Enables fair comparison across tools (API-to-API, UI-to-UI)
- Supports flexible workflows (UI can be added later or not at all)
- Provides independent quality metrics and scoring for each implementation

**Breaking Change Notice:** v2.0 is not backward compatible with v1.0. Existing v1.0 results will need migration if comparison with v2.0 results is required.

## Real-World Example

**Current Run (cursor ModelA REST):**
- **API Implementation**: Started 14:07 UTC, completed 14:20 UTC (13.67 minutes)
- **UI Implementation**: Started 20:30 UTC (6+ hours later), completed 21:10 UTC (39.25 minutes)

With v1.0 schema, we'd try to calculate a meaningless "total time" of 7+ hours.

With v2.0 schema, we correctly record:
- API took 13.67 minutes
- UI took 39.25 minutes
- They were built at different times (independent implementations)

