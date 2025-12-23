#!/bin/bash
#
# Environment Verification Script for PawMate Benchmarking
# Checks that all required tools are installed before running benchmarks
#

set -e

echo "=========================================="
echo "PawMate Benchmark Environment Verification"
echo "=========================================="
echo ""

# Track errors
ERRORS=0
WARNINGS=0

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check_command() {
    local cmd=$1
    local name=$2
    local version_flag=$3
    local required=$4
    
    if command -v "$cmd" &> /dev/null; then
        local version=$($cmd $version_flag 2>&1 | head -n 1)
        echo -e "${GREEN}✓${NC} $name: $version"
        return 0
    else
        if [ "$required" = "required" ]; then
            echo -e "${RED}✗${NC} $name: NOT FOUND (REQUIRED)"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${YELLOW}!${NC} $name: NOT FOUND (optional)"
            WARNINGS=$((WARNINGS + 1))
        fi
        return 1
    fi
}

# Check version
check_version() {
    local cmd=$1
    local name=$2
    local version_cmd=$3
    local min_version=$4
    
    if command -v "$cmd" &> /dev/null; then
        local version=$($version_cmd 2>&1)
        echo -e "${GREEN}✓${NC} $name version check: $version"
        # More sophisticated version checking could be added here
        return 0
    fi
    return 1
}

echo "Required Tools:"
echo "---------------"
check_command "node" "Node.js" "--version" "required"
check_command "npm" "npm" "--version" "required"
check_command "curl" "curl" "--version" "required"

echo ""
echo "Optional Tools:"
echo "---------------"
check_command "git" "Git" "--version" "optional"

echo ""
echo "System Information:"
echo "-------------------"
echo "OS: $(uname -s)"
echo "Architecture: $(uname -m)"
echo "Shell: $SHELL"

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | sed 's/v//')
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
    
    echo ""
    echo "Node.js Version Check:"
    echo "----------------------"
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION is compatible (>= 18.x required)"
    else
        echo -e "${RED}✗${NC} Node.js $NODE_VERSION is too old (>= 18.x required)"
        ERRORS=$((ERRORS + 1))
    fi
fi

# Check if running on Windows (WSL or Git Bash)
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || grep -qi microsoft /proc/version 2>/dev/null; then
    echo ""
    echo "Windows Environment Detected:"
    echo "-----------------------------"
    if grep -qi microsoft /proc/version 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Running in WSL (recommended for Windows)"
    else
        echo -e "${YELLOW}!${NC} Running in Git Bash/Cygwin (WSL recommended)"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

echo ""
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Environment verification passed!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}! $WARNINGS warning(s) - review above${NC}"
    fi
    echo "=========================================="
    exit 0
else
    echo -e "${RED}✗ Environment verification failed with $ERRORS error(s)${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}! $WARNINGS warning(s) - review above${NC}"
    fi
    echo "=========================================="
    echo ""
    echo "Please install missing required tools before proceeding."
    echo "See docs/Setup_Instructions.md for installation guidance."
    exit 1
fi

