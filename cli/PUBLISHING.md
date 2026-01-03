# Publishing the PawMate CLI to npm

This document describes how to publish the PawMate AI Challenge CLI to the npm registry.

## Pre-Publish Checklist

✅ All implementation complete:
- CLI entry point (`bin/pawmate.js`)
- Commands: `init`, `submit`
- Utilities: validation, email, GitHub
- Templates bundled (runs automatically on `npm install`)
- Documentation complete
- Local testing passed

## Publishing Steps

### 1. Verify Package Configuration

Check that `package.json` has correct metadata:

```json
{
  "name": "pawmate-ai-challenge",
  "version": "1.0.0",
  "description": "PawMate AI Benchmark CLI - Initialize and submit benchmark runs without cloning the repo",
  "bin": {
    "pawmate": "./bin/pawmate.js"
  },
  "files": [
    "bin",
    "src"
  ]
}
```

### 2. Ensure Templates Are Bundled

The `prepare` script should have already run during `npm install`:

```bash
cd cli
npm run prepare
```

Verify templates exist:
```bash
ls -la src/templates/
ls -la src/profiles/
cat src/SPEC_VERSION
```

### 3. Test Locally One More Time

```bash
# Create a test directory outside the repo
mkdir ~/pawmate-cli-test
cd ~/pawmate-cli-test

# Test init
pawmate init --profile model-a-rest --tool "TestTool" --tool-ver "1.0"

# Verify files were created
ls -la .pawmate-run-*/
cat .pawmate-run-*/run.config
head -30 .pawmate-run-*/start_build_api_prompt.txt
```

### 4. Login to npm

If not already logged in:

```bash
npm login
```

You'll need:
- npm account username
- password
- email
- 2FA code (if enabled)

### 5. Publish to npm

From the `cli/` directory:

```bash
cd /Users/scott.dickerson/source/repos/pawmate/pawmate-ai-challenge/cli
npm publish
```

**First-time publish:** This will make the package publicly available at:
- https://www.npmjs.com/package/pawmate-ai-challenge

**Access:** By default, packages are published as public and anyone can install them.

### 6. Verify Publication

```bash
# Unlink the local version
npm unlink -g pawmate-ai-challenge

# Install from npm registry
npm install -g pawmate-ai-challenge

# Test the published version
pawmate --version
pawmate --help
```

### 7. Test Installation from npm

In a completely fresh directory:

```bash
mkdir ~/test-npm-install
cd ~/test-npm-install
npm install -g pawmate-ai-challenge
pawmate init --profile model-a-rest --tool "Cursor" --tool-ver "v0.43"
```

## Updating the Package

When you need to publish updates:

### 1. Update Version

```bash
cd cli
npm version patch  # 1.0.0 -> 1.0.1
# or
npm version minor  # 1.0.0 -> 1.1.0
# or
npm version major  # 1.0.0 -> 2.0.0
```

### 2. Ensure Templates Are Updated

If spec files changed:

```bash
npm run prepare
```

### 3. Test Locally

```bash
npm link
pawmate init --profile model-a-rest --tool "Test"
```

### 4. Publish Update

```bash
npm publish
```

## Troubleshooting

### Error: "package name already exists"

If the package name is taken:
1. Change `name` in `package.json` (e.g., `@rsdickerson/pawmate-ai-challenge`)
2. Update documentation with the new package name
3. Try publishing again

### Error: "You must be logged in"

```bash
npm login
```

### Error: "No permission to publish"

Make sure you're the owner or have publish permissions:

```bash
npm owner ls pawmate-ai-challenge
```

### Templates Not Bundled

If templates are missing after install:

```bash
npm run prepare
```

Check that `scripts/bundle-templates.js` is working correctly.

## Post-Publication

### Update GitHub Repository

1. Update main README to reference the published npm package
2. Tag the release:
   ```bash
   git tag cli-v1.0.0
   git push origin cli-v1.0.0
   ```

### Announce

- Update challenge documentation
- Notify users about the new CLI option
- Update any external documentation

### Monitor

- Watch for issues on GitHub
- Monitor npm download stats: https://www.npmjs.com/package/pawmate-ai-challenge
- Check for bug reports

## Package URLs

After publishing:
- **npm package:** https://www.npmjs.com/package/pawmate-ai-challenge
- **GitHub repo:** https://github.com/rsdickerson/pawmate-ai-challenge
- **CLI README:** https://github.com/rsdickerson/pawmate-ai-challenge/tree/main/cli

## Version Strategy

- **Patch (1.0.x):** Bug fixes, documentation updates
- **Minor (1.x.0):** New features, non-breaking changes
- **Major (x.0.0):** Breaking changes, major refactors

Align CLI versions with spec versions when possible:
- Spec v2.7.0 → CLI v2.7.0
- Or maintain separate versioning if they diverge significantly

