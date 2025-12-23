# Environment Verification Script for PawMate Benchmarking (PowerShell)
# Checks that all required tools are installed before running benchmarks

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "PawMate Benchmark Environment Verification" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Track errors and warnings
$script:Errors = 0
$script:Warnings = 0

# Check command function
function Check-Command {
    param(
        [string]$Command,
        [string]$Name,
        [string]$VersionFlag = "--version",
        [bool]$Required = $true
    )
    
    try {
        $null = Get-Command $Command -ErrorAction Stop
        $version = & $Command $VersionFlag 2>&1 | Select-Object -First 1
        Write-Host "✓ " -ForegroundColor Green -NoNewline
        Write-Host "$Name: $version"
        return $true
    }
    catch {
        if ($Required) {
            Write-Host "✗ " -ForegroundColor Red -NoNewline
            Write-Host "$Name: NOT FOUND (REQUIRED)"
            $script:Errors++
        }
        else {
            Write-Host "! " -ForegroundColor Yellow -NoNewline
            Write-Host "$Name: NOT FOUND (optional)"
            $script:Warnings++
        }
        return $false
    }
}

# Check required tools
Write-Host "Required Tools:"
Write-Host "---------------"
$nodeFound = Check-Command -Command "node" -Name "Node.js" -VersionFlag "--version" -Required $true
$npmFound = Check-Command -Command "npm" -Name "npm" -VersionFlag "--version" -Required $true

# Check for curl (may be an alias in PowerShell)
try {
    $curlVersion = curl --version 2>&1 | Select-Object -First 1
    Write-Host "✓ " -ForegroundColor Green -NoNewline
    Write-Host "curl: $curlVersion"
}
catch {
    # Try Invoke-WebRequest as fallback
    if (Get-Command Invoke-WebRequest -ErrorAction SilentlyContinue) {
        Write-Host "✓ " -ForegroundColor Green -NoNewline
        Write-Host "curl: Available (via Invoke-WebRequest alias)"
    }
    else {
        Write-Host "✗ " -ForegroundColor Red -NoNewline
        Write-Host "curl: NOT FOUND (REQUIRED)"
        $script:Errors++
    }
}

Write-Host ""
Write-Host "Optional Tools:"
Write-Host "---------------"
Check-Command -Command "git" -Name "Git" -VersionFlag "--version" -Required $false | Out-Null

Write-Host ""
Write-Host "System Information:"
Write-Host "-------------------"
Write-Host "OS: $([System.Environment]::OSVersion.Platform) - $([System.Environment]::OSVersion.VersionString)"
Write-Host "Architecture: $([System.Environment]::Is64BitOperatingSystem ? 'x64' : 'x86')"
Write-Host "PowerShell: $($PSVersionTable.PSVersion)"
Write-Host "Shell: PowerShell"

# Check Node.js version
if ($nodeFound) {
    Write-Host ""
    Write-Host "Node.js Version Check:"
    Write-Host "----------------------"
    
    try {
        $nodeVersionOutput = node --version 2>&1
        $nodeVersion = $nodeVersionOutput.ToString().TrimStart('v')
        $nodeMajor = [int]($nodeVersion.Split('.')[0])
        
        if ($nodeMajor -ge 18) {
            Write-Host "✓ " -ForegroundColor Green -NoNewline
            Write-Host "Node.js $nodeVersion is compatible (>= 18.x required)"
        }
        else {
            Write-Host "✗ " -ForegroundColor Red -NoNewline
            Write-Host "Node.js $nodeVersion is too old (>= 18.x required)"
            $script:Errors++
        }
    }
    catch {
        Write-Host "! " -ForegroundColor Yellow -NoNewline
        Write-Host "Could not determine Node.js version"
        $script:Warnings++
    }
}

# Check npm version
if ($npmFound) {
    Write-Host ""
    Write-Host "npm Version Check:"
    Write-Host "------------------"
    
    try {
        $npmVersionOutput = npm --version 2>&1
        $npmVersion = $npmVersionOutput.ToString().Trim()
        $npmMajor = [int]($npmVersion.Split('.')[0])
        
        if ($npmMajor -ge 8) {
            Write-Host "✓ " -ForegroundColor Green -NoNewline
            Write-Host "npm $npmVersion is compatible (>= 8.x recommended)"
        }
        else {
            Write-Host "! " -ForegroundColor Yellow -NoNewline
            Write-Host "npm $npmVersion is old (>= 8.x recommended)"
            $script:Warnings++
        }
    }
    catch {
        Write-Host "! " -ForegroundColor Yellow -NoNewline
        Write-Host "Could not determine npm version"
        $script:Warnings++
    }
}

# PowerShell-specific check
Write-Host ""
Write-Host "PowerShell Environment:"
Write-Host "----------------------"
Write-Host "✓ " -ForegroundColor Green -NoNewline
Write-Host "PowerShell $($PSVersionTable.PSVersion) detected"
Write-Host "✓ " -ForegroundColor Green -NoNewline
Write-Host "Recommended for native Windows development"

# Final summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
if ($script:Errors -eq 0) {
    Write-Host "✓ Environment verification passed!" -ForegroundColor Green
    if ($script:Warnings -gt 0) {
        Write-Host "! $($script:Warnings) warning(s) - review above" -ForegroundColor Yellow
    }
    Write-Host "==========================================" -ForegroundColor Cyan
    exit 0
}
else {
    Write-Host "✗ Environment verification failed with $($script:Errors) error(s)" -ForegroundColor Red
    if ($script:Warnings -gt 0) {
        Write-Host "! $($script:Warnings) warning(s) - review above" -ForegroundColor Yellow
    }
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please install missing required tools before proceeding."
    Write-Host "See docs/Setup_Instructions.md for installation guidance."
    exit 1
}

