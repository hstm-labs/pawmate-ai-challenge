# Developer Guide (Entrypoint)

This is the **single entrypoint** into the numbered `docs/` set. Use it to navigate the spec, appendices, and operator templates without introducing tool- or technology-specific assumptions.

## Where to start (by intent)
- **I want a high-level repo overview**: start at `../README.md`
- **I want an end-to-end operator checklist**: start at `../README.md` (see “Operator guide (step-by-step)”)
- **I want the canonical spec + appendices/templates**: start here, then follow the doc map below

## Doc map (numbered, canonical)
### Core spec + appendices (source of truth)
1. `01-Master_Functional_Spec.md` — Normative functional spec (requirements `REQ-*`, non-requirements `NOR-*`, assumptions `ASM-*`, Models A/B).
2. `02-Appendix_A_API_Contract.md` — API contract artifact requirements (choose REST *or* GraphQL; pagination, errors, ordering determinism).
3. `03-Appendix_B_Seed_Data.md` — Deterministic seed dataset + reset-to-seed + post-reset invariants (benchmark-critical).
4. `04-Appendix_C_Image_Handling.md` — Simple image handling constraints (no external integrations; deterministic image ordering).
5. `05-Appendix_D_Acceptance_Criteria.md` — Observable acceptance criteria + use-case catalog (Model A and Model B).
6. `06-Appendix_E_Benchmarking_Method.md` — Benchmark method, required artifacts, metrics, evidence-first rules.

### Operator templates (copy/paste)
7. `07-Appendix_F_Prompt_Wrapper.md` — Standardized prompt wrapper for benchmark runs (pins model + API style + frozen spec ref).
8. `08-Appendix_G_Run_Log_Template.md` — Run log template (per tool, per run) including M-01..M-11 metrics and evidence pointers.
9. `09-Appendix_H_Scoring_Rubric.md` — Evidence-based scoring rubric (Unknown handling, overreach penalties).
10. `10-Appendix_I_Comparison_Report_Template.md` — Cross-tool comparison report template + standard table schema.

## Links (relative)
- [01 — Master Functional Spec](01-Master_Functional_Spec.md)
- [02 — Appendix A: API Contract](02-Appendix_A_API_Contract.md)
- [03 — Appendix B: Seed Data](03-Appendix_B_Seed_Data.md)
- [04 — Appendix C: Image Handling](04-Appendix_C_Image_Handling.md)
- [05 — Appendix D: Acceptance Criteria](05-Appendix_D_Acceptance_Criteria.md)
- [06 — Appendix E: Benchmarking Method](06-Appendix_E_Benchmarking_Method.md)
- [07 — Appendix F: Prompt Wrapper](07-Appendix_F_Prompt_Wrapper.md)
- [08 — Appendix G: Run Log Template](08-Appendix_G_Run_Log_Template.md)
- [09 — Appendix H: Scoring Rubric](09-Appendix_H_Scoring_Rubric.md)
- [10 — Appendix I: Comparison Report Template](10-Appendix_I_Comparison_Report_Template.md)

## Conventions (keywords, IDs, scope control)
This guide is navigation + conventions only. It must not introduce new requirements.

### RFC-style keywords
Requirements are written using RFC-style keywords:
- **MUST / MUST NOT**: mandatory requirement (or prohibition)
- **SHOULD / SHOULD NOT**: strong recommendation; deviations require justification
- **MAY**: optional behavior permitted by the spec

See the “How to read this spec” intro in `docs/01-Master_Functional_Spec.md`.

### Requirement IDs, non-requirements, and assumptions
The canonical traceability tokens used across the doc set:
- **`REQ-*`**: normative requirements (the only source of “required” behavior)
- **`NOR-*`**: explicit non-goals / out-of-scope guardrails (prevent overreach)
- **`ASM-*`**: explicit assumptions (used only when the spec is ambiguous; must be “smallest compliant”)
- **`AC-*`**: acceptance criteria IDs (observable checks used to verify implementations)

Primary sources:
- `REQ-*` / `NOR-*` / `ASM-*`: `docs/01-Master_Functional_Spec.md`
- `AC-*` conventions: `docs/05-Appendix_D_Acceptance_Criteria.md`

### “Do not overreach” rule
If a behavior is not required by a `REQ-*` item (or explicitly permitted by `MAY`), it is out of scope. Overreach incidents (including `NOR-*` violations) are tracked and penalized during benchmarking.

## Model selection (A vs B) and global guardrails
The spec supports **two selectable models**:
- **Model A (Minimum)**: baseline requirements only.
- **Model B (Full)**: Model A **plus** additional “delta” requirements labeled `...-B`.

Global guardrails to preserve across all work:
- **API-first**: the API is the system of record.
- **Choose exactly one API style**: **REST _or_ GraphQL** (not both).
- **Exactly one contract artifact**: OpenAPI-like REST contract OR GraphQL schema.
- **Determinism**: deterministic seed data + **non-interactive reset-to-seed**.
- **No external integrations**; **privacy is out of scope**.

## Note on legacy Pet Store docs
This PawMate spec was derived from a prior Pet Store benchmarking harness. The PawMate source of truth is `docs/` at the repository root.


