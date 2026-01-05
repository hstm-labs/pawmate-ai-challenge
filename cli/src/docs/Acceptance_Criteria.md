# Acceptance Criteria + Use-Case Catalog — Model A + Model B

## Purpose
This document provides **observable, API-verifiable** acceptance criteria and a test-like **use-case catalog** that implementers (and benchmark operators) can translate into automated tests.

Key design goals:
- **Technology-agnostic** (no framework/db assumptions)
- **Benchmark-friendly** (deterministic expectations, minimal interpretation)
- **Traceable** to normative requirements (`REQ-*`) and non-goals (`NOR-*`)
- Includes **happy-path** and **error-path** cases

Dependencies (source of truth):
- `docs/Master_Functional_Spec.md` (capabilities, `REQ-*` and `NOR-*`)
- `docs/API_Contract.md` (error categories, pagination/ordering determinism)
- `docs/Seed_Data.md` (golden seed records + determinism/reset invariants)
- `docs/Image_Handling.md` (image constraints + seeded image expectations)

---

## Conventions

### Models
- **Model A** acceptance criteria cover all `[Model A] ...-A` requirements.
- **Model B** acceptance criteria cover all `[Model B] ...-B` delta requirements **plus** remain compatible with Model A behaviors.

### Acceptance Criteria ID Scheme
Each acceptance criterion uses this ID scheme:
- `AC-REQ-{REQ-ID}-{NN}` for normative requirements, e.g. `AC-REQ-CORE-0002-A-01`
- `AC-NOR-{NNNN}-{NN}` for non-goals/overreach checks, e.g. `AC-NOR-0006-01`

### Error Categories (Contract-Visible)
When an error is expected, criteria MUST reference the category names from `docs/API_Contract.md`:
- `ValidationError`
- `NotFound`
- `Conflict`
- `AuthRequired` (Model B)
- `Forbidden` (Model B)

### Determinism Expectations
Whenever a criterion validates a collection response (list/search/history/images ordering), it MUST:
- assert the **ordering rule** (primary key(s) + tie-break)
- assert the behavior is stable for the **same dataset state + request parameters**
- reference seeded IDs (`docs/Seed_Data.md`) when applicable

---

## Model A — Use-Case Catalog

### UC-A-ANIMALS — Animals CRUD + Collections
- UC-A-ANIMALS-01 Intake an animal (valid inputs)
- UC-A-ANIMALS-02 Intake an animal (invalid inputs → validation)
- UC-A-ANIMALS-03 Get animal by id (exists / not-found)
- UC-A-ANIMALS-04 Update animal (valid update)
- UC-A-ANIMALS-05 Update animal (immutable field mutation rejected)
- UC-A-ANIMALS-06 List animals (pagination + deterministic ordering)
- UC-A-ANIMALS-07 List animals filtered by status

### UC-A-LIFECYCLE — State machine enforcement
- UC-A-LIFECYCLE-01 Valid transition succeeds and is audited
- UC-A-LIFECYCLE-02 Invalid transition is rejected (conflict/validation)
- UC-A-LIFECYCLE-03 Stale fromStatus is rejected deterministically

### UC-A-ADOPTIONS — Applications + Evaluation + Decisions
- UC-A-ADOPTIONS-01 Submit application for AVAILABLE animal
- UC-A-ADOPTIONS-02 Submit application for ineligible animal → conflict
- UC-A-ADOPTIONS-03 Evaluate application returns explanation
- UC-A-ADOPTIONS-04 Record decision requires explanation; updates animal status
- UC-A-ADOPTIONS-05 Override is logged and auditable

### UC-A-HISTORY — Audit trail
- UC-A-HISTORY-01 Get history for animal (pagination + deterministic ordering)
- UC-A-HISTORY-02 History includes required event types for seeded animal

### UC-A-SEED — Seed + Reset-to-Seed Determinism
- UC-A-SEED-01 Reset-to-seed is available and succeeds
- UC-A-SEED-02 Reset-to-seed idempotency (run twice → identical state)
- UC-A-SEED-03 Post-reset invariants match golden seed records (`docs/Seed_Data.md`)

### UC-A-IMAGES — Image Handling
- UC-A-IMAGES-01 Animal read includes `images[]` (may be empty)
- UC-A-IMAGES-02 Add image to animal (valid)
- UC-A-IMAGES-03 Add image (invalid contentType/size/count → validation)
- UC-A-IMAGES-04 Add image (unknown animal → not-found)
- UC-A-IMAGES-05 Remove image from animal (valid)
- UC-A-IMAGES-06 Remove image not associated (explicit rule: not-found)
- UC-A-IMAGES-07 Images ordering is deterministic (`ordinal` asc, tie-break `imageId` asc)
- UC-A-IMAGES-08 Seeded images are present after reset (`docs/Seed_Data.md` + `docs/Image_Handling.md`)

