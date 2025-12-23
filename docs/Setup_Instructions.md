# PawMate Benchmarking Tool - Setup Instructions

## Overview

This document provides step-by-step setup instructions for running the PawMate benchmarking tool on **macOS**, **Windows**, and **Linux**.

---

## Prerequisites

### All Platforms

The benchmarking tool requires:
- **Node.js** version 18 or higher
- **npm** (comes with Node.js)
- **Git** (optional, but recommended)
- A terminal/command-line interface

---

## Setup by Operating System

### macOS Setup

#### Option 1: Using Homebrew (Recommended)

1. **Install Homebrew** (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js**:
   ```bash
   brew install node@20
   ```

3. **Verify installation**:
   ```bash
   node --version  # Should show v20.x.x or higher
   npm --version   # Should show 10.x.x or higher
   ```

#### Option 2: Using Node Version Manager (nvm)

1. **Install nvm**:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Reload shell configuration**:
   ```bash
   source ~/.bash_profile  # or ~/.zshrc if using zsh
   ```

3. **Install Node.js**:
   ```bash
   nvm install 20
   nvm use 20
   nvm alias default 20
   ```

4. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

#### Option 3: Download from nodejs.org

1. Visit https://nodejs.org/
2. Download the "LTS" (Long Term Support) version
3. Run the installer
4. Verify installation in Terminal

---

### Windows Setup

#### Recommended: Use PowerShell (Native Windows)

**Why PowerShell?** PowerShell comes pre-installed on all modern Windows systems and provides full compatibility with the benchmarking tool through native `.ps1` scripts.

##### Step 1: Install Node.js

1. **Download Node.js**:
   - Visit https://nodejs.org/
   - Download the "LTS" (Long Term Support) version
   - Run the installer (accept defaults)

2. **Verify installation**:
   Open PowerShell and run:
   ```powershell
   node --version  # Should show v18.x.x or higher
   npm --version   # Should show 9.x.x or higher
   ```

3. **Use PowerShell scripts**:
   The implementation includes `.ps1` PowerShell scripts:
   ```powershell
   .\startup.ps1   # Start services
   .\shutdown.ps1  # Stop services
   ```

**Note:** You may need to enable script execution. If you see an error about execution policy, run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Alternative: Git Bash (Limited Support)

If you prefer a Unix-like environment on Windows:

1. **Install Git for Windows** (includes Git Bash):
   - Download from https://git-scm.com/download/win
   - During installation, select "Use Git and optional Unix tools from Command Prompt"

2. **Install Node.js**:
   - Download from https://nodejs.org/
   - Choose the "LTS" version
   - Run the installer (accept defaults)

3. **Verify in Git Bash**:
   ```bash
   node --version
   npm --version
   ```

**Note:** PowerShell scripts provide full native Windows compatibility. Use `.ps1` scripts for starting and stopping services.

---

### Linux Setup

#### Ubuntu/Debian

1. **Update package index**:
   ```bash
   sudo apt update
   ```

2. **Install Node.js (method 1: NodeSource)**:
   ```bash
   # Add NodeSource repository for Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   
   # Install Node.js
   sudo apt install -y nodejs
   ```

3. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

#### Using nvm (Recommended for version management)

1. **Install nvm**:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Reload shell**:
   ```bash
   source ~/.bashrc
   ```

3. **Install Node.js**:
   ```bash
   nvm install 20
   nvm use 20
   nvm alias default 20
   ```

#### Fedora/RHEL/CentOS

```bash
# Add NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# Install Node.js
sudo dnf install -y nodejs  # or 'yum' on older systems
```

---

## Verify Your Environment

After installing Node.js, run the environment verification script:

```bash
cd pawmate-ai-challenge
chmod +x scripts/verify_environment.sh
./scripts/verify_environment.sh
```

Expected output:
```
==========================================
PawMate Benchmark Environment Verification
==========================================

Required Tools:
---------------
✓ Node.js: v20.x.x
✓ npm: 10.x.x
✓ curl: ...

✓ Environment verification passed!
```

If you see any ✗ errors, review the output and install missing tools.

---

## Common Issues and Solutions

### Issue: `node: command not found`

**Solution:** Node.js is not in your PATH. 

- **macOS/Linux:** Restart your terminal or run `source ~/.bashrc` (or `~/.zshrc`)
- **Windows:** Restart your terminal or computer after Node.js installation

### Issue: `permission denied` on scripts

**Solution:** Make scripts executable:
```bash
chmod +x startup.sh shutdown.sh
```

### Issue: Old Node.js version

**Solution:** Update Node.js using your package manager or nvm:
```bash
# Using nvm
nvm install 20
nvm use 20

# Using Homebrew (macOS)
brew upgrade node@20

# Using apt (Ubuntu/Debian)
sudo apt update
sudo apt install --only-upgrade nodejs
```

### Issue: Bash scripts don't work in PowerShell

**Solution:** Use the PowerShell scripts (`.ps1` files) provided for Windows. They provide full native compatibility.

### Issue: `lsof: command not found` on Windows/Git Bash

**Solution:** This is expected in Git Bash. Use PowerShell scripts (`.ps1`) for full Windows compatibility.

---

## Repository Structure

After cloning, your directory structure should look like:

```
pawmate-ai-challenge/
├── docs/                  # Specification documents
├── prompts/              # Prompt templates
├── runs/                 # Benchmark run outputs
├── scripts/              # Utility scripts
│   ├── initialize_run.sh
│   └── verify_environment.sh
└── README.md
```

---

## Next Steps

1. **Verify your environment**: Run `./scripts/verify_environment.sh`
2. **Read the main README**: `cat README.md`
3. **Initialize your first run**: `./scripts/initialize_run.sh --profile model-a-rest --tool "YourTool" --tool-ver "1.0"`
4. **Follow the prompts**: Use the generated prompts in `runs/*/start_build_api_prompt.txt`

---

## Platform-Specific Notes

### macOS
- ✅ Full compatibility with all scripts
- ✅ All shell commands work natively
- ✅ Recommended platform for development

### Windows + PowerShell
- ✅ Full compatibility (recommended for Windows users)
- ✅ Native Windows solution with `.ps1` scripts
- ✅ No additional tools required
- ✅ PowerShell pre-installed on all modern Windows

### Windows + Git Bash
- ⚠️ Limited compatibility
- ⚠️ Some process management commands may not work
- ⚠️ Use PowerShell scripts for production benchmarking

### Linux
- ✅ Full compatibility with all scripts
- ✅ Preferred platform for CI/CD environments

---

## Updating Node.js

### Using nvm (all platforms)
```bash
nvm install 20      # Install latest v20
nvm use 20          # Switch to v20
nvm alias default 20 # Set as default
```

### Using Homebrew (macOS)
```bash
brew upgrade node@20
```

### Using apt (Ubuntu/Debian)
```bash
sudo apt update
sudo apt upgrade nodejs
```

---

## Additional Tools (Optional)

### Recommended IDE/Editor
- **Visual Studio Code** with extensions:
  - ESLint
  - Prettier
  - REST Client (for API testing)

### Recommended Terminal
- **macOS:** iTerm2 or built-in Terminal
- **Windows:** Windows Terminal (with PowerShell) or PowerShell ISE
- **Linux:** GNOME Terminal, Konsole, or your distribution's default

---

## Getting Help

If you encounter issues not covered here:

1. Check the [Troubleshooting Guide](./Troubleshooting.md) (if available)
2. Review the [main README](../README.md)
3. Open an issue in the repository with:
   - Your operating system and version
   - Node.js version (`node --version`)
   - Output of `./scripts/verify_environment.sh`
   - The error message you're seeing

---

## Summary

| Platform | Recommended Setup | Compatibility |
|----------|------------------|---------------|
| **macOS** | Homebrew or nvm | ✅ Full |
| **Windows** | PowerShell + Node.js | ✅ Full |
| **Windows** | Git Bash | ⚠️ Limited |
| **Linux** | Native or nvm | ✅ Full |

**Minimum Requirements:**
- Node.js >= 18.x
- npm >= 9.x
- PowerShell (Windows), Bash (macOS/Linux)

**For best experience:** Use PowerShell on Windows, native terminal on macOS/Linux.

