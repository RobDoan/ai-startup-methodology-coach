#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import ora from 'ora';
import { execa } from 'execa';
import { log, colors, icons } from '../utils/colors.js';
import { gitHelpers, githubHelpers } from '../utils/git.js';

async function checkProjectRoot() {
  try {
    await fs.access('README.md');
    await fs.access('services');
    return true;
  } catch {
    return false;
  }
}

// Get list of subfolders in ./services/
async function getServiceFolders() {
  try {
    const items = await fs.readdir('services', { withFileTypes: true });
    return items
      .filter(item => item.isDirectory())
      .map(item => item.name);
  } catch {
    return [];
  }
}

// Check if folder is empty
async function isFolderEmpty(folderPath) {
  try {
    const files = await fs.readdir(folderPath);
    return files.length === 0;
  } catch {
    return true; // If can't read, assume empty or doesn't exist
  }
}

// Check if folder has .git directory
async function hasGitRepo(folderPath) {
  try {
    await fs.access(path.join(folderPath, '.git'));
    return true;
  } catch {
    return false;
  }
}

// Get remote URL from a git repository
async function getRemoteUrl(folderPath) {
  try {
    const { stdout } = await execa('git', ['remote', 'get-url', 'origin'], { cwd: folderPath });
    return stdout.trim();
  } catch {
    return null;
  }
}

// Generate repository name from folder name (remove '-service' suffix)
function generateRepoName(folderName) {
  return folderName.endsWith('-service') 
    ? folderName.slice(0, -8) // Remove '-service'
    : folderName;
}

// Create GitHub repository using gh CLI
async function createGitHubRepo(repoName) {
  const spinner = ora(`Creating GitHub repository: ${repoName}`).start();
  
  try {
    // Check if repository already exists
    try {
      await execa('gh', ['repo', 'view', repoName], { stdio: 'pipe' });
      spinner.warn(`Repository ${repoName} already exists`);
      
      // Suggest new name
      const timestamp = Date.now();
      const newRepoName = `${repoName}-${timestamp}`;
      spinner.text = `Trying new name: ${newRepoName}`;
      
      await execa('gh', ['repo', 'create', newRepoName, '--private']);
      
      // Get the repository URL
      const { stdout: username } = await execa('gh', ['api', 'user', '--jq', '.login']);
      const repoUrl = `git@github.com:${username.trim()}/${newRepoName}.git`;
      
      spinner.succeed(`Created repository: ${newRepoName}`);
      return { name: newRepoName, url: repoUrl };
    } catch {
      // Repository doesn't exist, create it
      await execa('gh', ['repo', 'create', repoName, '--private']);
      
      // Get the repository URL
      const { stdout: username } = await execa('gh', ['api', 'user', '--jq', '.login']);
      const repoUrl = `git@github.com:${username.trim()}/${repoName}.git`;
      
      spinner.succeed(`Created repository: ${repoName}`);
      return { name: repoName, url: repoUrl };
    }
  } catch (error) {
    spinner.fail(`Failed to create repository: ${repoName}`);
    throw error;
  }
}

// Remove folder from git tracking
async function gitRmCached(folderPath) {
  try {
    await execa('git', ['rm', '--cached', '-r', folderPath]);
  } catch (error) {
    // Might not be tracked, that's ok
    console.warn(`Warning: Could not remove ${folderPath} from git cache: ${error.message}`);
  }
}

