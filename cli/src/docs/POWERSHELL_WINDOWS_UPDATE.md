# PowerShell-First Windows Support Update

## Overview

Updated all benchmarking documentation to emphasize **PowerShell as the primary Windows solution** instead of WSL (Windows Subsystem for Linux). This reflects the reality that PowerShell is:
- ✅ Native to Windows (pre-installed)
- ✅ Zero additional setup required
- ✅ Full feature parity with Unix scripts
- ✅ Simpler for Windows users

## Rationale

**Previous approach:** Recommended WSL for Windows users
- ❌ Required additional installation and configuration
- ❌ Added complexity (two environments to understand)
- ❌ Created unnecessary barrier to entry
- ❌ Not actually needed for this project

**New approach:** Recommend PowerShell for Windows users
- ✅ Already installed on all modern Windows
- ✅ Native Windows solution
- ✅ Equivalent functionality via `.ps1` scripts
- ✅ Simpler setup and maintenance

## Files Updated

### 1. Core Documentation

#### `docs/Master_Functional_Spec.md`
**Changes:**
- `REQ-PLATFORM-0002-A`: Changed from "Windows via WSL or PowerShell" to "Windows via native PowerShell scripts"
- `REQ-PLATFORM-0004-A`: Changed PowerShell scripts from "MAY be provided" to "MUST be provided"

**Impact:** Makes PowerShell support mandatory, not optional.

---

#### `docs/Setup_Instructions.md`
**Changes:**
- Reorganized Windows section to lead with PowerShell (not WSL)
- Removed WSL installation instructions from recommended path
- Updated platform comparison table to show "Windows + PowerShell" as primary
- Changed all "use WSL" recommendations to "use PowerShell"
- Updated terminal recommendations to "Windows Terminal (with PowerShell)"

**Before:**
```markdown
### Windows Setup
#### Recommended: Use WSL 2
...
#### Alternative: Git Bash + Node.js
```

**After:**
```markdown
### Windows Setup
#### Recommended: Use PowerShell (Native Windows)
...
#### Alternative: Git Bash (Limited Support)
```

---

#### `docs/Cross_Platform_Support.md`
**Changes:**
- Updated platform table to show "Windows + PowerShell" as full support (100%)
- Removed "Windows + WSL" row entirely
- Changed all troubleshooting advice from "use WSL" to "use PowerShell"
- Updated testing matrix to require PowerShell testing (not WSL)
- Changed minimum test coverage from "macOS + Windows (WSL)" to "macOS + Windows (PowerShell)"
- Updated requirements to make PowerShell scripts MUST instead of MAY

**Platform Support Matrix:**

| Platform | Method | Compatibility | Status |
|----------|--------|---------------|---------|
| **macOS** | Native bash | Full (100%) | ✅ Primary |
| **Linux** | Native bash | Full (100%) | ✅ Primary |
| **Windows** | PowerShell | Full (100%) | ✅ **Recommended** |
| **Windows** | Git Bash | Limited (60%) | ⚠️ Not recommended |

---

### 2. Quick Start Guides

#### `README.md`
**Changes:**
- Updated prerequisites to show "Bash shell (macOS/Linux) or PowerShell (Windows)"
- Changed setup guide link text from "Windows (WSL recommended)" to "Windows (PowerShell recommended)"

**Before:**
```markdown
- Bash shell (macOS/Linux native, Windows via WSL)
- Windows (WSL recommended, or PowerShell)
```

**After:**
```markdown
- Bash shell (macOS/Linux) or PowerShell (Windows)
- Windows (PowerShell recommended, or Git Bash)
```

---

#### `QUICK_START_CHECKLIST.md`
**Changes:**
- Removed entire "Windows (WSL - Recommended)" section
- Promoted "Windows (PowerShell)" section to primary
- Updated tips from "WSL is worth the 10-minute setup" to "Use PowerShell for native compatibility"
- Changed all troubleshooting advice from WSL to PowerShell

**Section Order:**
1. macOS / Linux (unchanged)
2. **Windows (PowerShell - Recommended)** ← Now primary
3. ~~Windows (WSL - Recommended)~~ ← Removed

---

### 3. Scripts and Tools

#### `scripts/verify_environment.sh` and `scripts/verify_environment.ps1`

**New File Created:** `scripts/verify_environment.ps1` - Native PowerShell version of the environment verification script.

**Changes to `verify_environment.sh`:**
- Removed "Running in WSL (recommended for Windows)" message
- Changed Git Bash detection to recommend PowerShell instead of WSL
- Updated warning message: "For best Windows experience, use PowerShell with .ps1 scripts"

**Before:**
```bash
echo "✓ Running in WSL (recommended for Windows)"
# or
echo "! Running in Git Bash/Cygwin (WSL recommended)"
```

**After:**
```bash
echo "✓ Running in Linux environment"
# or
echo "! Running in Git Bash/Cygwin"
echo "! For best Windows experience, use PowerShell with .ps1 scripts"
```

