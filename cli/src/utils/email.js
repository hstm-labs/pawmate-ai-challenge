import open from 'open';
import chalk from 'chalk';
import { extractField } from './validation.js';

const EMAIL_TO = 'pawmate.ai.challenge@gmail.com';

/**
 * Generate email subject from result data
 * @param {Object} data - Result JSON data
 * @returns {string} Email subject
 */
export function generateEmailSubject(data) {
  const toolName = extractField(data, 'result_data.run_identity.tool_name') || 'Unknown Tool';
  const targetModel = extractField(data, 'result_data.run_identity.target_model') || 'Unknown';
  const apiStyle = extractField(data, 'result_data.run_identity.api_style') || 'Unknown';
  const runNumber = extractField(data, 'result_data.run_identity.run_number') || '1';
  
  return `[Submission] Tool: ${toolName}, Model: ${targetModel}, API: ${apiStyle}, Run: ${runNumber}`;
}

/**
 * Generate email body from result data
 * @param {Object} data - Result JSON data
 * @param {string} attribution - Optional attribution (name/username)
 * @param {string} jsonContent - Raw JSON content as string
 * @returns {string} Email body
 */
export function generateEmailBody(data, attribution, jsonContent) {
  const submittedBy = attribution || 'Anonymous';
  
  return `## PawMate AI Challenge Result Submission

Submitted by: ${submittedBy}

### Result JSON

\`\`\`json
${jsonContent}
\`\`\`

---

Generated using: https://github.com/rsdickerson/pawmate-ai-challenge
Submitted via: PawMate CLI
`;
}

/**
 * Open email client with pre-filled content
 * @param {string} resultFilePath - Path to result JSON file
 * @param {Object} data - Parsed result data
 * @param {string} attribution - Optional attribution
 * @returns {Promise<boolean>} True if email client opened successfully
 */
export async function openEmailClient(resultFilePath, data, attribution) {
  const fs = await import('fs-extra');
  const jsonContent = await fs.default.readFile(resultFilePath, 'utf8');
  
  const subject = generateEmailSubject(data);
  const body = generateEmailBody(data, attribution, jsonContent);
  
  // Encode for mailto URL
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  
  // Create mailto URL
  const mailtoUrl = `mailto:${EMAIL_TO}?subject=${encodedSubject}&body=${encodedBody}`;
  
  console.log(chalk.blue('ℹ'), 'Opening email client...');
  console.log('');
  console.log(chalk.bold('Email Details:'));
  console.log(chalk.gray('  To:'), EMAIL_TO);
  console.log(chalk.gray('  Subject:'), subject);
  console.log('');
  
  try {
    await open(mailtoUrl);
    console.log(chalk.green('✓'), 'Email client opened successfully');
    console.log('');
    console.log(chalk.yellow('⚠'), chalk.bold('IMPORTANT:'));
    console.log(chalk.yellow('  1. Review the pre-filled email in your email client'));
    console.log(chalk.yellow('  2. Click "Send" to submit your result'));
    console.log(chalk.yellow('  3. The JSON result data is included in the email body'));
    console.log('');
    return true;
  } catch (error) {
    console.log(chalk.red('✗'), 'Failed to open email client:', error.message);
    console.log('');
    console.log(chalk.yellow('Fallback: Manual Email Submission'));
    console.log('');
    console.log(chalk.bold('Copy the following information to manually create an email:'));
    console.log('');
    console.log(chalk.gray('To:'), EMAIL_TO);
    console.log(chalk.gray('Subject:'), subject);
    console.log('');
    console.log(chalk.gray('Body:'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(body);
    console.log(chalk.gray('─'.repeat(60)));
    console.log('');
    return false;
  }
}

/**
 * Prompt user for attribution
 * @returns {Promise<string>} Attribution or empty string
 */
export async function promptAttribution() {
  const readline = await import('readline');
  
  return new Promise((resolve) => {
    const rl = readline.default.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    console.log('');
    console.log(chalk.blue('ℹ'), chalk.bold('Attribution (optional)'));
    console.log('You can provide your name or GitHub username to be credited for this submission.');
    console.log('Press Enter to submit anonymously.');
    console.log('');
    
    rl.question('Your name or GitHub username: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

