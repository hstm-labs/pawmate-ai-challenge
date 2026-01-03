#!/usr/bin/env node

// Bundle templates script - copies templates and profiles from parent directory
// This runs during npm prepare (before publish)

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cliRoot = path.join(__dirname, '..');
const parentRoot = path.join(cliRoot, '..');

async function bundleTemplates() {
  console.log('📦 Bundling templates and profiles...');
  
  try {
    // Create destination directories
    const templatesDir = path.join(cliRoot, 'src', 'templates');
    const profilesDir = path.join(cliRoot, 'src', 'profiles');
    
    await fs.ensureDir(templatesDir);
    await fs.ensureDir(profilesDir);
    
    // Copy prompts
    const promptsSource = path.join(parentRoot, 'prompts');
    if (await fs.pathExists(promptsSource)) {
      await fs.copy(promptsSource, templatesDir, { overwrite: true });
      console.log('✓ Copied prompts to src/templates/');
    } else {
      console.warn('⚠ Prompts directory not found at', promptsSource);
    }
    
    // Copy profiles
    const profilesSource = path.join(parentRoot, 'profiles');
    if (await fs.pathExists(profilesSource)) {
      await fs.copy(profilesSource, profilesDir, { overwrite: true });
      console.log('✓ Copied profiles to src/profiles/');
    } else {
      console.warn('⚠ Profiles directory not found at', profilesSource);
    }
    
    // Copy SPEC_VERSION
    const specVersionSource = path.join(parentRoot, 'SPEC_VERSION');
    const specVersionDest = path.join(cliRoot, 'src', 'SPEC_VERSION');
    if (await fs.pathExists(specVersionSource)) {
      await fs.copy(specVersionSource, specVersionDest, { overwrite: true });
      console.log('✓ Copied SPEC_VERSION to src/');
    } else {
      console.warn('⚠ SPEC_VERSION file not found at', specVersionSource);
    }
    
    console.log('✅ Template bundling complete!');
  } catch (error) {
    console.error('❌ Error bundling templates:', error.message);
    process.exit(1);
  }
}

bundleTemplates();

