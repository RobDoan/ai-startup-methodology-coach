#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import ora from 'ora';
import inquirer from 'inquirer';
import { log, colors, icons } from '../utils/colors.js';
import { gitHelpers } from '../utils/git.js';

async function getAvailableServices() {
  try {
    const servicesDir = await fs.readdir('services');
    const services = [];
    
    for (const service of servicesDir) {
      const servicePath = path.join('services', service);
      const isSubmodule = await gitHelpers.isSubmodule(servicePath);
      if (isSubmodule) {
        services.push(service);
      }
    }
    
    return services;
  } catch {
    return [];
  }
}

async function createFeatureBranch(serviceName, featureName) {
  const servicePath = path.join('services', serviceName);
  
  log.section('Creating New Feature Branch');
  log.item(`Service: ${colors.info(serviceName)}`);
  log.item(`Feature: ${colors.info(featureName)}`);
  log.item(`Path: ${servicePath}`);
  
  // Validate service exists
  try {
    await fs.access(servicePath);
  } catch {
    log.error(`Service '${serviceName}' not found`);
    
    const availableServices = await getAvailableServices();
    if (availableServices.length > 0) {
      log.info('Available services:');
      for (const service of availableServices) {
        log.item(service);
      }
    }
    return false;
  }
  
  // Check if it's a valid git repository
  if (!(await gitHelpers.isGitRepo(servicePath))) {
    log.error(`'${serviceName}' is not a git repository`);
    log.info('Make sure it\'s properly initialized as a submodule');
    return false;
  }
  
  // Check current status
  let spinner = ora('Checking current status...').start();
  
  // Check for uncommitted changes
  const hasChanges = await gitHelpers.hasUncommittedChanges(servicePath);
  if (hasChanges) {
    spinner.fail('Uncommitted changes detected');
    log.error('Please commit or stash your changes first');
    
    try {
      const status = await gitHelpers.git.status(['--short'], { cwd: servicePath });
      console.log(status);
    } catch {
      // Ignore status error
    }
    
    return false;
  }
  
  // Get current and default branches
  const currentBranch = await gitHelpers.getCurrentBranch(servicePath);
  const defaultBranch = await gitHelpers.getDefaultBranch(servicePath);
  
  spinner.succeed('Status check complete');
  log.item(`Current branch: ${currentBranch}`);
  log.item(`Default branch: ${defaultBranch}`);
  
  // Fetch latest changes
  spinner = ora('Fetching latest changes...').start();
  try {
    await gitHelpers.fetch(servicePath);
    spinner.succeed('Fetched latest changes');
  } catch (error) {
    spinner.fail('Failed to fetch changes');
    return false;
  }
  
  // Switch to default branch if not already there
  if (currentBranch !== defaultBranch) {
    spinner = ora(`Switching to ${defaultBranch}...`).start();
    try {
      await gitHelpers.checkout(defaultBranch, servicePath);
      spinner.succeed(`Switched to ${defaultBranch}`);
    } catch (error) {
      spinner.fail(`Failed to switch to ${defaultBranch}`);
      return false;
    }
  }
  
  // Pull latest changes
  spinner = ora('Pulling latest changes...').start();
  try {
    await gitHelpers.pull(servicePath, 'origin', defaultBranch);
    spinner.succeed('Pulled latest changes');
  } catch (error) {
    spinner.fail('Failed to pull latest changes');
    return false;
  }
  
  // Create feature branch name with proper formatting
  const featureBranch = `feature/${featureName}`;
  
  // Check if feature branch already exists
  const branchExists = await gitHelpers.branchExists(featureBranch, servicePath);
  const remoteBranchExists = await gitHelpers.remoteBranchExists(featureBranch, servicePath);
  
  if (branchExists) {
    log.warning(`Feature branch '${featureBranch}' already exists locally`);
    
    const { switchToBranch } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'switchToBranch',
        message: 'Do you want to switch to it?',
        default: false,
      },
    ]);
    
    if (switchToBranch) {
      try {
        await gitHelpers.checkout(featureBranch, servicePath);
        log.success(`Switched to existing branch: ${featureBranch}`);
      } catch (error) {
        log.error(`Failed to switch to ${featureBranch}`);
        return false;
      }
    } else {
      log.info('Staying on current branch');
      return false;
    }
  } else if (remoteBranchExists) {
    log.warning(`Feature branch '${featureBranch}' exists on remote`);
    
    spinner = ora('Checking out remote branch...').start();
    try {
      await gitHelpers.git.checkoutBranch(featureBranch, `origin/${featureBranch}`, { cwd: servicePath });
      spinner.succeed(`Checked out remote branch: ${featureBranch}`);
    } catch (error) {
      spinner.fail('Failed to checkout remote branch');
      return false;
    }
  } else {
    // Create new feature branch
    spinner = ora(`Creating new feature branch: ${featureBranch}`).start();
    try {
      await gitHelpers.createBranch(featureBranch, servicePath);
      spinner.succeed(`Created and switched to: ${featureBranch}`);
    } catch (error) {
      spinner.fail('Failed to create feature branch');
      return false;
    }
  }
  
  // Success message and next steps
  log.success('🎉 Feature branch setup complete!');
  
  log.section("What's next:");
  log.item(`Make your changes in: ${colors.info(servicePath)}`);
  log.item(`Commit your changes: ${colors.dim(`cd ${servicePath} && git add . && git commit -m "feat: your changes"`)}`);
  log.item(`Push feature branch: ${colors.dim(`cd ${servicePath} && git push -u origin ${featureBranch}`)}`);
  log.item(`Create PR: ${colors.info(`npm run create-pr ${serviceName}`)}`);
  log.item(`After PR merge: ${colors.info(`npm run parent-pr`)}`);
  
  log.section('Helpful commands:');
  log.item(`Check status: ${colors.dim(`cd ${servicePath} && git status`)}`);
  log.item(`List branches: ${colors.dim(`cd ${servicePath} && git branch -a`)}`);
  log.item(`Switch branches: ${colors.dim(`cd ${servicePath} && git checkout <branch-name>`)}`);
  
  return true;
}

async function newFeature(serviceName, featureName) {
  // Validate arguments
  if (!serviceName || !featureName) {
    log.error('Invalid arguments');
    console.log('Usage: npm run new-feature <service-name> <feature-name>');
    console.log('');
    
    const availableServices = await getAvailableServices();
    if (availableServices.length > 0) {
      log.info('Available services:');
      for (const service of availableServices) {
        log.item(service);
      }
    } else {
      log.warning('No services directory found');
    }
    return false;
  }
  
  return await createFeatureBranch(serviceName, featureName);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const [serviceName, featureName] = args;
  
  newFeature(serviceName, featureName).catch(error => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

export default newFeature;