// Process a single service folder
async function processServiceFolder(folderName) {
  const folderPath = path.join('services', folderName);
  const spinner = ora(`Processing: ${folderName}`).start();
  
  try {
    // Check if already a git submodule
    const isAlreadySubmodule = await gitHelpers.isSubmodule(folderPath) || 
                               await gitHelpers.isRegisteredSubmodule(folderPath);
    if (isAlreadySubmodule) {
      spinner.succeed(`${folderName} is already a submodule, skipping...`);
      return { folderName, success: true, skipped: true };
    }
    
    spinner.text = `Analyzing folder: ${folderName}`;
    
    // Check if folder is empty
    const isEmpty = await isFolderEmpty(folderPath);
    
    if (isEmpty) {
      spinner.text = `Folder is empty: ${folderName}`;
      
      // Remove from git cache and delete folder
      await gitRmCached(folderPath);
      await fs.rm(folderPath, { recursive: true, force: true });
      
      // Create GitHub repository
      const repoName = generateRepoName(folderName);
      const { name: actualRepoName, url: repoUrl } = await createGitHubRepo(repoName);
      
      // Add as submodule
      spinner.text = `Adding submodule: ${folderName}`;
      await gitHelpers.addSubmodule(repoUrl, folderPath);
      
      spinner.succeed(`Successfully processed empty folder: ${folderName} -> ${actualRepoName}`);
      return { folderName, success: true, repoName: actualRepoName, created: true };
    }
    
    // Check if has .git folder
    const hasGit = await hasGitRepo(folderPath);
    
    if (!hasGit) {
      spinner.text = `No git repository found: ${folderName}`;
      
      // Remove from git cache
      await gitRmCached(folderPath);
      
      // Create GitHub repository
      const repoName = generateRepoName(folderName);
      const { name: actualRepoName, url: repoUrl } = await createGitHubRepo(repoName);
      
      // Initialize git in folder, add files, and push
      spinner.text = `Initializing git repository: ${folderName}`;
      await execa('git', ['init'], { cwd: folderPath });
      await execa('git', ['add', '.'], { cwd: folderPath });
      await execa('git', ['commit', '-m', 'Initial commit'], { cwd: folderPath });
      await execa('git', ['branch', '-M', 'main'], { cwd: folderPath });
      await execa('git', ['remote', 'add', 'origin', repoUrl], { cwd: folderPath });
      await execa('git', ['push', '-u', 'origin', 'main'], { cwd: folderPath });
      
      // Save the folder contents by moving to a temporary location
      const tempPath = `${folderPath}_temp`;
      await fs.rename(folderPath, tempPath);
      
      // Add as submodule
      await gitHelpers.addSubmodule(repoUrl, folderPath);
      
      // Remove temporary folder
      await fs.rm(tempPath, { recursive: true, force: true });
      
      spinner.succeed(`Successfully processed folder without git: ${folderName} -> ${actualRepoName}`);
      return { folderName, success: true, repoName: actualRepoName, initialized: true };
    } else {
      spinner.text = `Found git repository: ${folderName}`;
      
      // Get remote URL
      const remoteUrl = await getRemoteUrl(folderPath);
      
      if (remoteUrl) {
        spinner.text = `Using existing remote: ${folderName}`;
        
        // Remove from git cache and replace with submodule
        await gitRmCached(folderPath);
        
        // Save the folder contents by moving to a temporary location
        const tempPath = `${folderPath}_temp`;
        await fs.rename(folderPath, tempPath);
        
        // Add as submodule with existing remote
        await gitHelpers.addSubmodule(remoteUrl, folderPath);
        
        // Remove temporary folder
        await fs.rm(tempPath, { recursive: true, force: true });
        
        spinner.succeed(`Successfully processed folder with existing remote: ${folderName}`);
        return { folderName, success: true, remoteUrl, existingRemote: true };
      } else {
        spinner.text = `No remote found, creating new repository: ${folderName}`;
        
        // Create GitHub repository
        const repoName = generateRepoName(folderName);
        const { name: actualRepoName, url: repoUrl } = await createGitHubRepo(repoName);
        
        // Add remote and push existing history
        await execa('git', ['remote', 'add', 'origin', repoUrl], { cwd: folderPath });
        await execa('git', ['branch', '-M', 'main'], { cwd: folderPath });
        await execa('git', ['push', '-u', 'origin', 'main'], { cwd: folderPath });
        
        // Remove from git cache and replace with submodule
        await gitRmCached(folderPath);
        
        // Save the folder contents by moving to a temporary location
        const tempPath = `${folderPath}_temp`;
        await fs.rename(folderPath, tempPath);
        
        // Add as submodule
        await gitHelpers.addSubmodule(repoUrl, folderPath);
        
        // Remove temporary folder
        await fs.rm(tempPath, { recursive: true, force: true });
        
        spinner.succeed(`Successfully processed folder without remote: ${folderName} -> ${actualRepoName}`);
        return { folderName, success: true, repoName: actualRepoName, newRepo: true };
      }
    }
  } catch (error) {
    spinner.fail(`Failed to process: ${folderName}`);
    console.error(`Error: ${error.message}`);
    return { folderName, success: false, error: error.message };
  }
}

