## Appendix I — Comparison Report Template (Copy/Paste)

> **Operator instructions:** Use this template to compare multiple tools for the same **frozen spec reference** and **target model**. Fill all bracketed fields. Do not infer missing values; record **Unknown** if evidence is missing.

---

### 0) Report Header
- **report_id**: [e.g., SpecCommit-abc123-ModelA-Comparison]
- **spec_reference**: [commit/tag/hash]
- **target_model**: [A|B]
- **evaluation_window**: [date/time range]
- **tools_compared**: [Tool A, Tool B, ...]
- **notes**: [any constraints or anomalies]

---

### 1) Executive Summary (1–6 bullets)
- **Key takeaway 1**: [...]
- **Key takeaway 2**: [...]
- **Most important failure mode(s)**: [...]
- **Most important strengths**: [...]
- **Reproducibility highlight** (Run 1 vs Run 2): [...]
- **Overreach highlight**: [...]

---

### 2) Benchmark Setup (Inputs + Consistency)
- **frozen_inputs_used**:
  - `docs/Master_Functional_Spec.md`
  - `docs/API_Contract.md`
  - `docs/Seed_Data.md`
  - `docs/Image_Handling.md`
  - `docs/Acceptance_Criteria.md`
  - `docs/Benchmarking_Method.md`
- **operator_notes**: [any deviations from the standard procedure; if none, “None”]

---

### 3) Comparison Table (Exact Schema from Appendix E) (Required)
> One row per tool. Values typically reflect the average across Run 1 and Run 2 unless stated. Use **Unknown** where applicable.

#### Identification + Inputs
- tool_name
- tool_version
- target_model
- spec_reference
- run_environment

#### Timing
- ttfr_run1_minutes
- ttfr_run2_minutes
- ttfc_run1_minutes
- ttfc_run2_minutes

#### Effort + Stability
- clarifications_run1_count
- clarifications_run2_count
- interventions_run1_count
- interventions_run2_count
- reruns_run1_count
- reruns_run2_count
- reproducibility_rating (None/Minor/Major)

#### Correctness + Determinism + Overreach
- acceptance_passrate_run1
- acceptance_passrate_run2
- determinism_compliance_run1 (Pass/Fail/Unknown)
- determinism_compliance_run2 (Pass/Fail/Unknown)
- overreach_incidents_total
- overreach_notes_ref (path/anchor into run record)

#### Contract + Docs
- contract_completeness_passrate_run1
- contract_completeness_passrate_run2
- run_instructions_quality_run1 (100/70/40/0 or Pass/Partial/Fail mapped)
- run_instructions_quality_run2

#### Scoring breakdown
- score_correctness_C
- score_reproducibility_R
- score_determinism_D
- score_effort_E
- score_speed_S (may be Unknown)
- score_contract_docs_K
- penalty_overreach_PO
- overall_score_0_100 (may be Unknown)

#### Evidence pointers (required for auditability)
- run1_artifacts_path
- run2_artifacts_path

> Table entry format is operator-choice (Markdown table, CSV, spreadsheet), but the **column names above must be preserved**.

---

### 4) Score Breakdown Narrative (Per tool)
For each tool, provide a short explanation of the scores grounded in evidence.

#### [Tool Name]
- **Overall score**: [0–100|Unknown]
- **C (Correctness)**: [...]
- **R (Reproducibility)**: [...]
- **D (Determinism)**: [...]
- **E (Operator Effort)**: [...]
- **S (Speed)**: [...]
- **K (Contract/Docs)**: [...]
- **Overreach penalty (P_O)**: [...]
- **Evidence pointers**:
  - Run 1: [...]
  - Run 2: [...]

---

### 5) Notable Failures / Defects (Cross-tool)
List the most meaningful correctness/determinism failures and which tools were impacted.
- **Failure**: [short description]
  - **Impacted tools**: [...]
  - **Evidence**: [...]
  - **Notes**: [...]

---

### 6) Overreach Notes (Cross-tool)
Summarize any `NOR-*` violations or features beyond `REQ-*`.
- **Incident**: [NOR-#### or “no supporting REQ-*”]
  - **Tool(s)**: [...]
  - **Evidence**: [...]
  - **Impact**: [...]

---

### 7) Reproducibility (Run 1 vs Run 2) Diffs (Per tool)
For each tool, summarize differences between runs.

#### [Tool Name]
- **Rating**: [None|Minor|Major|Unknown]
- **Differences**:
  - TTFR/TTFC: [...]
  - Acceptance: [...]
  - Determinism: [...]
  - Artifacts: [...]
- **Evidence**: [...]

---

### 8) Contract Artifact Review Summary (Per tool)
Summarize Appendix A checklist outcomes.

#### [Tool Name]
- **Contract artifact path**: [...]
- **Checklist pass rate**: [0..1|Unknown]
- **Key gaps** (if any): [...]
- **Evidence**: [...]

---

### 9) Determinism / Reset-to-Seed Summary (Per tool)
Summarize Appendix B outcomes.

#### [Tool Name]
- **Reset-to-seed mechanism**: [API op | local command | Unknown]
- **Idempotency demonstrated**: [Pass|Fail|Unknown]
- **Golden checks**: [Pass|Fail|Unknown] (brief)
- **Evidence**: [...]

---

### 10) Appendix: Evidence Index (Optional but recommended)
Provide a quick index of the run folders and key files for auditability.
- [Tool Name] Run 1: [path]
- [Tool Name] Run 2: [path]


