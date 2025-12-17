## Appendix H — Scoring Rubric (Operational, Evidence-Based)

## Purpose
Provide a practical rubric that converts the run logs and evidence artifacts into consistent scores across tools with minimal operator variance.

**Source of truth** for scoring rules:
- `docs/Benchmarking_Method.md` (metrics M-01..M-11, overall score, penalties, Unknown handling, table schema)

## Non-negotiable rules (Normative)
- **Evidence-first**: If required evidence is missing, record the value as **Unknown**. Do not infer or “best guess”.
- **No overreach**: Overreach incidents (`NOR-*` violations or features beyond `REQ-*`) MUST be penalized per Appendix E.
- **Two-run requirement**: Final tool scores are based on **Run 1 and Run 2**; if Run 2 is missing/Unknown, the overall score is **Unknown** (except Speed may remain Unknown until cohort exists, per Appendix E).

## Inputs required to score (Operator checklist)
You must have:
- `docs/Run_Log_Template.md` completed for Run 1 and Run 2
- Contract checklist results (Appendix A) for Run 1 and Run 2
- Acceptance checklist results (Appendix D) for Run 1 and Run 2
- Determinism/reset evidence (Appendix B) for Run 1 and Run 2

## Scoring overview (0–100)
Use Appendix E’s scoring model:
- Dimensions: **C, R, D, E, S, K**
- Overreach penalty: **P_O**
- Overall score: **Clamp 0..100** of weighted sum minus penalty

If any required dimension is **Unknown**, overall is **Unknown** (except Speed **S** may be Unknown until cohort exists).

---

## Dimension scoring anchors (Operator guidance)
This section provides *practical anchors* to reduce variance.

### C — Correctness (0–100)
**Compute** \(C = 100 \times \text{PassRate}\) using M-06.
- **PassRate definition**: \(\#Pass / (\#Pass + \#Fail)\); exclude Not-Run.
- **Anchor guidance**:
  - If an item is Not-Run because the capability does not exist, it SHOULD be recorded as **Fail** with evidence (missing behavior), not Not-Run.

### R — Reproducibility (0–100)
Use M-08 and Appendix E mapping:
- **100 (None)**: Run 1 and Run 2 have the same outcomes (acceptance, determinism) and required artifacts are complete; only non-functional differences (e.g., comments/format) may vary.
- **80 (Minor)**: Outcomes match, but minor operator-visible variance exists (small instruction changes, small timing drift, minor non-functional diffs).
- **40 (Major)**: Outcomes differ (acceptance/determinism), artifacts differ materially, or the run required different assumptions/interventions to succeed.

### D — Determinism (0–100)
Use Appendix E deductions starting from 100:
- **-50**: reset-to-seed missing or not non-interactive
- **-30**: idempotency not demonstrated (reset twice → identical)
- **-20**: golden checks fail for selected model (Appendix B invariants)
- **-20**: contract lacks ordering + tie-break rules for required collections (Appendix A)

### E — Operator Effort (0–100)
Use Appendix E deductions starting from 100:
- **-10 × interventions** (M-04)
- **-3 × clarifications** (M-03)
- **-5 × reruns** (M-05)

### S — Speed (0–100)
Use Appendix E cohort-based linear scaling using M-01 and M-02:
- Best time in cohort = 100, worst = 0, linear interpolation.
- \(S = 0.4 \cdot TTFRScore + 0.6 \cdot TTFCScore\)

### K — Contract/Docs (0–100)
Use Appendix E rules:
- ContractScore = 100 × (Appendix A checklist PassRate)
- DocsScore anchors:
  - **100**: run/reset/verify steps are fully copy/paste, non-interactive, unambiguous
  - **70**: minor ambiguities but runnable without code edits
  - **40**: significant gaps require operator inference or repeated clarification
  - **0**: missing/unusable instructions
- \(K = 0.7 \cdot ContractScore + 0.3 \cdot DocsScore\)

---

## Overreach penalty (P_O)
Apply Appendix E:
- \(P_O = 8 \times\) (overreach incidents), capped at 40.
- If incident violates `NOR-0001` (external integrations) or `NOR-0006` (both REST+GraphQL), count it as **two incidents**.


