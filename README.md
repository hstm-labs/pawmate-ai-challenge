# PawMate AI Challenge — Docs-Driven Benchmark Spec (Tool-Agnostic)

This repository is a **documentation-first benchmarking harness**: a technology-agnostic functional specification and operator templates used to evaluate AI coding tools in a **repeatable, evidence-based** way.

It is **not** an application implementation repo. It provides the *frozen spec inputs*, constraints, and record-keeping templates that benchmark operators use to run the same target through multiple tools and compare outcomes.

## Mission statement (benchmark intent)
PawMate is an ethical pet **adoption management** domain:
**Helping animals find homes—and people find friends**.

This challenge is designed to be harder than a commerce catalog by adding:
- **Animal lifecycle state machines**
- **Decision workflows**
- **Policy enforcement**
- **Decision transparency / explainability**

## Core constraints (read this first)
The spec is designed to support reproducible benchmarking. Key constraints include:

- **Two selectable models**:
  - **Model A (Minimum)**: baseline capability set.
  - **Model B (Full)**: Model A plus additional requirements.
- **API-first**: the API is the **system of record**; any UI is optional and non-normative.
- **Choose exactly one API style**: **REST _or_ GraphQL** (do not implement both).
- **One contract artifact is required**:
  - REST: a machine-readable REST contract (e.g., OpenAPI)
  - GraphQL: a schema contract artifact
- **Determinism + reset-to-seed**: implementations must define a deterministic seed dataset and provide a **non-interactive reset-to-seed** mechanism suitable for repeated runs.
- **No external integrations**: do not require third-party services (including external storage/CDN, email/SMS, SSO providers, etc.).
- **No scope creep / overreach**: do not invent features beyond explicit `REQ-*` requirements; out-of-scope areas are labeled `NOR-*`.
- **Privacy is out of scope**: privacy requirements are explicitly non-goals for this benchmark.

## Spec versioning
The spec uses **semantic versioning** with git tags for immutable references.

### Finding the current version
- **Root file**: `SPEC_VERSION` contains the canonical version string (e.g., `v1.0.0`).
- **Spec header**: The same version appears at the top of `docs/01-Master_Functional_Spec.md`.

### Citing a frozen spec reference
When running a benchmark, use the spec version tag as the **Frozen Spec Reference** (e.g., `v1.0.0`). This ensures reproducibility—anyone can check out that exact tag to see the spec you used.

### Releasing a new spec version
1. Edit the spec docs as needed.
2. Decide the next SemVer (`vMAJOR.MINOR.PATCH`).
3. Update `SPEC_VERSION` and the header in `docs/01-Master_Functional_Spec.md` to the new version.
4. Commit with a message like: `spec: bump to vX.Y.Z`.
5. Create an **annotated** git tag on that commit:
   ```bash
   git tag -a vX.Y.Z -m "Spec version vX.Y.Z"
   ```
6. Push the commit and tag:
   ```bash
   git push origin main --tags
   ```

### Verifying spec version consistency
Run the verification script to check that `SPEC_VERSION`, the spec doc, and the git tag are in sync:
```bash
./scripts/verify_spec_version.sh            # informational check
./scripts/verify_spec_version.sh --require-tag  # strict check (for releases/CI)
```

## Canonical docs (source of truth)
- `docs/01-Master_Functional_Spec.md` — the functional spec, requirement IDs (`REQ-*`), non-requirements (`NOR-*`), Model A/B.
- `docs/02-Appendix_A_API_Contract.md` — contract artifact requirements (REST/GraphQL).
- `docs/03-Appendix_B_Seed_Data.md` — deterministic seed dataset + reset-to-seed requirements.
- `docs/04-Appendix_C_Image_Handling.md` — image handling constraints (if applicable to the selected model).
- `docs/05-Appendix_D_Acceptance_Criteria.md` — acceptance criteria used to determine “feature complete”.
- `docs/06-Appendix_E_Benchmarking_Method.md` — benchmarking procedure + required artifacts + evidence-first scoring inputs.

## How to run a benchmark (quickstart — links first)
Use the templates in `docs/` rather than inventing new process.

- **Choose a target**:
  - Pick **Model A** or **Model B** in `docs/01-Master_Functional_Spec.md`.
  - Pick exactly one API style: **REST** or **GraphQL** (do not implement both).
