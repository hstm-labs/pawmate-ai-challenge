## API Start Prompt (Template)

> **Recommended:** Use the prompt renderer to generate a pre-filled version of this template:
> ```bash
> ./scripts/initialize_run.sh --profile model-a-rest --tool "YourTool" --tool-ver "1.0"
> ```
> This auto-creates a run folder, fills all header fields, and checks the correct model/API checkboxes.

> **Manual instructions:** If not using the renderer, copy/paste this entire template into the Tool Under Test (TUT) as the first message for a benchmark run. Fill only the bracketed fields. Do not add additional requirements not present in the frozen spec.

---

### 0) Benchmark Header (Operator fills)
- **Tool Under Test (TUT)**: [Tool name + version/build id]
- **Run ID**: [e.g., ToolX-ModelA-Run1]
- **Frozen Spec Reference**: [commit/tag/hash or immutable archive id]
- **Spec Root**: [repo-root-path]
- **Workspace Path**: [workspace-path]
- **Target Model (choose exactly one)**:
  - [ ] **Model A (Minimum)**
  - [ ] **Model B (Full)**
- **API Style (choose exactly one; DO NOT implement both)**:
  - [ ] **REST** (produce an OpenAPI contract artifact)
  - [ ] **GraphQL** (produce a GraphQL schema contract artifact)

---

### 1) Role + Objective (Tool must follow)
You are an implementation agent for a reproducible benchmarking run. Your objective is to produce a complete implementation that satisfies the frozen spec **for the selected Target Model** and to generate a benchmark-ready artifact bundle (run instructions, contract artifact, acceptance and determinism evidence pointers).

**⏱️ FIRST ACTION — Record Start Time:**
Before doing anything else, record the current timestamp in ISO-8601 format as `generation_started`. Output it immediately in your first response, like this:

```
generation_started: 2024-12-17T10:00:00Z
```

This timestamp is critical for benchmarking and MUST be recorded before any code generation begins.

---

### 1.0) Run Independence — No Cross-Run References (MUST)
This run MUST be treated as fully independent:
- You MUST NOT reference, rely on, or mention any previous runs, prior attempts, earlier chats, or other run folders.
- You MUST treat this prompt and the frozen spec files as the complete context for this run.
- If you encounter existing files under the **Workspace Path**, treat them as the current run's workspace state only; do not assume they were produced by a prior run unless explicitly stated in the prompt.

**IMPORTANT — File locations:**
- **Read spec files from:** the **Spec Root** path (frozen spec docs live there under `docs/`)
- **Write ALL generated files to:** the **Workspace Path** (all code, configs, artifacts, and outputs MUST be created inside this folder)

**CRITICAL — Workspace layout:**
- Place backend/API code under: `{Workspace Path}/backend/`
- Reserve `{Workspace Path}/ui/` for UI (generated separately via the UI start prompt)
- Place benchmark artifacts under: `{Workspace Path}/benchmark/`

You MUST work strictly within scope and MUST NOT invent requirements. If something is ambiguous, you MUST either ask a clarification question or record the smallest compliant assumption as an explicit `ASM-####`.

---

### 1.1) Timing Integrity — No Confirmation Pauses (MUST)
**CRITICAL FOR BENCHMARKING:** To ensure accurate timing measurements:
- You MUST NOT pause to ask "should I create this file?" or similar confirmations.
- You MUST write files immediately without waiting for human approval.
- You MUST proceed continuously through implementation without unnecessary stops.
- The only acceptable pauses are for genuine clarification questions about ambiguous requirements.

Pausing for file-creation confirmations corrupts the timing measurements that compare tools.

---

### 2) In-Scope Inputs (Frozen Spec Files)
You MUST treat the following files (located under the **Spec Root**) as the sole source of truth and keep them consistent:
- `{Spec Root}/docs/Master_Functional_Spec.md`
- `{Spec Root}/docs/API_Contract.md`
- `{Spec Root}/docs/Seed_Data.md`
- `{Spec Root}/docs/Image_Handling.md`
- `{Spec Root}/docs/Acceptance_Criteria.md`
- `{Spec Root}/docs/Benchmarking_Method.md`

