# PawMate Benchmarking - Quick Start Checklist

## ✅ Pre-Flight Checklist

Before running your first benchmark, complete these steps:

### 1. Verify Your Environment

```bash
cd pawmate-ai-challenge
./scripts/verify_environment.sh
```

**✓ Expected:** All required tools show green checkmarks  
**✗ If errors:** See step 2

---

### 2. Install Missing Tools (if needed)

**Need Node.js?** → See [`docs/Setup_Instructions.md`](docs/Setup_Instructions.md)

**Quick Links by Platform:**
- **macOS:** [Setup Instructions - macOS](docs/Setup_Instructions.md#macos-setup)
- **Windows:** [Setup Instructions - Windows](docs/Setup_Instructions.md#windows-setup) ← Use PowerShell!
- **Linux:** [Setup Instructions - Linux](docs/Setup_Instructions.md#linux-setup)

**Minimum Requirements:**
- Node.js >= 18.x
- npm >= 9.x

---

### 3. Choose Your Profile

| Profile | Model | API Style | Description |
|---------|-------|-----------|-------------|
| `model-a-rest` | Minimum | REST | Baseline capabilities |
| `model-a-graphql` | Minimum | GraphQL | Baseline capabilities |
| `model-b-rest` | Full | REST | Adds auth + search |
| `model-b-graphql` | Full | GraphQL | Adds auth + search |

---

### 4. Initialize Your Run

```bash
./scripts/initialize_run.sh --profile model-a-rest --tool "YourTool" --tool-ver "1.0"
```

This creates: `runs/YYYYMMDDTHHmm/start_build_api_prompt.txt`

---

### 5. Follow the Prompts

1. **Paste the API prompt** into your AI tool
2. **Wait for implementation** to complete
3. **Verify the API works**:
   ```bash
   cd runs/YYYYMMDDTHHmm/PawMate
   ./startup.sh  # or .\startup.ps1 on Windows
   ```
4. **Access:** http://localhost:3000

---

## 🚀 Platform-Specific Quick Start

### macOS / Linux

```bash
# 1. Clone
git clone https://github.com/yourorg/pawmate-ai-challenge.git
cd pawmate-ai-challenge

# 2. Verify (or install Node.js if needed)
./scripts/verify_environment.sh

# 3. Initialize
./scripts/initialize_run.sh --profile model-a-rest --tool "YourTool" --tool-ver "1.0"

# 4. Follow prompts, then start services
cd runs/*/PawMate
./startup.sh
```

---

### Windows (PowerShell - Recommended)

```powershell
# 1. Install Node.js from nodejs.org (if not already)

# 2. Clone repository
git clone https://github.com/yourorg/pawmate-ai-challenge.git
cd pawmate-ai-challenge

# 3. Verify environment
# Run in Git Bash or use bash script verification tool
./scripts/verify_environment.sh

# 4. Initialize run (Git Bash may be needed for initialization script)
./scripts/initialize_run.sh --profile model-a-rest --tool "YourTool" --tool-ver "1.0"

# 5. Follow prompts, then start services with PowerShell
cd runs\*\PawMate
.\startup.ps1
```

**Note:** PowerShell is native to Windows and provides full compatibility. Use the `.ps1` scripts for starting/stopping services.

---

## 📚 Documentation Quick Links

| Need Help With... | See Document |
|-------------------|--------------|
| **Installing Node.js** | [`docs/Setup_Instructions.md`](docs/Setup_Instructions.md) |
| **Cross-platform issues** | [`docs/Cross_Platform_Support.md`](docs/Cross_Platform_Support.md) |
| **Understanding requirements** | [`docs/Master_Functional_Spec.md`](docs/Master_Functional_Spec.md) |
| **API contract details** | [`docs/API_Contract.md`](docs/API_Contract.md) |
| **Acceptance criteria** | [`docs/Acceptance_Criteria.md`](docs/Acceptance_Criteria.md) |

---

## ⚠️ Common Issues

### "node: command not found"

→ Install Node.js: See [`docs/Setup_Instructions.md`](docs/Setup_Instructions.md)

### "permission denied" on scripts

```bash
chmod +x startup.sh shutdown.sh
chmod +x scripts/*.sh
```

### Scripts don't work on Windows

→ Use PowerShell scripts (.ps1) - native Windows solution

### Old Node.js version

```bash
# Using nvm
nvm install 20
nvm use 20

# Or see Setup_Instructions.md for your package manager
```

---

## 🎯 Success Criteria

You're ready to run benchmarks when:

- ✅ `./scripts/verify_environment.sh` passes
- ✅ You've chosen a profile
- ✅ You've initialized a run folder
- ✅ You understand which docs to reference

---

## 💡 Tips

1. **Always verify environment first** - saves time later
2. **Windows users:** Use PowerShell scripts for native compatibility
3. **Keep Node.js updated** - use LTS versions (18.x, 20.x)
4. **Read the spec** - it's detailed for a reason
5. **Use the startup scripts** - they handle service ordering

---

## 🆘 Need More Help?

1. Check [`docs/Setup_Instructions.md`](docs/Setup_Instructions.md#common-issues-and-solutions)
2. Review [`docs/Cross_Platform_Support.md`](docs/Cross_Platform_Support.md)
3. Open an issue in the repository

---

**Ready to Start?** Run: `./scripts/verify_environment.sh` ✨