async function initSubmodules() {
  console.log(colors.bold(`${icons.rocket} Initializing Git Submodules for AI Startup Methodology Coach`));
  console.log('='.repeat(60));
  
  // Check if we're in the root directory
  if (!(await checkProjectRoot())) {
    log.error('Please run this script from the project root directory');
    process.exit(1);
  }
  
  // Check if it's a git repository
  if (!(await gitHelpers.isGitRepo())) {
    log.error('This is not a git repository. Please initialize git first.');
    process.exit(1);
  }
  
  // Check if GitHub CLI is installed and authenticated
  if (!(await githubHelpers.isGhInstalled())) {
    log.error('GitHub CLI (gh) is not installed. Please install it first.');
    log.info('Visit: https://cli.github.com/');
    process.exit(1);
  }
  
  if (!(await githubHelpers.isAuthenticated())) {
    log.error('GitHub CLI is not authenticated. Please run: gh auth login');
    process.exit(1);
  }
  
  // Create services directory if it doesn't exist
  try {
    await fs.mkdir('services', { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  // Get list of service folders
  log.section('Discovering Service Folders');
  const serviceFolders = await getServiceFolders();
  
  if (serviceFolders.length === 0) {
    log.warning('No service folders found in ./services/');
    log.info('Create some folders in ./services/ and run this script again.');
    return;
  }
  
  log.info(`Found ${serviceFolders.length} service folders: ${serviceFolders.join(', ')}`);
  
  // Process each service folder
  log.section('Processing Service Folders');
  
  const results = [];
  for (const folderName of serviceFolders) {
    const result = await processServiceFolder(folderName);
    results.push(result);
  }
  
  // Initialize and update all submodules
  log.section('Initializing and Updating Submodules');
  
  const spinner = ora('Initializing submodules...').start();
  try {
    await gitHelpers.initSubmodules();
    spinner.text = 'Updating submodules...';
    await gitHelpers.updateSubmodules();
    spinner.succeed('All submodules initialized and updated successfully');
  } catch (error) {
    spinner.fail('Failed to initialize/update submodules');
    console.error(error.message);
  }
  
  // Create .gitmodules backup
  try {
    await fs.copyFile('.gitmodules', '.gitmodules.backup');
    log.info('Created backup of .gitmodules');
  } catch (error) {
    log.warning('Could not create .gitmodules backup');
  }
  
  // Show summary
  log.newline();
  log.success('🎉 Submodule initialization complete!');
  
  log.section('Summary');
  for (const result of results) {
    if (result.success) {
      let status = colors.success(`${icons.check} ${result.folderName}`);
      
      if (result.skipped) {
        status += colors.dim(' (already submodule)');
      } else if (result.created) {
        status += colors.info(` -> created repo: ${result.repoName}`);
      } else if (result.initialized) {
        status += colors.info(` -> initialized repo: ${result.repoName}`);
      } else if (result.existingRemote) {
        status += colors.info(' -> used existing remote');
      } else if (result.newRepo) {
        status += colors.info(` -> created new repo: ${result.repoName}`);
      }
      
      log.item(status);
    } else {
      log.item(colors.error(`${icons.cross} ${result.folderName} (failed: ${result.error})`));
    }
  }
  
  log.section('Next Steps');
  log.item(`Run: ${colors.info('npm run sync')} to sync all submodules`);
  log.item(`Run: ${colors.info('npm run new-feature <service> <feature>')} to start working on a feature`);
  log.item(`Check the documentation: ${colors.info('docs/GIT_SUBMODULE_WORKFLOW.md')}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initSubmodules().catch(error => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

export default initSubmodules;