If any behavior is not required by a `REQ-*` item, it is out of scope unless explicitly allowed by `MAY`.

---

### 3) Hard Guardrails (MUST)

#### 3.1 Overreach guardrails (`NOR-*`)
You MUST comply with all `NOR-*` items in the Master Spec. In particular:
- You MUST NOT require any external integrations (`NOR-0001`).
- You MUST NOT implement commerce flows (`NOR-0002`), promotions (`NOR-0003`), or messaging/chat (`NOR-0004`).
- Privacy requirements are out of scope (`NOR-0005`).
- You MUST choose **one** API style (REST or GraphQL) and produce **one** corresponding contract artifact (`NOR-0006`).
- You MUST NOT add features not required by `REQ-*` items (`NOR-0007`).

#### 3.2 Assumptions (`ASM-*`)
- Any assumption MUST be explicitly labeled `ASM-####` and listed in an "Assumptions" section.
- Assumptions MUST be the smallest reasonable interpretation that remains compliant.
- If you need operator input, ask a clarification question and wait.

---

### 4) Required Outputs (MUST)
Your deliverable MUST include all of the following:

#### 4.1 Implementation (code + configs)
- A working implementation for the selected Target Model.
- Must be runnable from a clean workspace using non-interactive commands.

#### 4.2 API Contract Artifact (Appendix A compliant) (MUST)
Produce exactly one contract artifact based on the selected API style:
- If **REST**: OpenAPI (or equivalent machine-readable REST contract) that satisfies Appendix A.
- If **GraphQL**: GraphQL schema that satisfies Appendix A.

The contract artifact MUST explicitly define:
- operations required for the selected model (animals, lifecycle transitions, applications/evaluation/decision, history; plus Model B deltas if selected)
- request/response shapes
- error categories (`ValidationError`, `NotFound`, `Conflict`, `AuthRequired`, `Forbidden` where applicable)
- pagination rules for collection operations
- deterministic ordering + tie-break rules for collection operations

#### 4.3 Deterministic Seed + Reset-to-Seed (Appendix B compliant) (MUST)
You MUST implement and document a **non-interactive reset-to-seed** mechanism that:
- restores the canonical seed dataset for the selected model
- is idempotent (safe to run twice)
- supports verification of Appendix B golden records and determinism checks

#### 4.4 Image handling constraints (Appendix C compliant) (MUST)
If the selected Target Model includes images, your implementation and contract MUST enforce Appendix C constraints, including:
- max 3 images per animal
- allowed content types (`image/jpeg`, `image/png`, `image/webp`)
- deterministic image ordering (primary `ordinal` asc, tie-break `imageId` asc)

#### 4.5 Acceptance verification (Appendix D) (MUST)
You MUST provide a benchmark-operator-friendly way to verify the implementation against Appendix D:
- Provide an "Acceptance Checklist" mapped to the relevant `AC-*` IDs for the selected model.
- Provide commands or steps to produce observable evidence (logs/output) for each acceptance item.

#### 4.6 Automated Tests (MUST)
You MUST generate automated tests that:
- Are mapped to Appendix D `AC-*` acceptance criteria IDs (use comments or test names to indicate the `AC-*` ID being tested)
- Are runnable non-interactively via a single command (e.g., `npm test`, `pytest`, `mvn test`)
- Cover both happy-path and error-path scenarios as specified in Appendix D
- Produce clear pass/fail output that can be recorded as evidence

Place tests under `{Workspace Path}/backend/` in an appropriate test folder for the chosen technology.

