# PawMate AI Challenge CLI

> **Benchmark AI coding assistants without cloning repos**

A command-line tool for initializing and submitting PawMate AI benchmark runs. Install globally and run benchmarks from any directory.

## Quick Start

```bash
# Install globally
npm install -g @fastcraft/pawmate-ai-challenge

# Create a project directory
mkdir my-pawmate-benchmark
cd my-pawmate-benchmark

# Initialize a benchmark run (interactive mode - recommended)
pawmate init
# Displays banner and prompts for:
#   - Profile selection (Model A/B, REST/GraphQL)
#   - Tool name (with examples: Cursor, Copilot, Claude Code, etc.)
#   - Tool version

# Or use CLI flags for automation/scripts
pawmate init --profile model-a-rest --tool "Cursor" --tool-ver "v0.43"

# Copy the generated prompts to your AI agent
cat pawmate-run-*/start_build_api_prompt.txt
cat pawmate-run-*/start_build_ui_prompt.txt

# After completing the benchmark, submit results
pawmate submit pawmate-run-*/benchmark/result.json
```

### Command Syntax by Installation Method

| Approach | Installation | Running Commands |
|----------|-------------|------------------|
| **Global** | `npm install -g @fastcraft/pawmate-ai-challenge` | `pawmate init ...`<br>`pawmate submit ...` |
| **Local** | `npm install @fastcraft/pawmate-ai-challenge` | `npx pawmate init ...`<br>`npx pawmate submit ...` |
| **On-Demand** | _(none)_ | `npx @fastcraft/pawmate-ai-challenge init ...`<br>`npx @fastcraft/pawmate-ai-challenge submit ...` |

## Installation

Choose one of three approaches based on your preference:

### Approach A: Global Installation (Recommended)

Install once, use the `pawmate` command anywhere.

```bash
npm install -g @fastcraft/pawmate-ai-challenge
```

After installation, the `pawmate` command is available system-wide:

```bash
pawmate init --profile model-a-rest --tool "Cursor"
pawmate submit result.json
```

### Approach B: Local Installation

Install in your project directory and use `npx` to run commands.

```bash
npm install @fastcraft/pawmate-ai-challenge
```

Run commands using `npx pawmate`:

```bash
npx pawmate init --profile model-a-rest --tool "Cursor"
npx pawmate submit result.json
```

**Note:** If you get "command not found" errors with local installation, you must use `npx pawmate` (not just `pawmate`).

### Approach C: On-Demand (No Installation)

Download and run temporarily without installing.

```bash
npx @fastcraft/pawmate-ai-challenge init --profile model-a-rest --tool "Cursor"
npx @fastcraft/pawmate-ai-challenge submit result.json
```

This downloads the package on-demand and runs it without saving to your system.

## Commands

### `pawmate init`

Initialize a new benchmark run with pre-filled prompt templates.

**Interactive Mode (Recommended):**

```bash
pawmate init
```

Displays the PawMate banner and prompts you for:
1. **Profile selection:** Choose from Model A/B with REST/GraphQL via menu
2. **Tool name:** Enter your tool with helpful examples (Cursor, Copilot, Claude Code, Windsurf, etc.)
3. **Tool version:** Enter version with validation

Interactive mode provides the best experience with clear examples, validation, and guidance.

**CLI Flag Mode (For automation/scripts):**

```bash
pawmate init --profile <profile> --tool <tool-name> --tool-ver <version> [options]
```

**Flags:**

- `--profile <name>` - Benchmark profile (optional in interactive mode)
- `--tool <name>` - Tool under test (optional in interactive mode)
- `--tool-ver <version>` - Tool version/build id (optional in interactive mode)
- `--run-dir <path>` - Custom run directory path (optional)

**Profiles:**

- `model-a-rest` - Model A (Minimum) + REST API
- `model-a-graphql` - Model A (Minimum) + GraphQL API
- `model-b-rest` - Model B (Full) + REST API
- `model-b-graphql` - Model B (Full) + GraphQL API

**Examples:**

```bash
# Interactive mode (recommended for manual use)
pawmate init

# CLI flag mode (for automation/scripts)
pawmate init --profile model-a-rest --tool "Cursor" --tool-ver "v0.43.1"
```

> **Local/On-Demand:** Use `npx pawmate init` (local) or `npx @fastcraft/pawmate-ai-challenge init` (on-demand)

**What it creates:**

- `pawmate-run-<timestamp>/` - Run directory
  - `start_build_api_prompt.txt` - API/backend prompt
  - `start_build_ui_prompt.txt` - UI/frontend prompt
  - `run.config` - Run configuration
  - `PawMate/` - Workspace for generated code
  - `benchmark/` - Benchmark artifacts folder

### `pawmate submit`

Submit benchmark results via email (and optionally GitHub issue).

**Usage:**

```bash
pawmate submit <result-file.json> [options]
```

**Arguments:**

- `<result-file>` - Path to result JSON file

**Options:**

- `--github-token <token>` - GitHub personal access token for issue creation
- `--email-only` - Skip GitHub submission (email only)

**Examples:**

```bash
# Email submission only (default)
pawmate submit pawmate-run-*/benchmark/result.json

# Email + GitHub issue (requires token)
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
pawmate submit pawmate-run-*/benchmark/result.json

# Or provide token as flag
pawmate submit result.json --github-token ghp_xxxxxxxxxxxx
```

