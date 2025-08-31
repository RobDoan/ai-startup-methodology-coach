#!/usr/bin/env node

import fs from 'fs/promises';
import ora from 'ora';
import inquirer from 'inquirer';
import { log, colors, icons } from '../utils/colors.js';
import { gitHelpers } from '../utils/git.js';

async function syncSubmodule(submodulePath, submoduleName, forceUpdate = false) {
  log.section(`Syncing submodule: ${submoduleName}`);
  log.item(`Path: ${submodulePath}`);
  
  if (!(await fs.access(submodulePath).then(() => true).catch(() => false))) {
    log.error(`Submodule directory not found: ${submodulePath}`);
    return false;
  }
  
  // Check for uncommitted changes
  const hasChanges = await gitHelpers.hasUncommittedChanges(submodulePath);
  if (hasChanges) {
    log.warning(`Uncommitted changes detected in ${submoduleName}`);
    
    if (!forceUpdate) {
      log.warning(`Use --force to sync anyway, or commit your changes first`);
      log.warning(`Skipping ${submoduleName}...`);
      return false;
    } else {
      const spinner = ora('Force update enabled, stashing changes...').start();
      try {
        await gitHelpers.stash(`Auto-stash before sync ${new Date().toISOString()}`, submodulePath);
        spinner.succeed('Changes stashed');
      } catch (error) {
        spinner.fail('Failed to stash changes');
        return false;
      }
    }
  }
  
  // Get current branch
  const currentBranch = await gitHelpers.getCurrentBranch(submodulePath);
  log.item(`Current branch: ${currentBranch || 'detached'}`);
  
  // Fetch latest changes
  let spinner = ora('Fetching latest changes...').start();
  try {
    await gitHelpers.fetch(submodulePath);
    spinner.succeed('Fetched latest changes');
  } catch (error) {
    spinner.fail('Failed to fetch changes');
    return false;
  }
  
  // If we're on a branch, pull latest
  if (currentBranch && currentBranch !== 'HEAD') {
    spinner = ora(`Pulling latest from ${currentBranch}...`).start();
    try {
      await gitHelpers.pull(submodulePath, 'origin', currentBranch);
      spinner.succeed(`Pulled latest from ${currentBranch}`);
    } catch (error) {
      spinner.fail(`Failed to pull from ${currentBranch}`);
      return false;
    }
  } else {
    // If detached, checkout main/master
    const defaultBranch = await gitHelpers.getDefaultBranch(submodulePath);
    spinner = ora(`Checking out ${defaultBranch}...`).start();
    try {
      await gitHelpers.checkout(defaultBranch, submodulePath);
      await gitHelpers.pull(submodulePath, 'origin', defaultBranch);
      spinner.succeed(`Checked out and pulled ${defaultBranch}`);
    } catch (error) {
      spinner.fail(`Failed to checkout ${defaultBranch}`);
      return false;
    }
  }
  
  log.success(`Successfully synced ${submoduleName}`);
  return true;
}

async function syncSubmodules(options = {}) {
  const { force = false } = options;
  
  console.log(colors.bold(`${icons.sync} Syncing Git Submodules`));
  console.log('='.repeat(30));
  
  if (force) {
    log.warning('Force update enabled - will stash uncommitted changes');
  }
  
  // Check if we're in the root directory
  try {
    await fs.access('.gitmodules');
  } catch {
    log.error('.gitmodules not found. Please run from project root.');
    process.exit(1);
  }
  
  // Sync git submodules configuration
  log.section('Syncing submodule URLs');
  let spinner = ora('Syncing submodule configuration...').start();
  try {
    await gitHelpers.git.raw(['submodule', 'sync']);
    spinner.succeed('Synced submodule URLs');
  } catch (error) {
    spinner.fail('Failed to sync submodule URLs');
    console.error(error);
  }
  
  // Initialize submodules if not done already
  spinner = ora('Initializing submodules...').start();
  try {
    await gitHelpers.initSubmodules();
    spinner.succeed('Initialized submodules');
  } catch (error) {
    spinner.fail('Failed to initialize submodules');
    console.error(error);
  }
  
  // Get all submodule paths
  const submodules = await gitHelpers.getSubmodules();
  
  if (submodules.length === 0) {
    log.warning('No submodules found');
    return;
  }
  
  // Sync each submodule
  const results = [];
  for (const submodule of submodules) {
    const success = await syncSubmodule(submodule.path, submodule.name, force);
    results.push({ name: submodule.name, path: submodule.path, success });
  }
  
  // Update submodule references in parent repo
  log.section('Updating submodule references in parent repo');
  
  try {
    await gitHelpers.add('.');
    const hasChanges = await gitHelpers.hasUncommittedChanges();
    
    if (hasChanges) {
      log.info('Changes detected in parent repo:');
      
      // Show git status
      const status = await gitHelpers.git.status(['--short']);
      console.log(status);
      
      const { commitChanges } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'commitChanges',
          message: 'Commit submodule updates to parent repo?',
          default: false,
        },
      ]);
      
      if (commitChanges) {
        const submoduleStatus = await gitHelpers.getSubmoduleStatus();
        const commitMessage = `chore: update submodule references to latest commits\n\n${submoduleStatus.join('\n')}`;
        
        await gitHelpers.commit(commitMessage);
        log.success('Committed submodule updates to parent repo');
      } else {
        log.warning('Submodule updates staged but not committed');
      }
    } else {
      log.success('No submodule reference updates needed');
    }
  } catch (error) {
    log.error('Failed to update parent repo');
    console.error(error);
  }
  
  // Show summary
  log.section('Summary');
  for (const result of results) {
    if (result.success) {
      log.item(colors.success(`${icons.check} ${result.name}`));
    } else {
      log.item(colors.error(`${icons.cross} ${result.name} (failed)`));
    }
  }
  
  // Show current submodule status
  try {
    const status = await gitHelpers.getSubmoduleStatus();
    log.newline();
    log.info('Current submodule status:');
    for (const line of status) {
      console.log(`  ${line}`);
    }
  } catch (error) {
    // Ignore status errors
  }
  
  log.success('🎉 Submodule sync complete!');
  
  log.section('Next Steps');
  log.item(`If you made changes, push to parent repo: ${colors.info('git push origin main')}`);
  log.item(`To start a new feature: ${colors.info('npm run new-feature <service> <feature>')}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  
  syncSubmodules({ force }).catch(error => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

export default syncSubmodules;