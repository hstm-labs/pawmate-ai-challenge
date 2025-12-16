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
  - Record the frozen spec reference (e.g., commit SHA) for the run log.
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

For the full step-by-step operator checklist, see `README.txt`.

## Repository note (migration context)
- This PawMate spec was derived from a prior **Pet Store** benchmarking harness.
- The **PawMate** canonical spec lives in `docs/` at the repository root.


