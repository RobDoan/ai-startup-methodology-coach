#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { log, colors, icons } from './utils/colors.js';

// Import command functions
import initSubmodules from './commands/init-submodules.js';
import syncSubmodules from './commands/sync-submodules.js';
import newFeature from './commands/new-feature.js';
import createSubmodulePR from './commands/create-submodule-pr.js';
import createParentPR from './commands/create-parent-pr.js';

const program = new Command();

// Package info
const packageInfo = {
  name: 'git-submodules-cli',
  version: '1.0.0',
  description: 'Git submodule workflow automation for AI Startup Methodology Coach',
};

program
  .name('submodule-cli')
  .description(packageInfo.description)
  .version(packageInfo.version);

// Global options
program
  .option('-v, --verbose', 'verbose output')
  .option('--no-color', 'disable colors');

// Init command
program
  .command('init')
  .description('Initialize all service submodules')
  .action(async () => {
    try {
      await initSubmodules();
    } catch (error) {
      log.error(`Init failed: ${error.message}`);
      process.exit(1);
    }
  });

// Sync command
program
  .command('sync')
  .description('Sync all submodules to latest commits')
  .option('--force', 'force sync even with uncommitted changes')
  .action(async (options) => {
    try {
      await syncSubmodules(options);
    } catch (error) {
      log.error(`Sync failed: ${error.message}`);
      process.exit(1);
    }
  });

// New feature command
program
  .command('new-feature')
  .description('Create a new feature branch in a service')
  .argument('<service>', 'service name')
  .argument('<feature>', 'feature name')
  .action(async (service, feature) => {
    try {
      const success = await newFeature(service, feature);
      if (!success) {
        process.exit(1);
      }
    } catch (error) {
      log.error(`New feature failed: ${error.message}`);
      process.exit(1);
    }
  });

// Create submodule PR command
program
  .command('create-pr')
  .description('Create PR for a service submodule')
  .argument('<service>', 'service name')
  .option('--draft', 'create as draft PR')
  .action(async (service, options) => {
    try {
      const success = await createSubmodulePR(service, options.draft);
      if (!success) {
        process.exit(1);
      }
    } catch (error) {
      log.error(`Create PR failed: ${error.message}`);
      process.exit(1);
    }
  });

// Create parent PR command
program
  .command('parent-pr')
  .description('Create PR for parent repository with submodule updates')
  .argument('[feature]', 'feature name (optional)')
  .option('--draft', 'create as draft PR')
  .action(async (feature, options) => {
    try {
      const success = await createParentPR(feature, options.draft);
      if (!success) {
        process.exit(1);
      }
    } catch (error) {
      log.error(`Parent PR failed: ${error.message}`);
      process.exit(1);
    }
  });

// Workflow command - interactive workflow helper
program
  .command('workflow')
  .description('Interactive workflow helper')
  .action(async () => {
    const inquirer = await import('inquirer');
    
    console.log(colors.bold(`${icons.rocket} Git Submodule Workflow Helper`));
    console.log('='.repeat(40));
    
    const { action } = await inquirer.default.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '🚀 Initialize submodules (first time setup)', value: 'init' },
          { name: '🔄 Sync all submodules', value: 'sync' },
          { name: '🌱 Start new feature', value: 'new-feature' },
          { name: '📤 Create service PR', value: 'create-pr' },
          { name: '📝 Create parent PR', value: 'parent-pr' },
          { name: '❓ Show help', value: 'help' },
        ],
      },
    ]);
    
    switch (action) {
      case 'init':
        await initSubmodules();
        break;
        
      case 'sync':
        const { force } = await inquirer.default.prompt([
          {
            type: 'confirm',
            name: 'force',
            message: 'Force sync (stash uncommitted changes)?',
            default: false,
          },
        ]);
        await syncSubmodules({ force });
        break;
        
      case 'new-feature':
        const { service, feature } = await inquirer.default.prompt([
          {
            type: 'input',
            name: 'service',
            message: 'Service name:',
            validate: input => input.trim() !== '',
          },
          {
            type: 'input',
            name: 'feature',
            message: 'Feature name:',
            validate: input => input.trim() !== '',
          },
        ]);
        await newFeature(service, feature);
        break;
        
      case 'create-pr':
        const prAnswers = await inquirer.default.prompt([
          {
            type: 'input',
            name: 'service',
            message: 'Service name:',
            validate: input => input.trim() !== '',
          },
          {
            type: 'confirm',
            name: 'draft',
            message: 'Create as draft PR?',
            default: false,
          },
        ]);
        await createSubmodulePR(prAnswers.service, prAnswers.draft);
        break;
        
      case 'parent-pr':
        const parentAnswers = await inquirer.default.prompt([
          {
            type: 'input',
            name: 'feature',
            message: 'Feature name (optional):',
          },
          {
            type: 'confirm',
            name: 'draft',
            message: 'Create as draft PR?',
            default: false,
          },
        ]);
        await createParentPR(parentAnswers.feature || null, parentAnswers.draft);
        break;
        
      case 'help':
        program.help();
        break;
    }
  });

