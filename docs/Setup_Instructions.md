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

#### Recommended: Use WSL 2 (Windows Subsystem for Linux)

**Why WSL?** The benchmarking tool uses Unix-style shell scripts. WSL provides the most compatible environment.

##### Step 1: Install WSL 2

1. Open PowerShell as Administrator
2. Run:
   ```powershell
   wsl --install
   ```
3. Restart your computer
4. Set up your Linux username and password when prompted

##### Step 2: Install Node.js in WSL

Open WSL terminal and follow the **Linux Setup** instructions below.

##### Step 3: Access Windows files from WSL

Your Windows C: drive is available at `/mnt/c/` in WSL:
```bash
cd /mnt/c/Users/YourUsername/Documents
```

#### Alternative: Git Bash + Node.js (Limited Support)

If you cannot use WSL, you can use Git Bash, but some features may not work perfectly:

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

**Note:** PowerShell scripts are provided for Windows users, but WSL is strongly recommended for full compatibility.

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

### Issue: Windows scripts don't work in PowerShell

**Solution:** Use WSL (recommended) or Git Bash. See Windows Setup section above.

### Issue: `lsof: command not found` on Windows/Git Bash

**Solution:** This is expected in Git Bash. Use WSL for full compatibility, or use the PowerShell scripts (when provided).

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

### Windows + WSL
- ✅ Full compatibility (recommended for Windows users)
- ✅ All Linux/Unix commands work
- ⚠️ Ensure you're working in the Linux filesystem (`~`) for best performance
- ⚠️ Windows files accessible via `/mnt/c/`

### Windows + Git Bash
- ⚠️ Limited compatibility
- ⚠️ Some process management commands may not work
- ⚠️ Use WSL for production benchmarking

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
- **Windows:** Windows Terminal (with WSL)
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
| **Windows** | WSL 2 | ✅ Full |
| **Windows** | Git Bash | ⚠️ Limited |
| **Linux** | Native or nvm | ✅ Full |

**Minimum Requirements:**
- Node.js >= 18.x
- npm >= 9.x
- Unix-like shell environment

**For best experience:** Use macOS, Linux, or Windows with WSL 2.

