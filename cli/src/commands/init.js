import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import { select, input } from '@inquirer/prompts'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read package version for banner
const packageJsonPath = path.join(__dirname, '..', '..', 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
const PACKAGE_VERSION = packageJson.version

/**
 * Display PawMate banner matching APM styling
 * @param {string} version - Package version
 */
function displayBanner(version = '1.0.0') {
    const BANNER_WIDTH = 80
    const border = chalk.blue('║')
    const innerWidth = BANNER_WIDTH - 2 // 78 characters

    // Build ASCII art as plain text first to get accurate character counts
    const plainLine1 = '██████╗  █████╗ ██╗    ██╗███╗   ███╗ █████╗ ████████╗███████╗'
    const plainLine2 = '██╔══██╗██╔══██╗██║    ██║████╗ ████║██╔══██╗╚══██╔══╝██╔════╝'
    const plainLine3 = '██████╔╝███████║██║ █╗ ██║██╔████╔██║███████║   ██║   █████╗  '
    const plainLine4 = '██╔═══╝ ██╔══██║██║███╗██║██║╚██╔╝██║██╔══██║   ██║   ██╔══╝  '
    const plainLine5 = '██║     ██║  ██║╚███╔███╔╝██║ ╚═╝ ██║██║  ██║   ██║   ███████╗'
    const plainLine6 = '╚═╝     ╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝'

    // Apply colors maintaining same character positions
    const line1 =
        chalk.white('██████╗') +
        '  ' +
        chalk.cyan('█████╗') +
        ' ' +
        chalk.white('██╗    ██╗') +
        chalk.cyan('███╗   ███╗') +
        ' ' +
        chalk.white('█████╗') +
        ' ' +
        chalk.cyan('████████╗') +
        chalk.white('███████╗')
    const line2 =
        chalk.white('██╔══██╗') +
        chalk.cyan('██╔══██╗') +
        chalk.white('██║    ██║') +
        chalk.cyan('████╗ ████║') +
        chalk.white('██╔══██╗') +
        chalk.cyan('╚══██╔══╝') +
        chalk.white('██╔════╝')
    const line3 =
        chalk.white('██████╔╝') +
        chalk.cyan('███████║') +
        chalk.white('██║ █╗ ██║') +
        chalk.cyan('██╔████╔██║') +
        chalk.white('███████║') +
        '   ' +
        chalk.cyan('██║   ') +
        chalk.white('█████╗  ')
    const line4 =
        chalk.white('██╔═══╝') +
        ' ' +
        chalk.cyan('██╔══██║') +
        chalk.white('██║███╗██║') +
        chalk.cyan('██║╚██╔╝██║') +
        chalk.white('██╔══██║') +
        '   ' +
        chalk.cyan('██║   ') +
        chalk.white('██╔══╝  ')
    const line5 =
        chalk.white('██║') +
        '     ' +
        chalk.cyan('██║  ██║') +
        chalk.white('╚███╔███╔╝') +
        chalk.cyan('██║ ╚═╝ ██║') +
        chalk.white('██║  ██║') +
        '   ' +
        chalk.cyan('██║   ') +
        chalk.white('███████╗')
    const line6 =
        chalk.white('╚═╝') +
        '     ' +
        chalk.cyan('╚═╝  ╚═╝') +
        ' ' +
        chalk.white('╚══╝╚══╝') +
        ' ' +
        chalk.cyan('╚═╝     ╚═╝') +
        chalk.white('╚═╝  ╚═╝') +
        '   ' +
        chalk.cyan('╚═╝   ') +
        chalk.white('╚══════╝')

    // Helper to center content
    const centerLine = (content, plainLength) => {
        const padding = innerWidth - plainLength
        const leftPad = Math.floor(padding / 2)
        const rightPad = padding - leftPad
        return ' '.repeat(leftPad) + content + ' '.repeat(rightPad)
    }

    // Version text centered
    const versionText = `PawMate AI Challenge v${version}`
    const versionLine = centerLine(chalk.cyan.bold(versionText), versionText.length)

    // Tagline centered
    const tagline = 'Benchmarking AI Coding Assistants on Real-World Tasks'
    const taglineLine = centerLine(chalk.gray(tagline), tagline.length)

    // GitHub link centered
    const link = 'github.com/fastcraft-ai/pawmate-ai-challenge'
    const linkLine = centerLine(chalk.cyan.underline(link), link.length)

    const lines = [
        chalk.blue('╔══════════════════════════════════════════════════════════════════════════════╗'),
        border + ' '.repeat(innerWidth) + border,
        border + ' '.repeat(innerWidth) + border,
        border + centerLine(line1, plainLine1.length) + border,
        border + centerLine(line2, plainLine2.length) + border,
        border + centerLine(line3, plainLine3.length) + border,
        border + centerLine(line4, plainLine4.length) + border,
        border + centerLine(line5, plainLine5.length) + border,
        border + centerLine(line6, plainLine6.length) + border,
        border + ' '.repeat(innerWidth) + border,
        border + versionLine + border,
        border + ' '.repeat(innerWidth) + border,
        border + taglineLine + border,
        border + ' '.repeat(innerWidth) + border,
        border + linkLine + border,
        border + ' '.repeat(innerWidth) + border,
        chalk.blue('╚══════════════════════════════════════════════════════════════════════════════╝'),
    ]

    lines.forEach((line) => console.log(line))
    console.log() // Blank line for spacing
}

// Profile choices for interactive selection
const profileChoices = [
    {
        name: 'Model A - REST API',
        value: 'model-a-rest',
        description: 'Minimum feature set with REST API endpoints',
    },
    {
        name: 'Model A - GraphQL API',
        value: 'model-a-graphql',
        description: 'Minimum feature set with GraphQL API',
    },
    {
        name: 'Model B - REST API',
        value: 'model-b-rest',
        description: 'Full feature set with REST API endpoints',
    },
    {
        name: 'Model B - GraphQL API',
        value: 'model-b-graphql',
        description: 'Full feature set with GraphQL API',
    },
]

/**
 * Initialize a new PawMate benchmark run
 * @param {Object} options - Command options
 * @param {string} options.profile - Profile name (e.g., model-a-rest)
 * @param {string} options.tool - Tool name
 * @param {string} [options.toolVer] - Tool version
 * @param {string} [options.specVer] - Spec version
 * @param {string} [options.runDir] - Run directory path
 */
export default async function init(options) {
    let { profile, tool, toolVer = '', specVer = '', runDir = '' } = options

    // Display banner at start
    displayBanner(PACKAGE_VERSION)

    // Interactive profile selection if not provided via flag
    if (!profile) {
        profile = await select({
            message: 'Select benchmark profile:',
            choices: profileChoices,
        })
    }

    // Interactive tool name prompt if not provided via flag
    if (!tool) {
        console.log('')
        console.log(chalk.gray('Examples:'))
        console.log(chalk.gray('  Cursor, Windsurf, Antigravity, Zed, Replit, GithubAgentHQ, JetBrainsAI'))
        console.log(chalk.gray('  ClaudeCode, ChatGPT, Phind, Aider'))
        console.log(chalk.gray('  Copilot, VSCode+Copilot, IntelliJ+Copilot, PyCharm+Copilot, WebStorm+Copilot, Rider+Copilot, Neovim+Copilot'))
        console.log(chalk.gray('  Tabnine, VSCode+Tabnine, IntelliJ+Tabnine, Codeium, VSCode+Codeium, IntelliJ+Codeium'))
        console.log(chalk.gray('  AmazonQ, CodeWhisperer, Cody, Continue, VSCode+Continue, IntelliJ+Continue'))
        console.log(chalk.gray('  AskCodi, Blackbox, Roo, CodeGPT'))
        tool = await input({
            message: 'Tool name:',
            validate: (value) => {
                if (value.length === 0) {
                    return 'Tool name is required'
                }
                if (value.trim() !== value) {
                    return 'Tool name cannot have leading or trailing whitespace'
                }
                return true
            },
        })
    }

    // Interactive tool version prompt if not provided via flag
    if (!toolVer) {
        toolVer = await input({
            message: 'Tool version (required):',
            validate: (value) => {
                if (value.length === 0) {
                    return 'Tool version is required'
                }
                // Accept semver-like formats: x.y.z, x.y, or plain version strings
                const validVersionPattern = /^[a-zA-Z0-9][a-zA-Z0-9.\-_]*$/
                if (!validVersionPattern.test(value)) {
                    return 'Version must contain only alphanumeric characters, dots, hyphens, or underscores'
                }
                return true
            },
        })
    }
  
  // Validate profile
    const validProfiles = ['model-a-rest', 'model-a-graphql', 'model-b-rest', 'model-b-graphql']
  if (!validProfiles.includes(profile)) {
        console.error(chalk.red(`✗ Error: Invalid profile "${profile}"`))
        console.error(chalk.yellow(`  Valid profiles: ${validProfiles.join(', ')}`))
        process.exit(1)
    }

    // Load profile configuration with error handling
    const profilePath = path.join(__dirname, '..', 'profiles', `${profile}.profile`)
    
    try {
        // Verify profile file exists before attempting to read
        if (!(await fs.pathExists(profilePath))) {
            console.error(chalk.red(`✗ Error: Profile file not found: ${profile}.profile`))
            console.error(chalk.yellow(`  Expected location: ${profilePath}`))
            console.error(chalk.yellow(`  Available profiles: ${validProfiles.join(', ')}`))
            process.exit(1)
        }

        const profileContent = await fs.readFile(profilePath, 'utf8')
        var profileConfig = parseProfile(profileContent)
        
        // Validate required profile config fields
        if (!profileConfig.model || !profileConfig.api_type) {
            console.error(chalk.red(`✗ Error: Invalid profile configuration in ${profile}.profile`))
            console.error(chalk.yellow('  Profile must specify both "model" and "api_type"'))
            process.exit(1)
        }
    } catch (error) {
        console.error(chalk.red(`✗ Error reading profile file: ${profile}.profile`))
        console.error(chalk.red(`  ${error.message}`))
        process.exit(1)
    }

    // Read spec version from SPEC_VERSION file
    const specVersionPath = path.join(__dirname, '..', 'SPEC_VERSION')
    let finalSpecVer
    try {
        if (await fs.pathExists(specVersionPath)) {
            finalSpecVer = (await fs.readFile(specVersionPath, 'utf8')).trim()
        } else {
            console.log(chalk.yellow('⚠ Warning: SPEC_VERSION file not found, using default version 1.0.0'))
            finalSpecVer = '1.0.0' // fallback
        }
    } catch (error) {
        console.log(chalk.yellow('⚠ Warning: Could not read SPEC_VERSION file, using default version 1.0.0'))
        finalSpecVer = '1.0.0'
    }
    
    // Display spec version
    console.log('')
    console.log(chalk.gray(`Using spec version: ${finalSpecVer}`))
  
  // Generate run folder path
    const timestamp = new Date()
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}Z$/, '')
        .replace('T', 'T')
        .slice(0, 15)
    const cwd = process.cwd()

    const finalRunDir = runDir || path.join(cwd, `pawmate-run-${timestamp}`)
  
    // Create run folder structure with error handling
    try {
        await fs.ensureDir(path.join(finalRunDir, 'PawMate'))
        await fs.ensureDir(path.join(finalRunDir, 'benchmark'))
        await fs.ensureDir(path.join(finalRunDir, 'docs'))
    } catch (error) {
        console.error(chalk.red('✗ Error: Could not create run directory structure'))
        console.error(chalk.red(`  ${error.message}`))
        console.error(chalk.yellow(`  Check permissions for: ${finalRunDir}`))
        process.exit(1)
    }

    const workspacePath = path.join(finalRunDir, 'PawMate')

    // Copy bundled docs to run directory with error handling
    const bundledDocsPath = path.join(__dirname, '..', 'docs')
    const runDocsPath = path.join(finalRunDir, 'docs')
    try {
  if (await fs.pathExists(bundledDocsPath)) {
            await fs.copy(bundledDocsPath, runDocsPath, { overwrite: true })
        } else {
            console.log(chalk.yellow('⚠ Warning: Bundled docs directory not found, skipping docs copy'))
        }
    } catch (error) {
        console.log(chalk.yellow('⚠ Warning: Could not copy bundled docs'))
        console.log(chalk.yellow(`  ${error.message}`))
  }
  
  // Generate run ID
    const toolSlug = tool.replace(/\s+/g, '-')
    const runId = `${toolSlug}-Model${profileConfig.model}-${timestamp}`
  
  // Determine run number (default to 1)
    const runNumber = 1
  
  // Build tool display string
    const toolDisplay = toolVer ? `${tool} ${toolVer}` : tool
  
    // Render API start prompt with error handling
    const apiTemplatePath = path.join(__dirname, '..', 'templates', 'api_start_prompt_template.md')
    let apiRendered
    
    try {
        if (!(await fs.pathExists(apiTemplatePath))) {
            console.error(chalk.red('✗ Error: API start prompt template not found'))
            console.error(chalk.yellow(`  Expected location: ${apiTemplatePath}`))
            process.exit(1)
        }

        apiRendered = await fs.readFile(apiTemplatePath, 'utf8')
    } catch (error) {
        console.error(chalk.red('✗ Error: Could not read API start prompt template'))
        console.error(chalk.red(`  ${error.message}`))
        process.exit(1)
    }
  
  // Fill header fields
    apiRendered = apiRendered.replace('[Tool name + version/build id]', toolDisplay)
    apiRendered = apiRendered.replace('[e.g., ToolX-ModelA-Run1]', runId)
    apiRendered = apiRendered.replace('[commit/tag/hash or immutable archive id]', finalSpecVer)
    apiRendered = apiRendered.replace(/\[repo-root-path\]/g, finalRunDir)
    apiRendered = apiRendered.replace(/\[workspace-path\]/g, workspacePath)
  
  // Replace {Spec Root} placeholders - point to run directory (docs are in run-dir/docs/)
    apiRendered = apiRendered.replace(/\{Spec Root\}/g, finalRunDir)
  
  // Replace {Workspace Path} placeholders
    apiRendered = apiRendered.replace(/\{Workspace Path\}/g, workspacePath)
  
  // Check model checkbox
  if (profileConfig.model === 'A') {
        apiRendered = apiRendered.replace('  - [ ] **Model A (Minimum)**', '  - [x] **Model A (Minimum)**')
  } else if (profileConfig.model === 'B') {
        apiRendered = apiRendered.replace('  - [ ] **Model B (Full)**', '  - [x] **Model B (Full)**')
  }
  
  // Check API style checkbox
  if (profileConfig.api_type === 'REST') {
    apiRendered = apiRendered.replace(
      '  - [ ] **REST** (produce an OpenAPI contract artifact)',
      '  - [x] **REST** (produce an OpenAPI contract artifact)'
        )
  } else if (profileConfig.api_type === 'GraphQL') {
    apiRendered = apiRendered.replace(
      '  - [ ] **GraphQL** (produce a GraphQL schema contract artifact)',
      '  - [x] **GraphQL** (produce a GraphQL schema contract artifact)'
        )
  }
  
    // Save API start prompt with error handling
    const apiPromptFile = path.join(finalRunDir, 'start_build_api_prompt.txt')
    try {
        await fs.writeFile(apiPromptFile, apiRendered, 'utf8')
    } catch (error) {
        console.error(chalk.red('✗ Error: Could not write API start prompt file'))
        console.error(chalk.red(`  ${error.message}`))
        process.exit(1)
    }
  
    // Render UI start prompt with error handling
    const uiTemplatePath = path.join(__dirname, '..', 'templates', 'ui_start_prompt_template.md')
    let uiPromptFile = ''

    try {
  if (await fs.pathExists(uiTemplatePath)) {
            let uiRendered = await fs.readFile(uiTemplatePath, 'utf8')
    
    // Fill header fields
        uiRendered = uiRendered.replace('[Tool name + version/build id]', toolDisplay)
        uiRendered = uiRendered.replace('[e.g., ToolX-ModelA-Run1-UI]', `${runId}-UI`)
        uiRendered = uiRendered.replace('[commit/tag/hash or immutable archive id]', finalSpecVer)
        uiRendered = uiRendered.replace(/\[repo-root-path\]/g, finalRunDir)
        uiRendered = uiRendered.replace(/\[workspace-path\]/g, workspacePath)
    
    // Replace {Spec Root} placeholders
        uiRendered = uiRendered.replace(/\{Spec Root\}/g, finalRunDir)
    
    // Replace {Workspace Path} placeholders
        uiRendered = uiRendered.replace(/\{Workspace Path\}/g, workspacePath)
    
    // Check model checkbox
    if (profileConfig.model === 'A') {
            uiRendered = uiRendered.replace('  - [ ] **Model A (Minimum)**', '  - [x] **Model A (Minimum)**')
    } else if (profileConfig.model === 'B') {
            uiRendered = uiRendered.replace('  - [ ] **Model B (Full)**', '  - [x] **Model B (Full)**')
    }
    
    // Check API style checkbox
    if (profileConfig.api_type === 'REST') {
            uiRendered = uiRendered.replace('  - [ ] **REST**', '  - [x] **REST**')
    } else if (profileConfig.api_type === 'GraphQL') {
            uiRendered = uiRendered.replace('  - [ ] **GraphQL**', '  - [x] **GraphQL**')
    }
    
    // Save UI start prompt
            uiPromptFile = path.join(finalRunDir, 'start_build_ui_prompt.txt')
            await fs.writeFile(uiPromptFile, uiRendered, 'utf8')
        }
    } catch (error) {
        console.log(chalk.yellow('⚠ Warning: Could not process UI start prompt template'))
        console.log(chalk.yellow(`  ${error.message}`))
        uiPromptFile = '' // Reset to empty if there was an error
  }
  
    // Write run.config with error handling
  const runConfig = `# run.config — Benchmark Run Configuration
# Generated: ${new Date().toISOString()}

spec_version=${finalSpecVer}
spec_root=${path.join(finalRunDir, 'docs')}
tool=${tool}
tool_ver=${toolVer}
model=${profileConfig.model}
api_type=${profileConfig.api_type}
workspace=${workspacePath}
`

    try {
        await fs.writeFile(path.join(finalRunDir, 'run.config'), runConfig, 'utf8')
    } catch (error) {
        console.error(chalk.red('✗ Error: Could not write run.config file'))
        console.error(chalk.red(`  ${error.message}`))
        process.exit(1)
    }
  
  // Generate result submission instructions
    const toolSlugForFilename = tool
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '')
    const resultFilename = `${toolSlugForFilename}_model${profileConfig.model}_${profileConfig.api_type}_run${runNumber}_${timestamp}.json`
  
  const submissionInstructions = generateSubmissionInstructions(
    finalRunDir,
    workspacePath,
    tool,
    toolVer,
    profileConfig.model,
    profileConfig.api_type,
    finalSpecVer,
    resultFilename
    )
  
    try {
  await fs.writeFile(
    path.join(finalRunDir, 'benchmark', 'result_submission_instructions.md'),
    submissionInstructions,
    'utf8'
        )
    } catch (error) {
        console.log(chalk.yellow('⚠ Warning: Could not write result submission instructions'))
        console.log(chalk.yellow(`  ${error.message}`))
    }
  
    // Output summary
    console.log('')
    console.log(chalk.cyan('━'.repeat(60)))
    console.log(chalk.green('✓ Run initialized!'))
    console.log(chalk.cyan('━'.repeat(60)))
    console.log('')
    console.log(`  Run folder:    ${chalk.bold(finalRunDir)}`)
    console.log(`  Workspace:     ${chalk.bold(workspacePath)}`)
    console.log(`  Spec version:  ${chalk.bold(finalSpecVer)}`)
    console.log('')
    console.log('  Generated prompts:')
    console.log(`    API: ${chalk.yellow(apiPromptFile)}`)
  if (uiPromptFile) {
        console.log(`    UI:  ${chalk.yellow(uiPromptFile)}`)
    }
    console.log('')
    console.log(chalk.cyan('━'.repeat(60)))
    console.log(chalk.bold('NEXT STEPS:'))
    console.log('')
    console.log('  1. Open a new AI agent/chat session')
    console.log('  2. Copy the contents of the API start prompt:')
    console.log(chalk.yellow(`     ${apiPromptFile}`))
    console.log('  3. Paste it as the first message to build the API/backend')
    console.log('')
  if (uiPromptFile) {
        console.log('  4. After API is complete, start a new session (or continue)')
        console.log('  5. Copy the contents of the UI start prompt:')
        console.log(chalk.yellow(`     ${uiPromptFile}`))
        console.log('  6. Paste it to build the UI (assumes API already exists)')
        console.log('')
    }
    console.log(chalk.cyan('━'.repeat(60)))
    console.log('')
}