// Help command
program
  .command('help-workflow')
  .description('Show detailed workflow guide')
  .action(() => {
    console.log(colors.bold(`${icons.rocket} Git Submodule Workflow Guide`));
    console.log('='.repeat(40));
    console.log();
    
    console.log(colors.bold('📚 Complete Documentation:'));
    console.log('   docs/GIT_SUBMODULE_WORKFLOW.md');
    console.log();
    
    console.log(colors.bold('🔄 Typical Workflow:'));
    console.log('   1. npm run sync                    # Sync to latest');
    console.log('   2. npm run new-feature <svc> <feat> # Create feature branch');
    console.log('   3. # Make changes in services/<svc>/');
    console.log('   4. npm run create-pr <svc>         # Create service PR');
    console.log('   5. # Merge PR on GitHub');
    console.log('   6. npm run sync                    # Sync merged changes');
    console.log('   7. npm run parent-pr <feat>        # Create parent PR');
    console.log();
    
    console.log(colors.bold('🚀 Quick Commands:'));
    console.log('   submodule-cli init                 # Initialize submodules');
    console.log('   submodule-cli sync                 # Sync all submodules');
    console.log('   submodule-cli sync --force         # Force sync with stash');
    console.log('   submodule-cli workflow             # Interactive helper');
    console.log();
    
    console.log(colors.bold('📋 Examples:'));
    console.log('   submodule-cli new-feature brainiac-ai template-scanner');
    console.log('   submodule-cli create-pr brainiac-ai --draft');
    console.log('   submodule-cli parent-pr template-scanner');
    console.log();
    
    console.log(colors.bold('🔗 Links:'));
    console.log('   Repository: https://github.com/your-org/ai-startup-methodology-coach');
    console.log('   Issues:     https://github.com/your-org/ai-startup-methodology-coach/issues');
    console.log();
  });

// Status command - show current state
program
  .command('status')
  .description('Show current submodule status')
  .action(async () => {
    const { gitHelpers } = await import('./utils/git.js');
    
    console.log(colors.bold(`${icons.info} Current Submodule Status`));
    console.log('='.repeat(35));
    
    try {
      // Check if in git repo
      const isRepo = await gitHelpers.isGitRepo();
      if (!isRepo) {
        log.error('Not in a git repository');
        return;
      }
      
      // Show current branch
      const currentBranch = await gitHelpers.getCurrentBranch();
      log.item(`Current branch: ${colors.info(currentBranch)}`);
      
      // Check for changes
      const hasChanges = await gitHelpers.hasUncommittedChanges();
      if (hasChanges) {
        log.item(`Status: ${colors.warning('Has uncommitted changes')}`);
      } else {
        log.item(`Status: ${colors.success('Clean')}`);
      }
      
      // Show submodule status
      const submodules = await gitHelpers.getSubmodules();
      if (submodules.length > 0) {
        console.log();
        log.section('Submodules:');
        
        for (const submodule of submodules) {
          if (await gitHelpers.isSubmodule(submodule.path)) {
            const subBranch = await gitHelpers.getCurrentBranch(submodule.path);
            const subHasChanges = await gitHelpers.hasUncommittedChanges(submodule.path);
            
            let status = colors.success('clean');
            if (subHasChanges) {
              status = colors.warning('has changes');
            }
            
            log.item(`${colors.info(submodule.name)}: ${subBranch} (${status})`);
          } else {
            log.item(`${colors.dim(submodule.name)}: ${colors.error('not initialized')}`);
          }
        }
      } else {
        log.item('No submodules found');
      }
      
    } catch (error) {
      log.error(`Status check failed: ${error.message}`);
    }
  });

// Error handling
program.configureOutput({
  writeErr: (str) => process.stderr.write(colors.error(str)),
});

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}