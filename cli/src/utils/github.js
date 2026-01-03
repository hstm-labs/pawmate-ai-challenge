import chalk from 'chalk';
import { extractField } from './validation.js';

const GITHUB_API_URL = 'https://api.github.com/repos/rsdickerson/pawmate-ai-results/issues';

/**
 * Generate GitHub issue title from result data
 * @param {Object} data - Result JSON data
 * @returns {string} Issue title
 */
export function generateIssueTitle(data) {
  const toolName = extractField(data, 'result_data.run_identity.tool_name') || 'Unknown Tool';
  const targetModel = extractField(data, 'result_data.run_identity.target_model') || 'Unknown';
  const apiStyle = extractField(data, 'result_data.run_identity.api_style') || 'Unknown';
  const runNumber = extractField(data, 'result_data.run_identity.run_number') || '1';
  
  return `[Submission] Tool: ${toolName}, Model: ${targetModel}, API: ${apiStyle}, Run: ${runNumber}`;
}

/**
 * Generate GitHub issue body from result data
 * @param {Object} data - Result JSON data
 * @param {string} attribution - Optional attribution
 * @param {string} jsonContent - Raw JSON content
 * @returns {string} Issue body in markdown
 */
export function generateIssueBody(data, attribution, jsonContent) {
  const submittedBy = attribution || 'Anonymous';
  
  return `## PawMate AI Challenge Result Submission

Submitted by: ${submittedBy}

### Result JSON

\`\`\`json
${jsonContent}
\`\`\`

---

Generated using: https://github.com/rsdickerson/pawmate-ai-challenge
`;
}

/**
 * Create GitHub issue with result data
 * @param {string} resultFilePath - Path to result JSON file
 * @param {Object} data - Parsed result data
 * @param {string} attribution - Optional attribution
 * @param {string} token - GitHub personal access token
 * @returns {Promise<Object>} Issue creation result
 */
export async function createGitHubIssue(resultFilePath, data, attribution, token) {
  const fs = await import('fs-extra');
  const jsonContent = await fs.default.readFile(resultFilePath, 'utf8');
  
  const title = generateIssueTitle(data);
  const body = generateIssueBody(data, attribution, jsonContent);
  
  const payload = {
    title,
    body,
    labels: ['submission', 'results']
  };
  
  console.log(chalk.blue('ℹ'), 'Creating GitHub issue...');
  console.log('');
  
  try {
    const response = await fetch(GITHUB_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'pawmate-ai-challenge-cli'
      },
      body: JSON.stringify(payload)
    });
    
    const responseData = await response.json();
    
    if (response.status === 201) {
      const issueUrl = responseData.html_url;
      const issueNumber = responseData.number;
      
      console.log(chalk.green('✓'), 'GitHub issue created successfully!');
      console.log('');
      console.log(chalk.blue('ℹ'), `Issue #${issueNumber}:`, chalk.cyan(issueUrl));
      console.log('');
      
      return {
        success: true,
        issueUrl,
        issueNumber
      };
    } else {
      // Handle error responses
      const errorMessage = responseData.message || 'Unknown error';
      const errorDetails = responseData.errors 
        ? responseData.errors.map(e => e.message).join('; ')
        : '';
      
      console.log(chalk.red('✗'), `GitHub API request failed (HTTP ${response.status})`);
      console.log(chalk.red('  Error:'), errorMessage);
      
      if (errorDetails) {
        console.log(chalk.red('  Details:'), errorDetails);
      }
      
      // Provide specific guidance based on error
      if (response.status === 401 || response.status === 403) {
        console.log('');
        console.log(chalk.yellow('⚠'), 'Authentication failed. Please check your GitHub token.');
        console.log(chalk.blue('ℹ'), 'Set GITHUB_TOKEN environment variable or use --github-token flag');
        console.log(chalk.blue('ℹ'), 'Create a token at: https://github.com/settings/tokens');
      } else if (response.status === 404) {
        console.log('');
        console.log(chalk.yellow('⚠'), 'Repository not found: rsdickerson/pawmate-ai-results');
        console.log(chalk.blue('ℹ'), 'Please verify the repository exists and is accessible');
      } else if (response.status === 422) {
        console.log('');
        console.log(chalk.yellow('⚠'), 'Validation error. The issue data may be invalid.');
      }
      
      console.log('');
      
      return {
        success: false,
        error: errorMessage
      };
    }
  } catch (error) {
    console.log(chalk.red('✗'), 'Network error:', error.message);
    console.log('');
    console.log(chalk.yellow('⚠'), 'Could not connect to GitHub API');
    console.log(chalk.blue('ℹ'), 'Please check your internet connection and try again');
    console.log('');
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Display instructions for creating a GitHub token
 */
export function displayTokenInstructions() {
  console.log('');
  console.log(chalk.yellow('⚠'), chalk.bold('GitHub Token Required for Issue Creation'));
  console.log('');
  console.log('This CLI can create a GitHub issue with your results, but requires a GitHub');
  console.log('personal access token for authentication.');
  console.log('');
  console.log(chalk.bold('How to create a GitHub personal access token:'));
  console.log('');
  console.log('  1. Go to: https://github.com/settings/tokens');
  console.log('  2. Click "Generate new token" → "Generate new token (classic)"');
  console.log('  3. Give it a name (e.g., "PawMate Result Submission")');
  console.log('  4. Select the "repo" scope (required for creating issues)');
  console.log('  5. Click "Generate token" and copy it');
  console.log('');
  console.log(chalk.bold('How to use your token:'));
  console.log('');
  console.log('  Method 1: Environment variable');
  console.log(chalk.gray('    export GITHUB_TOKEN=your-token-here'));
  console.log(chalk.gray('    pawmate submit result.json'));
  console.log('');
  console.log('  Method 2: Command flag');
  console.log(chalk.gray('    pawmate submit result.json --github-token your-token-here'));
  console.log('');
  console.log(chalk.blue('ℹ'), 'If you skip GitHub submission, the email client will still open.');
  console.log('');
}

