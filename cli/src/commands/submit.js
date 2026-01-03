import path from 'path';
import chalk from 'chalk';
import { validateResultFile, validateGitHubToken } from '../utils/validation.js';
import { promptAttribution, openEmailClient } from '../utils/email.js';
import { createGitHubIssue, displayTokenInstructions } from '../utils/github.js';

/**
 * Submit benchmark results
 * @param {string} resultFile - Path to result JSON file
 * @param {Object} options - Command options
 * @param {string} [options.githubToken] - GitHub token for issue creation
 * @param {boolean} [options.emailOnly] - Skip GitHub submission
 */
export default async function submit(resultFile, options = {}) {
  console.log('');
  console.log(chalk.cyan('━'.repeat(60)));
  console.log(chalk.bold('  PawMate AI Challenge - Result Submission'));
  console.log(chalk.cyan('━'.repeat(60)));
  console.log('');
  
  // Convert to absolute path if relative
  const absolutePath = path.isAbsolute(resultFile) 
    ? resultFile 
    : path.join(process.cwd(), resultFile);
  
  console.log(chalk.blue('ℹ'), 'Result file:', chalk.gray(absolutePath));
  console.log('');
  
  // Validate result file
  const validation = await validateResultFile(absolutePath);
  
  if (!validation.valid) {
    console.log(chalk.red('✗'), chalk.bold('Validation failed'));
    console.log('');
    console.log('Please fix the errors and try again.');
    console.log('');
    throw new Error('Result file validation failed');
  }
  
  // Handle warnings
  if (validation.warnings.length > 0) {
    console.log(chalk.yellow('⚠'), 'Validation passed with warnings:');
    validation.warnings.forEach(w => console.log(chalk.yellow('  •'), w));
    console.log('');
    
    // Ask user to confirm
    const readline = await import('readline');
    const rl = readline.default.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const continueSubmission = await new Promise((resolve) => {
      rl.question('Continue with submission? (y/N): ', (answer) => {
        rl.close();
        resolve(answer.trim().toLowerCase() === 'y');
      });
    });
    
    if (!continueSubmission) {
      console.log('');
      console.log('Submission cancelled.');
      console.log('');
      return;
    }
    
    console.log('');
  }
  
  // Prompt for attribution
  const attribution = await promptAttribution();
  
  console.log('');
  console.log(chalk.cyan('─'.repeat(60)));
  console.log('');
  
  // Determine if GitHub submission should be attempted
  let githubToken = options.githubToken || process.env.GITHUB_TOKEN;
  const shouldSubmitToGitHub = !options.emailOnly && githubToken;
  
  // GitHub submission (if token available)
  let githubResult = null;
  if (shouldSubmitToGitHub) {
    // Validate token
    if (!validateGitHubToken(githubToken)) {
      console.log(chalk.yellow('⚠'), 'Invalid GitHub token format');
      console.log(chalk.blue('ℹ'), 'Skipping GitHub issue creation');
      console.log('');
    } else {
      // Attempt GitHub issue creation
      try {
        githubResult = await createGitHubIssue(
          absolutePath,
          validation.data,
          attribution,
          githubToken
        );
      } catch (error) {
        console.log(chalk.red('✗'), 'GitHub submission failed:', error.message);
        console.log('');
      }
    }
  } else if (!options.emailOnly && !githubToken) {
    // No token provided, display instructions
    console.log(chalk.blue('ℹ'), 'GitHub token not provided - skipping issue creation');
    console.log(chalk.gray('  (Email submission will still proceed)'));
    console.log('');
    console.log(chalk.gray('  To enable GitHub issue creation in the future:'));
    console.log(chalk.gray('    export GITHUB_TOKEN=your-token-here'));
    console.log(chalk.gray('  or use: --github-token flag'));
    console.log('');
  }
  
  // Email submission (always attempted)
  console.log(chalk.cyan('─'.repeat(60)));
  console.log('');
  
  const emailResult = await openEmailClient(
    absolutePath,
    validation.data,
    attribution
  );
  
  // Summary
  console.log(chalk.cyan('─'.repeat(60)));
  console.log('');
  console.log(chalk.bold('Submission Summary:'));
  console.log('');
  
  if (githubResult && githubResult.success) {
    console.log(chalk.green('✓'), 'GitHub Issue:', chalk.cyan(githubResult.issueUrl));
  } else if (shouldSubmitToGitHub) {
    console.log(chalk.yellow('⚠'), 'GitHub Issue:', chalk.gray('Failed or skipped'));
  }
  
  if (emailResult) {
    console.log(chalk.green('✓'), 'Email Client:', chalk.gray('Opened successfully'));
    console.log('');
    console.log(chalk.yellow('⚠'), chalk.bold('Remember to send the email!'));
  } else {
    console.log(chalk.yellow('⚠'), 'Email Client:', chalk.gray('Failed to open'));
    console.log('');
    console.log(chalk.blue('ℹ'), 'Please manually email your results to:');
    console.log(chalk.cyan('    pawmate.ai.challenge@gmail.com'));
  }
  
  console.log('');
  console.log(chalk.cyan('━'.repeat(60)));
  console.log('');
  console.log(chalk.green('✓'), chalk.bold('Thank you for submitting your benchmark results!'));
  console.log('');
  console.log(chalk.gray('Results will be reviewed and published at:'));
  console.log(chalk.cyan('https://github.com/rsdickerson/pawmate-ai-results'));
  console.log('');
}