- **Run with the standardized wrapper**:
  - Copy/paste and fill the template in `docs/07-Appendix_F_Prompt_Wrapper.md`.
  - Keep the “frozen spec reference” pinned and record any assumptions as `ASM-*` (per the wrapper/spec).
- **Record the run as you go**:
  - Use `docs/08-Appendix_G_Run_Log_Template.md` (one per tool, per run; Run 1 and Run 2).
- **Score and compare (evidence-first)**:
  - Score using `docs/09-Appendix_H_Scoring_Rubric.md` (grounded in Appendix E metrics/evidence).
  - Compare tools using `docs/10-Appendix_I_Comparison_Report_Template.md`.

## First benchmark run (from “nothing” to a runnable app artifact)
This repo is the **spec harness**. The **usable application** is the artifact produced by the AI tool under test (code + run instructions + contract + evidence bundle).

- **Get the repo locally**
  - Clone the repository (use your repo URL) and open it in your tool/IDE.
  - Record the frozen spec reference (the spec version tag, e.g., `v1.0.0`) for the run log.
- **Pick a benchmark target**
  - Choose **Model A** or **Model B** in `docs/01-Master_Functional_Spec.md`.
  - Choose exactly one API style: **REST** or **GraphQL**.
- **Create a run folder (operator-owned)**
  - Create a folder to store artifacts (prompt text, transcript, evidence) for Run 1.
  - Copy `docs/08-Appendix_G_Run_Log_Template.md` into that folder and start filling it.
- **Run the AI tool under test**
  - Copy/paste `docs/07-Appendix_F_Prompt_Wrapper.md` into the tool and fill only the bracketed fields.
  - The tool should generate a runnable implementation **in your workspace**, plus a contract artifact and run instructions.
- **Verify “first runnable” and capture evidence**
  - Follow the tool’s run instructions to start the application (non-interactive commands).
  - Stop TTFR when the system is runnable (Appendix E) and record evidence.
- **Verify reset-to-seed + acceptance**
  - Run reset-to-seed twice and verify golden checks (Appendix B).
  - Run acceptance checks (Appendix D) and record pass/fail + evidence.

### Operator guide (step-by-step)
This repository does **not** ship an application. The “usable application” is created by the AI tool under test in your local workspace, along with the benchmark artifact bundle (contract + instructions + evidence).

#### Starting from zero (have not even cloned the repo yet)
0) **Get the repository locally**
- Clone it:
  - `git clone https://github.com/rsdickerson/pawmate-ai-challenge.git`
  - If you fork this repo, substitute your fork URL in the clone command.
- Open the folder in your AI tool/IDE.
- Record a frozen spec reference for the run log (use the spec version tag, e.g., `v1.0.0`).

1) **Select the benchmark target**
- Choose **Model A** or **Model B** in `docs/01-Master_Functional_Spec.md`.
- Choose exactly one API style: **REST** or **GraphQL**.

2) **Create a Run 1 folder (operator-owned artifacts)**
- Create a run folder (example): `runs/[tool_name]/[spec_ref]/Model[A|B]/Run1/`
- Copy `docs/08-Appendix_G_Run_Log_Template.md` into it and start filling it.

3) **Start Run 1 (the AI run that produces the application)**
- Copy/paste `docs/07-Appendix_F_Prompt_Wrapper.md` into the AI tool as the first message.
- Fill only the bracketed fields (tool/version, run id, frozen spec reference, workspace path, model, API style).

4) **TTFR (“first runnable”)**
- Follow the tool’s run instructions (copy/paste; non-interactive).
- TTFR ends when the system is runnable without operator code edits (see `docs/06-Appendix_E_Benchmarking_Method.md`).

5) **Determinism + acceptance (TTFC)**
- Run reset-to-seed twice and verify Appendix B golden checks (`docs/03-Appendix_B_Seed_Data.md`).
- Run acceptance checks for the selected model and save pass/fail evidence (`docs/05-Appendix_D_Acceptance_Criteria.md`).

6) **Required artifacts to keep**
- Tool prompt wrapper text (exact)
- Full tool transcript
- Run instructions (run / reset-to-seed / verify acceptance)
- Contract artifact (OpenAPI or GraphQL schema)
- Acceptance checklist + evidence bundle
- Determinism evidence bundle
- Overreach notes/evidence

## Repository note (migration context)
- This PawMate spec was derived from a prior **Pet Store** benchmarking harness.
- The **PawMate** canonical spec lives in `docs/` at the repository root.


