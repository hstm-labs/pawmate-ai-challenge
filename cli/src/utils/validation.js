import fs from 'fs-extra';
import chalk from 'chalk';

/**
 * Validate JSON file format
 * @param {string} filePath - Path to JSON file
 * @returns {Promise<Object>} Parsed JSON data
 * @throws {Error} If JSON is invalid
 */
export async function validateJson(filePath) {
  if (!await fs.pathExists(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  const content = await fs.readFile(filePath, 'utf8');
  
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid JSON format: ${error.message}`);
  }
}

/**
 * Validate filename convention
 * Expected pattern: {tool-slug}_{model}_{api-type}_{run-number}_{timestamp}.json
 * @param {string} filename - Filename to validate
 * @returns {boolean} True if valid
 */
export function validateFilename(filename) {
  const pattern = /^[a-z0-9-]+_model[AB]_(REST|GraphQL)_run[12]_[0-9]{8}T[0-9]{4}\.json$/;
  return pattern.test(filename);
}

/**
 * Extract field from JSON data using path notation
 * @param {Object} data - JSON data
 * @param {string} path - Path to field (e.g., 'result_data.run_identity.tool_name')
 * @returns {any} Field value or null if not found
 */
export function extractField(data, path) {
  const parts = path.split('.');
  let current = data;
  
  for (const part of parts) {
    if (current === null || current === undefined) {
      return null;
    }
    current = current[part];
  }
  
  return current;
}

/**
 * Validate result file structure and required fields
 * @param {string} filePath - Path to result file
 * @returns {Promise<Object>} Validation result with status and data
 */
export async function validateResultFile(filePath) {
  const filename = filePath.split('/').pop();
  const errors = [];
  const warnings = [];
  
  console.log(chalk.blue('ℹ'), 'Validating result file...');
  console.log('');
  
  // Check JSON format
  console.log(chalk.blue('ℹ'), 'Checking JSON format...');
  let data;
  try {
    data = await validateJson(filePath);
    console.log(chalk.green('✓'), 'Valid JSON format');
  } catch (error) {
    errors.push(error.message);
    console.log(chalk.red('✗'), 'Invalid JSON format');
    return { valid: false, errors, warnings, data: null };
  }
  
  // Check filename convention
  console.log(chalk.blue('ℹ'), 'Checking filename convention...');
  if (!validateFilename(filename)) {
    warnings.push('Filename does not match expected pattern');
    warnings.push('Expected: {tool-slug}_{model}_{api-type}_{run-number}_{timestamp}.json');
    warnings.push('Example: cursor-v0-43_modelA_REST_run1_20241218T1430.json');
    console.log(chalk.yellow('⚠'), 'Filename does not match convention');
  } else {
    console.log(chalk.green('✓'), 'Filename follows convention');
  }
  
  // Check required fields
  console.log(chalk.blue('ℹ'), 'Checking required fields...');
  const requiredFields = [
    'schema_version',
    'result_data.run_identity.tool_name',
    'result_data.run_identity.target_model',
    'result_data.run_identity.api_style'
  ];
  
  const missingFields = [];
  for (const field of requiredFields) {
    const value = extractField(data, field);
    if (value === null || value === undefined) {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
    console.log(chalk.red('✗'), 'Missing required fields');
  } else {
    console.log(chalk.green('✓'), 'Required fields present');
  }
  
  console.log('');
  
  if (errors.length > 0) {
    console.log(chalk.red('✗'), 'Validation failed');
    console.log('');
    errors.forEach(err => console.log(chalk.red('  •'), err));
    return { valid: false, errors, warnings, data };
  }
  
  if (warnings.length > 0) {
    console.log(chalk.yellow('⚠'), 'Validation passed with warnings');
    console.log('');
    warnings.forEach(warn => console.log(chalk.yellow('  •'), warn));
  } else {
    console.log(chalk.green('✓'), 'Validation complete');
  }
  
  console.log('');
  
  return { valid: true, errors: [], warnings, data };
}

/**
 * Validate GitHub token format
 * @param {string} token - GitHub token
 * @returns {boolean} True if token format is valid
 */
export function validateGitHubToken(token) {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // GitHub tokens should be at least 20 characters
  // Classic tokens: 40 chars (ghp_...)
  // Fine-grained tokens: variable length (github_pat_...)
  if (token.length < 20) {
    return false;
  }
  
  return true;
}

