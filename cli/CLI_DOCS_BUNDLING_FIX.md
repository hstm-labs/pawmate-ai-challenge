# CLI Docs Bundling Fix

## Problem
The PawMate CLI was not bundling the `docs/` directory containing all the specification files (Master_Functional_Spec.md, API_Contract.md, UI_Requirements.md, etc.) that are required for benchmark runs. This caused issues when users tried to run benchmarks using the CLI, as they couldn't access the frozen spec files.

## Root Cause
The `scripts/bundle-templates.js` script was only copying:
- `prompts/` → `src/templates/`
- `profiles/` → `src/profiles/`
- `SPEC_VERSION` → `src/SPEC_VERSION`

But it was **NOT** copying the `docs/` directory, even though the generated prompts and run.config referenced these files.

## Solution Implemented

### 1. Updated Bundle Script (`scripts/bundle-templates.js`)
Added logic to copy the `docs/` directory:

```javascript
// Copy docs
const docsSource = path.join(parentRoot, 'docs');
if (await fs.pathExists(docsSource)) {
  await fs.copy(docsSource, docsDir, { overwrite: true });
  console.log('✓ Copied docs to src/docs/');
} else {
  console.warn('⚠ Docs directory not found at', docsSource);
}
```

### 2. Updated Init Command (`src/commands/init.js`)
Modified to:
- Create a `docs/` directory in each run folder
- Copy bundled docs from CLI to the run folder
- Update placeholder replacements to point to the correct local paths

```javascript
// Create run folder structure
await fs.ensureDir(path.join(finalRunDir, 'docs'));

// Copy bundled docs to run directory
const bundledDocsPath = path.join(__dirname, '..', 'docs');
const runDocsPath = path.join(finalRunDir, 'docs');
if (await fs.pathExists(bundledDocsPath)) {
  await fs.copy(bundledDocsPath, runDocsPath, { overwrite: true });
}

// Replace placeholders with correct paths
apiRendered = apiRendered.replace(/\{Spec Root\}/g, finalRunDir);
```

### 3. Updated package.json
Added `scripts` to the `files` array to ensure the bundle script is included in the published package:

```json
"files": [
  "bin",
  "src",
  "scripts"
],
```

## Result
Now when users run `pawmate init`, they get:

```
pawmate-run-<timestamp>/
├── docs/                          ← All spec files are here!
│   ├── Master_Functional_Spec.md
│   ├── API_Contract.md
│   ├── UI_Requirements.md
│   ├── Seed_Data.md
│   ├── Image_Handling.md
│   ├── Acceptance_Criteria.md
│   ├── Benchmarking_Method.md
│   ├── SANDBOX_SOLUTION.md
│   └── ... (all other spec files)
├── PawMate/                       ← Workspace for generated code
├── benchmark/                     ← Benchmark artifacts
├── run.config                     ← Points to correct docs path
├── start_build_api_prompt.txt     ← References correct file paths
└── start_build_ui_prompt.txt      ← References correct file paths
```

The `run.config` now correctly shows:
```
spec_root=/path/to/pawmate-run-<timestamp>/docs
```

And all prompts reference the correct paths like:
```
- `/path/to/pawmate-run-<timestamp>/docs/Master_Functional_Spec.md`
- `/path/to/pawmate-run-<timestamp>/docs/API_Contract.md`
```

## Testing
Tested with:
```bash
cd /tmp
pawmate init --profile model-a-graphql --tool "Cursor" --tool-ver "v0.43"
ls -la pawmate-run-*/docs/
cat pawmate-run-*/run.config
head -20 pawmate-run-*/docs/Master_Functional_Spec.md
```

All spec files are present and accessible.

## Next Steps for Publishing
1. Run `npm run prepare` to bundle the docs (already done)
2. Increment version: `npm version patch` (or minor/major)
3. Test locally with `npm link`
4. Publish: `npm publish`

## Files Modified
- `/cli/scripts/bundle-templates.js` - Added docs bundling
- `/cli/src/commands/init.js` - Added docs copying and path fixes
- `/cli/package.json` - Added scripts to files array

## Date
January 4, 2026