### UC-A-ETHICS — Ethics constraints
- UC-A-ETHICS-01 Evaluation/decision explanations are always present
- UC-A-ETHICS-02 Protected-class fields are not accepted/used for automated evaluation

---

## Model A — Acceptance Criteria (Mapped to `REQ-...-A`)

### Animals + Collections

#### `AC-REQ-CORE-0001-A-01` — API-first invariant
- **Related Requirements**: `REQ-CORE-0001-A`
- **Use Case**: UC-A-ANIMALS-01, UC-A-ANIMALS-03, UC-A-ANIMALS-04
- **Steps**:
  - Intake an animal via the API.
  - Retrieve it via the API.
  - Update it via the API.
  - Retrieve it again.
- **Expected Results (Success)**:
  - All required state changes are observable via the API; Get reflects Update.

#### `AC-REQ-CORE-0002-A-01` — Intake animal (happy path)
- **Related Requirements**: `REQ-CORE-0002-A`
- **Use Case**: UC-A-ANIMALS-01
- **Steps**:
  - Call IntakeAnimal with valid `species` and `description`.
- **Expected Results (Success)**:
  - Response returns a non-empty stable `animalId` and an initial `status` in the lifecycle state set.

#### `AC-REQ-CORE-0003-A-01` — Get animal by id (exists / not-found)
- **Related Requirements**: `REQ-CORE-0003-A`
- **Use Case**: UC-A-ANIMALS-03
- **Steps**:
  - GetAnimal for an existing `animalId` (seeded).
  - GetAnimal for a non-existent `animalId`.
- **Expected Results**:
  - Existing returns animal; unknown returns `NotFound`.

#### `AC-REQ-API-0001-A-01` — List animals supports pagination
- **Related Requirements**: `REQ-API-0001-A`
- **Use Case**: UC-A-ANIMALS-06
- **Preconditions**: Reset-to-seed completed (Model A)
- **Steps**:
  - Call ListAnimals using contract-defined pagination inputs; page until all animals are retrieved.
- **Expected Results**:
  - Exactly 12 seeded animals are reachable via paging (`docs/Seed_Data.md`).

#### `AC-REQ-API-0002-A-01` — Deterministic ordering for ListAnimals
- **Related Requirements**: `REQ-API-0002-A`
- **Use Case**: UC-A-ANIMALS-06
- **Preconditions**: Reset-to-seed completed (Model A)
- **Steps**:
  - Call ListAnimals twice with identical parameters.
- **Expected Results**:
  - Responses are identical in ordering and identity; ordering matches contract rule.

#### `AC-REQ-API-0003-A-01` — Filter animals by status
- **Related Requirements**: `REQ-API-0003-A`
- **Use Case**: UC-A-ANIMALS-07
- **Preconditions**: Reset-to-seed completed (Model A)
- **Steps**:
  - ListAnimals with `status=AVAILABLE`.
- **Expected Results**:
  - All returned animals have `status=AVAILABLE`.

### Lifecycle Enforcement

#### `AC-REQ-CORE-0010-A-01` — Valid lifecycle transition succeeds
- **Related Requirements**: `REQ-CORE-0010-A`, `REQ-CORE-0012-A`
- **Use Case**: UC-A-LIFECYCLE-01
- **Steps**:
  - Transition an animal along a valid path (e.g., `INTAKE → MEDICAL_EVALUATION`).
  - Fetch animal history.
- **Expected Results**:
  - Transition succeeds; history includes an append-only event with `fromStatus`, `toStatus`, `performedBy`, and `reason`.

#### `AC-REQ-CORE-0011-A-01` — Invalid transition is rejected
- **Related Requirements**: `REQ-CORE-0011-A`
- **Use Case**: UC-A-LIFECYCLE-02
- **Steps**:
  - Attempt an invalid transition (e.g., `AVAILABLE → MEDICAL_EVALUATION`).
- **Expected Results (Error)**:
  - Error category is `Conflict` or `ValidationError` (must match the contract).

### Adoption Workflow

#### `AC-REQ-CORE-0020-A-01` — Submit application for AVAILABLE animal
- **Related Requirements**: `REQ-CORE-0020-A`, `REQ-CORE-0021-A`
- **Use Case**: UC-A-ADOPTIONS-01
- **Preconditions**: Reset-to-seed completed; choose `ANM-0001` (AVAILABLE)
- **Steps**:
  - SubmitAdoptionApplication for ANM-0001.
- **Expected Results**:
  - Application is created; animal transitions to `APPLICATION_PENDING` per contract policy.