/**
 * Parse profile file content
 * @param {string} content - Profile file content
 * @returns {Object} Parsed profile config
 */
function parseProfile(content) {
    const config = {}
    const lines = content.split('\n')
  
  for (const line of lines) {
        const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
            const [key, value] = trimmed.split('=').map((s) => s.trim())
      if (key && value) {
                config[key] = value
      }
    }
  }
  
    return config
}

/**
 * Generate result submission instructions
 */
function generateSubmissionInstructions(runDir, workspacePath, tool, toolVer, model, apiType, specVer, resultFilename) {
  return `# Result Submission Instructions

## Overview
After completing your benchmark run (API and optionally UI), you need to submit your results using the PawMate CLI.

## Submission via Email (Default)

### Step 1: Complete the Run
Ensure the AI agent has:
- Generated all code files
- Built the application successfully
- Loaded seed data
- Started the application
- Run all tests (ideally all passing)
- Generated benchmark artifacts (AI run report, acceptance checklist, etc.)

### Step 2: Generate Result File (if needed)
If the AI agent didn't generate a result file automatically, you can create one manually following the result file specification in the PawMate AI Challenge documentation.

Expected filename: \`${resultFilename}\`

Place it in: \`${runDir}/benchmark/\`

### Step 3: Submit via PawMate CLI

\`\`\`bash
pawmate submit ${runDir}/benchmark/${resultFilename}
\`\`\`

This will:
- Validate your result file
- Prompt for optional attribution (name/GitHub username)
- Open your email client with pre-filled content
- Include JSON result data in email body (no attachment needed)

**IMPORTANT**: The CLI opens your email client but does NOT send the email automatically. You must:
1. Review the pre-filled email in your email client
2. Click "Send" to submit the result

**Email will be sent to**: \`pawmate.ai.challenge@gmail.com\`

## Alternative: GitHub Issue Submission (Optional)

If you have a GitHub personal access token:

\`\`\`bash
export GITHUB_TOKEN=your-token-here
pawmate submit ${runDir}/benchmark/${resultFilename}
\`\`\`

This will create a GitHub issue in addition to opening the email client.

**How to create a GitHub token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name (e.g., "PawMate Result Submission")
4. Select the "repo" scope
5. Click "Generate token" and copy it

## Run Information

- **Run Directory**: \`${runDir}\`
- **Workspace**: \`${workspacePath}\`
- **Tool**: ${tool}${toolVer ? ' ' + toolVer : ''}
- **Model**: ${model}
- **API Style**: ${apiType}
- **Spec Version**: ${specVer}

## Resources

- **PawMate CLI Documentation**: https://github.com/fastcraft-ai/pawmate-ai-challenge/tree/main/cli
- **Challenge Documentation**: https://github.com/fastcraft-ai/pawmate-ai-challenge
- **Result File Specification**: See challenge documentation

## Key Metrics to Include

Your result file should contain:
- **Timing Metrics**: All timestamps in ISO-8601 UTC format
  - \`generation_started\`
  - \`code_complete\`
  - \`build_clean\`
  - \`seed_loaded\`
  - \`app_started\`
  - \`all_tests_pass\`
- **Build Status**: Boolean flags for success/failure
- **LLM Usage**: Model used, tokens consumed, request count
- **Intervention Metrics**: Clarifications, interventions, reruns

See the AI run report generated in \`${runDir}/benchmark/ai_run_report.md\` for these metrics.
`
}
