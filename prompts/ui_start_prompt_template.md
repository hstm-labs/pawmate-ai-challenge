## UI Start Prompt (Template)

> **Recommended:** Use the prompt renderer to generate a pre-filled version of this template:
> ```bash
> ./scripts/initialize_run.sh --profile model-a-rest --tool "YourTool" --tool-ver "1.0"
> ```
> This auto-creates a run folder with both API and UI start prompts.

> **When to use:** Submit this prompt **after** the API/backend has been successfully generated and is running. The UI prompt assumes the backend already exists in the workspace.

---

### 0) Benchmark Header (Operator fills)
- **Tool Under Test (TUT)**: [Tool name + version/build id]
- **Run ID**: [e.g., ToolX-ModelA-Run1-UI]
- **Frozen Spec Reference**: [commit/tag/hash or immutable archive id]
- **Spec Root**: [repo-root-path]
- **Workspace Path**: [workspace-path]
- **Target Model (choose exactly one)**:
  - [ ] **Model A (Minimum)**
  - [ ] **Model B (Full)**
- **API Style (the backend uses)**:
  - [ ] **REST**
  - [ ] **GraphQL**

---

### 1) Role + Objective (Tool must follow)
You are an implementation agent continuing a reproducible benchmarking run. The **API/backend has already been generated** and exists in the workspace. Your objective is to produce a **frontend/UI** that integrates with the existing backend API.

**⏱️ FIRST ACTION — Record Start Time:**
Before doing anything else, record the current timestamp in ISO-8601 format as `ui_generation_started`. Output it immediately in your first response, like this:

```
ui_generation_started: 2024-12-17T11:00:00Z
```

This timestamp is critical for benchmarking and MUST be recorded before any code generation begins.

---

### 1.0) Run Independence — No Cross-Run References (MUST)
This UI run MUST be treated as fully independent:
- You MUST NOT reference, rely on, or mention any previous runs, prior attempts, earlier chats, or other run folders.
- You MUST treat this prompt, the frozen spec files, and the existing backend present in the **Workspace Path** as the complete context for this run.
- Do not say "as before", "like last run", or similar. If something is missing or ambiguous, ask a clarification question or record a minimal `ASM-####`.

**CRITICAL — Existing backend:**
- The backend implementation already exists under the **Workspace Path** (likely in `backend/` or at the workspace root).
- You MUST NOT rebuild, replace, or significantly modify the existing backend unless required for integration fixes.
- You MUST integrate the UI with the existing API endpoints/operations.

**IMPORTANT — File locations:**
- **Read spec files from:** the **Spec Root** path (frozen spec docs live there under `docs/`)
- **Write UI files to:** `{Workspace Path}/ui/` (create this folder if it doesn't exist)
- **Do NOT overwrite backend code** unless making minimal integration fixes (e.g., CORS configuration)

You MUST work strictly within scope and MUST NOT invent requirements. If something is ambiguous, you MUST either ask a clarification question or record the smallest compliant assumption as an explicit `ASM-####`.

---

### 2) In-Scope Inputs (Frozen Spec Files)
You MUST treat the following files (located under the **Spec Root**) as the sole source of truth:
- `{Spec Root}/docs/Master_Functional_Spec.md`
- `{Spec Root}/docs/API_Contract.md`
- `{Spec Root}/docs/Acceptance_Criteria.md`

Additionally, reference the existing backend's contract artifact (OpenAPI or GraphQL schema) in the workspace.

---

### 3) Hard Guardrails (MUST)

#### 3.1 Backend preservation
- You MUST NOT delete or replace existing backend code.
- You MUST NOT change the API contract (operations, request/response shapes).
- You MAY make minimal backend changes for integration (e.g., CORS headers, static file serving) if clearly documented.

#### 3.2 Overreach guardrails (`NOR-*`)
You MUST comply with all `NOR-*` items in the Master Spec. In particular:
- You MUST NOT require any external integrations (`NOR-0001`).
- You MUST NOT implement commerce flows (`NOR-0002`), promotions (`NOR-0003`), or messaging/chat (`NOR-0004`).
- You MUST NOT add UI features not required by `REQ-*` items (`NOR-0007`).

#### 3.3 Assumptions (`ASM-*`)
- Any assumption MUST be explicitly labeled `ASM-####` and listed in an "Assumptions" section.
- Assumptions MUST be the smallest reasonable interpretation that remains compliant.

---

### 4) Required Outputs (MUST)
Your deliverable MUST include:

#### 4.1 UI Implementation
- A working frontend under `{Workspace Path}/ui/`
- Must integrate with the existing backend API
- Must be buildable and runnable from a clean state using non-interactive commands

#### 4.2 UI capabilities (based on Target Model)
The UI MUST provide interfaces for the API operations defined in Appendix A for the selected model:
- **Model A**: Animal intake/view/update, lifecycle transitions, adoption workflow (submit/evaluate/decide), history view
- **Model B**: All of Model A plus search, authentication UI elements

#### 4.2.1 Consumer-first UX posture (MUST)
The UI MUST be **consumer-focused by default** (not developer/admin-focused):
- **Primary navigation** MUST emphasize the end-user journey:
  - **Browse pets** (default landing): show `AVAILABLE` animals in a card/grid layout with basic details.
  - **Pet details**: friendly profile view (photos, description, tags) and **history view** (audit trail) in a readable format.
  - **Apply**: guided application form and submission flow.
- **Staff tools** (intake/update/transitions/evaluate/decide/reset) MUST exist (per §4.2) but SHOULD be:
  - placed in a clearly labeled **“Staff tools”** area, and
  - visually separated from the consumer flow to avoid confusing end users.
- The UI MUST NOT require users to read raw JSON to use the primary consumer flow.
  - Debug output MAY exist, but MUST be secondary (e.g., collapsible “Details/Debug”).
- The UI SHOULD be accessible and “consumer nice”:
  - clear labels and helper text
  - readable typography and spacing
  - simple error messages that map to error categories (ValidationError/Conflict/NotFound/AuthRequired)

#### 4.3 Update Run Instructions
Update or extend the existing `benchmark/run_instructions.md` to include:
- UI prerequisites (if any beyond the backend)
- UI install/build commands (non-interactive)
- UI start command
- How to access the UI (URL/port)

---

### 5) Run Instructions Requirements (Non-interactive) (MUST)
The updated run instructions MUST include:
- UI build command (e.g., `npm run build` in the ui folder)
- UI start command (e.g., `npm run dev` or serve from backend)
- UI access URL (e.g., `http://localhost:3000`)

If you cannot make instructions fully non-interactive, record a clearly labeled `ASM-####`.

---

### 6) Reporting Format (MUST)
At completion, output a "UI Run Summary" with:
- Confirmation that UI integrates with existing backend
- UI technology stack used
- List of any assumptions (`ASM-*`)
- List of any backend changes made (if any)
- Paths to:
  - UI source folder
  - Updated run instructions

---

### 7) Final State (MUST)
At the end of this run:
- The **UI MUST be running** and accessible
- The UI MUST successfully communicate with the backend API
- Provide a **clickable URL** to access the UI (e.g., `http://localhost:5173`)

**IMPORTANT:** The user will click the URL to open the UI in their browser. Make sure both backend and UI are running before providing the final URL.

---

### 8) Start Now
**YOUR VERY FIRST OUTPUT must include the `ui_generation_started` timestamp:**

```
ui_generation_started: [current ISO-8601 timestamp]
```

Then confirm you understand that the backend already exists and begin UI implementation for the selected Target Model.

