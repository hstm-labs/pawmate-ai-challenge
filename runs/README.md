# Benchmark Runs

This folder holds **per-run workspaces** created by the `scripts/initialize_run.sh` renderer.

## Folder structure (auto-generated)

When you run the initializer, it creates:

```
runs/
  YYYYMMDDTHHmm/              # datetime-stamped run folder
    run.config                # key=value config for this run
    start_build_prompt.txt    # the prompt to paste into the AI tool
    PawMate/                  # workspace for benchmark artifacts
      (... implementation + evidence artifacts go here ...)
```

## What goes here

- **run.config** — captures `spec_version`, `tool`, `model`, `api_type` for the run.
- **start_build_prompt.txt** — the prompt to copy/paste into the AI tool to start the benchmark.
- **PawMate/** — the AI tool under test generates its implementation and evidence artifacts inside this folder.

## .gitignore policy

Run folders are **gitignored by default** (except this README) to keep the repo clean. If you want to commit a specific run for reference, you can force-add it.