#### 4.7 Benchmark artifact bundle (Appendix E) (MUST)
You MUST produce operator-ready artifacts aligned to Appendix E:
- A run record skeleton capturing M-01..M-11 inputs (TTFR/TTFC, clarifications, reruns, interventions, etc.)
- Run instructions that are copy/paste friendly (run, reset-to-seed, verify acceptance)
- Evidence pointers for determinism checks and contract completeness checks

#### 4.8 AI Run Report (MUST)
You MUST produce a single comparison-ready document at `{Workspace Path}/benchmark/ai_run_report.md` that includes:
- **Run configuration**: Copy of the run.config contents (from `{Workspace Path}/../run.config`)
- **Tech stack**: Backend language/framework, database, and any key libraries used
- **Timestamps** (ISO-8601 format) recorded at these checkpoints:
  - `generation_started`: When you began generating code
  - `code_complete`: When all code files have been written
  - `build_clean`: When the build succeeds with no errors
  - `seed_loaded`: When seed data is loaded and verified
  - `app_started`: When the application starts with no errors
  - `tests_run_N`: Each test run attempt with pass percentage (e.g., `tests_run_1: 2024-12-17T10:30:00Z (85% pass)`)
  - `all_tests_pass`: When all tests pass
- **Test summary**: Total tests, passed, failed, and final pass rate
- **Artifact paths**: Paths to contract, run instructions, acceptance checklist, and evidence folders

This report enables direct comparison between different AI tool runs.

---

### 5) Loop-Until-Green Workflow (MUST)
After generating all code, you MUST execute the following loop-until-green workflow:

#### 5.1 Build Loop
1. Run the build command
2. If build errors occur, fix them and rebuild
3. Repeat until build succeeds with no errors
4. Record timestamp for `build_clean`

#### 5.2 Seed + Verify Loop
1. Run reset-to-seed
2. Run seed verification
3. If errors occur, fix and repeat
4. Record timestamp for `seed_loaded`

#### 5.3 Start Loop
1. Start the application **in the background** (so it keeps running)
2. If start errors occur, fix and restart
3. Verify the API responds to a basic health/query check
4. Record timestamp for `app_started`
5. **Leave the API running** — do NOT stop it after tests pass

#### 5.4 Test Loop
1. Run all automated tests
2. Record the pass percentage in the AI run report
3. If any tests fail, analyze failures, fix issues, and re-run tests
4. Repeat until all tests pass
5. Record timestamp for `all_tests_pass`

Update `benchmark/acceptance_checklist.md` to mark each `AC-*` item as passing once verified by tests.

---

### 6) Run Instructions Requirements (Non-interactive) (MUST)
Provide a single "Run Instructions" section at `{Workspace Path}/benchmark/run_instructions.md` that includes:
- prerequisites (runtime versions if needed)
- install/build commands (non-interactive; no prompts)
- start commands (API)
- test command
- reset-to-seed command/mutation
- verification commands/steps for:
  - seed invariants (Appendix B)
  - acceptance checks (Appendix D)

If you cannot make instructions fully non-interactive, record a clearly labeled `ASM-####` and explain why, but avoid this unless strictly necessary.

---

### 7) Reporting Format (MUST)
At completion, output a final "Run Summary" with:
- Selected Target Model and API Style
- List of all assumptions (`ASM-*`)
- Paths to:
  - contract artifact
  - run instructions
  - AI run report (`benchmark/ai_run_report.md`)
  - reset-to-seed mechanism
  - acceptance checklist / evidence
  - automated tests
  - run folder bundle contents (Appendix E artifacts)

Do NOT claim completion without providing these paths.

---

### 8) Final State (MUST)
At the end of this run:
- The **API MUST be running** in the background and accessible
- All tests MUST pass
- The AI run report MUST be complete with all timestamps
- Provide a **clickable URL** to access the API (e.g., `http://localhost:3000`)

---

### 9) Start Now
**YOUR VERY FIRST OUTPUT must include the `generation_started` timestamp:**

```
generation_started: [current ISO-8601 timestamp]
```

Then confirm you understand the constraints above and begin implementation for the selected Target Model and API Style.

