# Prompt Templates

This folder contains **start prompt templates** used by the `initialize_run.sh` script to generate pre-filled prompts for benchmark runs.

**Important:** These are NOT spec documents. They are templates that get rendered with run-specific values (tool name, paths, model selection) and saved to the run folder.

## Contents

- `api_start_prompt_template.md` — Template for the API/backend generation prompt
- `ui_start_prompt_template.md` — Template for the UI generation prompt (used after API is complete)

## Usage

Do not use these files directly. Use the initialization script:

```bash
./scripts/initialize_run.sh --profile model-a-rest --tool "YourTool" --tool-ver "1.0"
```

This generates:
- `runs/YYYYMMDDTHHmm/start_build_api_prompt.txt` — Rendered API prompt
- `runs/YYYYMMDDTHHmm/start_build_ui_prompt.txt` — Rendered UI prompt

See `docs/Developer_Guide.md` for the full workflow.

