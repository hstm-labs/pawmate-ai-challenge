PAWMATE AI CHALLENGE — OPERATOR GUIDE (DOCS-ONLY REPO)
=====================================================

WHAT THIS IS
------------
This repository contains a documentation-first, tool-agnostic benchmarking spec and
operator templates for evaluating AI coding tools in a repeatable, evidence-based way.

This repo does NOT ship an application implementation. It provides:
- the "frozen spec" inputs (what to build),
- strict scope guardrails (what NOT to build),
- and the operator templates used to run, record, score, and compare benchmark runs.

PAWMATE DOMAIN (WHY IT’S DIFFERENT)
----------------------------------
PawMate is a pet adoption management domain:
Helping animals find homes—and people find friends.

This benchmark increases difficulty via:
- explicit animal lifecycle state machines
- adoption application evaluation + decisions
- policy enforcement + override logging
- decision transparency / explainability

KEY CONSTRAINTS (SUMMARY)
-------------------------
- Two selectable models: Model A (Minimum) or Model B (Full).
- API-first: the API is the system of record; UI is optional.
- Choose exactly ONE API style: REST OR GraphQL (do not implement both).
- Exactly ONE contract artifact is required:
  - REST: machine-readable REST contract (e.g., OpenAPI)
  - GraphQL: GraphQL schema
- Determinism is required: deterministic seed data + a non-interactive reset-to-seed mechanism.
- No external integrations (no third-party services).
- No overreach: do not add features beyond explicit REQ-*; out-of-scope items are NOR-*.
- Privacy requirements are out of scope.

ARTIFACT OVERVIEW (WHERE THINGS LIVE)
-------------------------------------
1) Canonical spec + appendices (source of truth)
   - docs/01-Master_Functional_Spec.md
       Functional requirements, REQ-* IDs, NOR-* guardrails, Model A/B definition.
   - docs/02-Appendix_A_API_Contract.md
       Contract artifact requirements (REST/GraphQL), errors, pagination, ordering determinism.
   - docs/03-Appendix_B_Seed_Data.md
       Deterministic seed dataset + reset-to-seed requirements and golden checks.
   - docs/04-Appendix_C_Image_Handling.md
       Image handling constraints (if images apply to the selected model).
   - docs/05-Appendix_D_Acceptance_Criteria.md
       Acceptance criteria (how "feature complete" is determined).
   - docs/06-Appendix_E_Benchmarking_Method.md
       End-to-end benchmark procedure, required artifacts, metrics (M-01..M-11), evidence rules.

2) Operator templates (copy/paste)
   - docs/07-Appendix_F_Prompt_Wrapper.md
       Standardized prompt wrapper used to start each run (pins model, API style, spec ref, guardrails).
   - docs/08-Appendix_G_Run_Log_Template.md
       Run record template (per tool, per run) including metrics M-01..M-11 and evidence pointers.
   - docs/09-Appendix_H_Scoring_Rubric.md
       How to score runs (evidence-first; Unknown handling; overreach penalties).
   - docs/10-Appendix_I_Comparison_Report_Template.md
       How to compare multiple tools for the same spec ref + model, including a standard table schema.

3) Root readmes (roles)
   - README.md
       High-level repository overview, constraints, and links-first quickstart.
   - README.txt (this file)
       Plain-text, step-by-step operator guide for distributing or printing.


RUN A BENCHMARK (END-TO-END CHECKLIST)
-------------------------------------
This is a tool-agnostic checklist. Use the canonical templates in docs/07..docs/10 for
copy/paste content and recordkeeping.

STARTING FROM ZERO (HAVE NOT EVEN CLONED THE REPO YET)
------------------------------------------------------
This repo is the SPEC HARNESS. The “usable application” is the implementation produced by the
AI tool under test in your local workspace (plus a contract artifact + run instructions + evidence).

0) Get the repository locally
   a) Obtain the repository URL from your source control host.
      NOTE: If you fork this repo, use your fork’s URL in the clone command below.
   b) Clone it locally:
      - git clone https://github.com/rsdickerson/pawmate-ai-challenge.git
      - cd [repo-folder]
   c) Open the folder in your AI tool/IDE.
   d) Record a frozen spec reference for the run log:
      - Preferred: git commit SHA (e.g., output of: git rev-parse HEAD)
      - Alternative: tag name, or immutable archive id/hash if not using git

1) Select the benchmark target (before you start any tool)
   a) Choose ONE model: Model A (Minimum) OR Model B (Full).
      - Source of truth: docs/01-Master_Functional_Spec.md
   b) Choose ONE API style: REST OR GraphQL (do not implement both).
   c) Decide what you are benchmarking:
      - tool name + version/build id
      - environment (OS/arch + runtime versions)

2) Create a Run 1 folder (operator-owned artifacts)
   a) Create a folder for Run 1 artifacts (location is operator choice). Example:
      - runs/[tool_name]/[spec_ref]/Model[A|B]/Run1/
   b) Save a copy of the prompt wrapper text you will submit (exact text) into the run folder.
   c) Create a Run 1 record file by copying:
      - docs/08-Appendix_G_Run_Log_Template.md
      into your run folder and begin filling it.