**New PowerShell Script Features:**
- ✅ Checks Node.js, npm, curl (or Invoke-WebRequest)
- ✅ Validates Node.js version (>= 18.x)
- ✅ Validates npm version (>= 8.x)
- ✅ Shows PowerShell version information
- ✅ Color-coded output (Green ✓, Red ✗, Yellow !)
- ✅ Exit codes (0 = success, 1 = failure)

---

## Summary of Changes

### Requirements Updated
- `REQ-PLATFORM-0002-A`: Windows support via PowerShell (not WSL)
- `REQ-PLATFORM-0004-A`: PowerShell scripts MUST be provided (not optional)

### Documentation Files Updated
1. ✅ `docs/Master_Functional_Spec.md`
2. ✅ `docs/Setup_Instructions.md`
3. ✅ `docs/Cross_Platform_Support.md`
4. ✅ `README.md`
5. ✅ `QUICK_START_CHECKLIST.md`
6. ✅ `scripts/verify_environment.sh`
7. ✅ `scripts/verify_environment.ps1` (NEW - created for Windows)

### Key Messaging Changes

| Old Message | New Message |
|-------------|-------------|
| "WSL recommended for Windows" | "PowerShell recommended for Windows" |
| "WSL provides best compatibility" | "PowerShell provides full native compatibility" |
| "Use WSL or PowerShell" | "Use PowerShell (native Windows solution)" |
| "PowerShell scripts optional" | "PowerShell scripts required" |
| "Full support with WSL" | "Full support with PowerShell" |

---

## Impact on Users

### Windows Users
**Before:**
1. Read about WSL
2. Decide if they want to install WSL
3. If yes: Install WSL, restart, configure
4. If no: Try PowerShell (marked as "alternative")
5. **Time:** 20-30 minutes

**After:**
1. Use PowerShell (already installed)
2. Run `.ps1` scripts
3. **Time:** 0 minutes (no setup)

### Developers/Contributors
**Before:**
- Could provide only bash scripts
- PowerShell support was optional
- Testing on WSL was acceptable

**After:**
- MUST provide PowerShell scripts
- PowerShell support is required
- Testing on native PowerShell required

---

## Testing Implications

### Old Testing Matrix
- macOS 14+ (required)
- Windows 11 + WSL 2 (required)
- Windows 11 + PowerShell (optional)

### New Testing Matrix
- macOS 14+ (required)
- **Windows 11 + PowerShell (required)**
- ~~Windows + WSL (removed)~~

**Impact:** Simpler testing requirements, more realistic for actual Windows users.

---

## Migration Guide for Existing Users

If you were previously using WSL, you can continue to do so. However, we now recommend PowerShell for Windows users.

### Switching from WSL to PowerShell

**If you're currently using WSL:**
1. You can continue using WSL (it still works)
2. Or switch to native Windows with PowerShell:
   - Install Node.js for Windows (if not already)
   - Use PowerShell instead of WSL terminal
   - Run `.ps1` scripts instead of `.sh` scripts

**Benefits of switching:**
- Simpler environment (one less layer)
- Better Windows integration
- Faster file system access
- Native Windows process management

---

## Backward Compatibility

### Scripts
- ✅ `.sh` scripts still work on macOS/Linux
- ✅ `.ps1` scripts now required for Windows
- ✅ WSL users can still run `.sh` scripts (not blocked)

### Documentation
- ✅ All old documentation preserved in git history
- ✅ No breaking changes to APIs or formats
- ✅ Only recommendation changes (not requirements for users)

---

## Future Considerations

### Removed Complexity
- ❌ No need to explain WSL in docs
- ❌ No need to troubleshoot WSL-specific issues
- ❌ No need to maintain two Windows paths

### Simplified Message
- ✅ "Use PowerShell on Windows" (simple, clear)
- ✅ Native solution (no extra installs)
- ✅ Familiar to Windows users

---

## Conclusion

This update significantly simplifies the Windows experience by:
1. **Removing unnecessary complexity** (WSL installation)
2. **Using native tools** (PowerShell pre-installed)
3. **Providing clear guidance** (one recommended path)
4. **Improving user experience** (zero setup time)

**Bottom line:** Windows users can now run benchmarks immediately using PowerShell, without any additional setup or installation.

---

## Checklist for Implementation Developers

When creating a new implementation for this benchmark:

- [ ] Create `startup.sh` for macOS/Linux
- [ ] Create `shutdown.sh` for macOS/Linux
- [ ] **Create `startup.ps1` for Windows** ← Now required
- [ ] **Create `shutdown.ps1` for Windows** ← Now required
- [ ] Test on macOS or Linux
- [ ] **Test on Windows with PowerShell** ← Now required
- [ ] Document any Windows-specific prerequisites in README

**Note:** PowerShell support is no longer optional. All submissions must include working `.ps1` scripts.

---

**Date:** December 23, 2025  
**Updated By:** Documentation review based on user feedback  
**Reason:** PowerShell is native to Windows and should be the primary recommendation