> **Local/On-Demand:** Replace `pawmate` with `npx pawmate` (local) or `npx @fastcraft/pawmate-ai-challenge` (on-demand)

**What it does:**

1. Validates result file format and required fields
2. Prompts for optional attribution (name/GitHub username)
3. **Email submission:**
   - Opens your email client with pre-filled content
   - To: `pawmate.ai.challenge@gmail.com`
   - Includes JSON result in email body
   - **You must click "Send" to complete submission**
4. **GitHub submission (optional):**
   - Creates issue in `fastcraft-ai/pawmate-ai-results`
   - Requires GitHub personal access token
   - Labels: `submission`, `results`

### GitHub Token Setup

To enable GitHub issue creation:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name (e.g., "PawMate Result Submission")
4. Select the **"repo"** scope (required for creating issues)
5. Click "Generate token" and copy it

**Set the token:**

```bash
# Method 1: Environment variable
export GITHUB_TOKEN=your-token-here

# Method 2: Command flag
pawmate submit result.json --github-token your-token-here
```

## Workflow

### 1. Initialize a Run

```bash
mkdir pawmate-benchmark && cd pawmate-benchmark

# Interactive mode (recommended)
pawmate init
# Follow the prompts to select profile, enter tool name, and version

# Or use CLI flags for automation
pawmate init --profile model-a-rest --tool "Cursor" --tool-ver "v0.43"

# Creates pawmate-run-<timestamp>/
```

> **Note:** Examples use global install syntax. For local install, use `npx pawmate` instead of `pawmate`.

### 2. Copy Prompts to AI Agent

Open the generated prompt files and copy their contents:

- **API Prompt:** `pawmate-run-<timestamp>/start_build_api_prompt.txt`
- **UI Prompt:** `pawmate-run-<timestamp>/start_build_ui_prompt.txt`

Paste each prompt as the first message in a new AI agent session.

### 3. Complete the Benchmark

The AI agent will:
- Generate all code files
- Build and start the application
- Load seed data
- Run automated tests
- Generate benchmark artifacts

### 4. Submit Results

```bash
pawmate submit pawmate-run-*/benchmark/result.json
```

Review and send the pre-filled email. Results will be published at:
https://github.com/fastcraft-ai/pawmate-ai-results

## Key Features

- ✅ **No repo cloning required** - Install via npm, run anywhere
- ✅ **Pre-filled prompts** - Automatic template rendering
- ✅ **Dual submission** - Email (required) + GitHub issue (optional)
- ✅ **Cross-platform** - Works on macOS, Windows, Linux
- ✅ **Validation** - Automatic result file validation
- ✅ **Bundled specs** - Templates and profiles included in package

## Comparison to Clone-Based Workflow

| Aspect | Clone Repo | npm CLI |
|--------|------------|---------|
| Setup | `git clone` + repo navigation | `npm install -g` |
| Initialize | `./scripts/initialize_run.sh` | `pawmate init` |
| Prompts | Absolute paths to repo | Bundled, portable |
| Submit | Manual email/GitHub | Automatic email + optional GitHub |
| Updates | `git pull` | `npm update -g pawmate-ai-challenge` |

## Troubleshooting

### "command not found: pawmate"

If you get this error, it means the `pawmate` command isn't in your system PATH. This happens when:

1. **You installed locally** (without `-g` flag)
2. **You haven't installed at all**

**Solutions:**

```bash
# Option 1: Use npx with local installation
npx pawmate init --profile model-a-rest --tool "Cursor"

# Option 2: Use npx without installation (on-demand)
npx @fastcraft/pawmate-ai-challenge init --profile model-a-rest --tool "Cursor"

# Option 3: Install globally to use 'pawmate' directly
npm install -g @fastcraft/pawmate-ai-challenge
pawmate init --profile model-a-rest --tool "Cursor"
```

### "Cannot find package" errors

Make sure dependencies are installed:

```bash
cd /path/to/pawmate-ai-challenge/cli
npm install
```

### Email client doesn't open

If the email client fails to open, the CLI will print the email content to the console. Copy and paste it manually into your email client.

### GitHub issue creation fails

Common causes:
- **401/403 errors:** Invalid or missing GitHub token
- **404 errors:** Repository not accessible
- **422 errors:** Invalid result data format

Solution: Check your token has the `repo` scope and is valid.

## Requirements

- **Node.js:** >= 18.0.0
- **npm:** Comes with Node.js
- **Email client:** For email submissions (or manual email)
- **GitHub token:** Optional, only for GitHub issue creation

## Resources

- **Challenge Repository:** https://github.com/fastcraft-ai/pawmate-ai-challenge
- **Results Repository:** https://github.com/fastcraft-ai/pawmate-ai-results
- **Challenge Documentation:** See `docs/` in challenge repository
- **npm Package:** https://www.npmjs.com/package/pawmate-ai-challenge

## Support

For issues, questions, or contributions:

- **Issues:** https://github.com/fastcraft-ai/pawmate-ai-challenge/issues
- **Discussions:** https://github.com/fastcraft-ai/pawmate-ai-challenge/discussions

## License

MIT - See LICENSE file in challenge repository

---

**Happy Benchmarking! 🐾**