3) Start Run 1 (the AI run that produces the application)
   a) Copy/paste docs/07-Appendix_F_Prompt_Wrapper.md into the AI tool as the FIRST message.
   b) Fill only the bracketed fields:
      - Tool Under Test, Run ID, Frozen Spec Reference, Workspace Path
      - Target Model selection (A or B)
      - API Style selection (REST or GraphQL)
   c) Start the timer at prompt submission (TTFR/TTFC are measured from this point).

4) During Run 1 (capture clarifications + assumptions)
   a) Record any clarification questions the tool asks that require your input (M-03).
   b) Record any explicit assumptions the tool makes as ASM-#### (smallest compliant).
   c) Save the full tool transcript to the run folder (raw).

5) “First runnable” stop condition (TTFR)
   a) Follow the tool’s “Run Instructions” exactly (copy/paste, non-interactive).
   b) TTFR ends when:
      - the tool has provided complete run instructions, AND
      - following them results in the system being runnable without operator code edits.
   c) Record:
      - the exact commands executed
      - the first successful start confirmation evidence (log line or screenshot)

6) Determinism requirement (reset-to-seed + golden checks)
   a) Invoke reset-to-seed twice (must be non-interactive and idempotent).
   b) Verify Appendix B golden checks after reset:
      - seeded animals exist (ANM-0001..ANM-0005 golden fields)
      - seeded images exist and ordering rules hold (if images in scope)
      - seeded applications/history expectations as applicable
      - Model B only: seeded users exist and search queries match expected IDs
   c) Save evidence outputs into the run folder.

7) Feature complete stop condition (TTFC)
   a) Run acceptance checks for the selected model (Appendix D) and record pass/fail with evidence.
   b) TTFC ends when:
      - reset-to-seed + determinism checks are runnable and evidenced, AND
      - the implementation is feature-complete per Appendix D for the selected model.

8) Required Run 1 artifacts (what you must have at the end)
   a) Implementation in the workspace (the usable application artifact)
   b) Run instructions (run / reset-to-seed / verify acceptance)
   c) Contract artifact (OpenAPI if REST, schema if GraphQL)
   d) Acceptance checklist + evidence bundle (Appendix D mapped)
   e) Determinism evidence bundle (Appendix B reset + golden checks)
   f) Overreach notes/evidence (NOR-* violations or features beyond REQ-*)

9) Run 2 (reproducibility requirement)
   Repeat the full process for Run 2 using the same:
   - frozen spec reference
   - target model
   - API style
   and record differences between runs (Appendix E).

1) Select the benchmark target (before you start any tool)
   a) Choose ONE model: Model A (Minimum) OR Model B (Full).
      - Source of truth: docs/01-Master_Functional_Spec.md
   b) Choose ONE API style: REST OR GraphQL (do not implement both).
   c) Freeze and record the spec reference you are benchmarking (commit/tag/hash or other
      immutable identifier) and the in-scope file list (at minimum docs/01..docs/06).

2) Prepare a clean starting state
   a) Start from a clean workspace for the frozen spec reference.
   b) Ensure no leftover generated artifacts from prior runs/tools.

3) Run the tool twice (reproducibility requirement)
   You will perform two independent runs for the same tool + model + spec reference:
   - Run 1: ToolX-Model[ A|B ]-Run1
   - Run 2: ToolX-Model[ A|B ]-Run2

4) For each run (Run 1 and Run 2)
   a) Create a run record file using docs/08-Appendix_G_Run_Log_Template.md.
   b) Copy/paste the standardized prompt wrapper from docs/07-Appendix_F_Prompt_Wrapper.md,
      fill only the bracketed fields, and submit it to the tool under test.
   c) Start timing at prompt submission (TTFR/TTFC are measured from this point).
   d) As the run proceeds:
      - Record clarifications the tool asks that require your input (M-03).
      - Record any reruns/regenerations you trigger (M-05) and why.
      - Record any manual edits you make beyond copy/paste execution (M-04).
      - If required evidence is missing, record values as Unknown and note what evidence
        is missing (do not guess).
   e) Collect the required artifacts for the run (store in a run folder):
      - Prompt wrapper text used (exact)
      - Full tool transcript
      - Generated run instructions (run / reset-to-seed / verify acceptance)
      - Contract artifact (OpenAPI for REST OR GraphQL schema for GraphQL)
      - Acceptance evidence (mapped to Appendix D)
      - Determinism evidence (reset-to-seed + golden checks)
      - Overreach notes/evidence (NOR-* violations or features beyond REQ-*)

5) Fill the required run metrics (M-01..M-11) in the run record template
   Use docs/08-Appendix_G_Run_Log_Template.md and ensure all metrics are recorded:
   - M-01 TTFR (time to first runnable)
   - M-02 TTFC (time to feature complete)
   - M-03 Clarifications requested
   - M-04 Operator interventions (manual edits)
   - M-05 Reruns/regeneration attempts
   - M-06 Acceptance pass rate (Model A or B)
   - M-07 Overreach incidents
   - M-08 Reproducibility notes (Run 1 vs Run 2)
   - M-09 Determinism compliance (seed + reset)
   - M-10 Contract artifact completeness
   - M-11 Run instructions quality

6) Evidence rule (do not guess)
   If you cannot produce the required evidence for a metric, record the value as Unknown
   and write down what evidence is missing. Scoring is evidence-first.


NOTE ON LEGACY CONTENT
----------------------
This PawMate spec was derived from a prior Pet Store benchmarking harness.
The PawMate source of truth is the root docs/ folder.