#### `AC-REQ-CORE-0022-A-01` — Evaluation returns human-readable explanation
- **Related Requirements**: `REQ-CORE-0022-A`, `REQ-ETH-0002-A`
- **Use Case**: UC-A-ADOPTIONS-03
- **Steps**:
  - EvaluateAdoptionApplication for a submitted application.
- **Expected Results**:
  - Response includes a non-empty human-readable `explanation`.

#### `AC-REQ-CORE-0023-A-01` — Decision requires explanation and updates animal state
- **Related Requirements**: `REQ-CORE-0023-A`, `REQ-CORE-0024-A`
- **Use Case**: UC-A-ADOPTIONS-04
- **Steps**:
  - RecordAdoptionDecision with decision APPROVE and a non-empty explanation.
  - Retrieve the animal.
- **Expected Results**:
  - Decision succeeds; animal state updates consistently with lifecycle rules and contract policy.

#### `AC-REQ-CORE-0025-A-01` — Workflow actions are auditable in history
- **Related Requirements**: `REQ-CORE-0025-A`, `REQ-ETH-0003-A`
- **Use Case**: UC-A-ADOPTIONS-05, UC-A-HISTORY-02
- **Steps**:
  - Submit, evaluate, and decide an application (including one override).
  - Fetch history for the animal.
- **Expected Results**:
  - History includes events for submission/evaluation/decision, and override is explicitly present with reason.

### History

#### `AC-REQ-CORE-0012-A-01` — Get history is paginated and deterministic
- **Related Requirements**: `REQ-CORE-0012-A`
- **Use Case**: UC-A-HISTORY-01
- **Preconditions**: Reset-to-seed completed
- **Steps**:
  - GetAnimalHistory for ANM-0001 with contract-defined pagination; repeat identical request twice.
- **Expected Results**:
  - Ordering is deterministic and matches contract tie-break rules.

### Seed + Reset

#### `AC-REQ-DATA-0001-A-01` — Golden seeded animals exist
- **Related Requirements**: `REQ-DATA-0001-A`
- **Use Case**: UC-A-SEED-03
- **Preconditions**: Reset-to-seed completed (Model A)
- **Steps**:
  - GetAnimal for ANM-0001..ANM-0005.
- **Expected Results**:
  - Fields match `docs/Seed_Data.md` golden values (name/species/status/tags/timestamps; description substrings).

#### `AC-REQ-OPS-0002-A-01` — Reset-to-seed idempotency
- **Related Requirements**: `REQ-OPS-0002-A`
- **Use Case**: UC-A-SEED-02
- **Steps**:
  - Invoke reset-to-seed twice; list animals after each reset.
- **Expected Results**:
  - Identical state after each reset.

### Ethics

#### `AC-REQ-ETH-0001-A-01` — Protected-class fields are not used for automated evaluation
- **Related Requirements**: `REQ-ETH-0001-A`
- **Use Case**: UC-A-ETHICS-02
- **Steps**:
  - Inspect the contract for application/evaluation inputs.
- **Expected Results**:
  - No protected-class fields are accepted as evaluation inputs; if provided at all, they are ignored and not referenced in rule findings/explanations.

---

## Model B — Acceptance Criteria (Deltas)

#### `AC-REQ-CORE-0101-B-01` — Search returns animals matching query deterministically
- **Related Requirements**: `REQ-CORE-0101-B`, `REQ-API-0101-B`
- **Preconditions**: Reset-to-seed completed (Model B)
- **Steps**:
  - SearchAnimals for `senior cat`, `puppy`, `tripod`, `indoor-only`.
- **Expected Results**:
  - Results include ANM-0001, ANM-0002, ANM-0003, ANM-0004 respectively, per contract matching semantics.

#### `AC-REQ-API-0111-B-01` — Protected operations enforce auth
- **Related Requirements**: `REQ-API-0111-B`
- **Steps**:
  - Call a contract-identified protected operation without auth.
- **Expected Results (Error)**:
  - Error category is `AuthRequired`.

---

## Overreach / Non-Goals — Acceptance Checks (Mapped to `NOR-*`)

#### `AC-NOR-0002-01` — No commerce flows exist
- **Related Requirements**: `NOR-0002`
- **Steps**:
  - Inspect the contract artifact for cart/checkout/orders/payments/shipping operations.
- **Expected Results**:
  - No such operations exist.

#### `AC-NOR-0006-01` — Only one API style is implemented
- **Related Requirements**: `NOR-0006`
- **Steps**:
  - Verify the deliverables contain either a REST contract artifact or a GraphQL schema, not both.
- **Expected Results**:
  - Exactly one API style is used.


