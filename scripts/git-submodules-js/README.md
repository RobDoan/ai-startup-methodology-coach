# Git Submodule CLI (Node.js)

A modern Node.js CLI tool for managing Git submodules in the AI Startup Methodology Coach project. This replaces the bash scripts with a more robust, cross-platform solution.

## 🚀 Features

- **Cross-platform**: Works on Windows, macOS, and Linux
- **Interactive workflows**: Guided prompts for complex operations
- **Better error handling**: Clear error messages with recovery suggestions
- **Progress indicators**: Visual feedback for long-running operations
- **Colored output**: Beautiful, easy-to-read terminal output
- **GitHub integration**: Built-in PR creation and management

## 📦 Installation

### Option 1: Install Dependencies (Recommended)

```bash
cd scripts/git-submodules-js
npm install
```

### Option 2: Global Installation

```bash
cd scripts/git-submodules-js
npm install -g .
# Now use 'submodule-cli' from anywhere
```

### Option 3: Use without Installation

```bash
cd scripts/git-submodules-js
npx . --help
```

## 🎯 Quick Start

### Daily Workflow

```bash
# 1. Sync all submodules
npm run sync

# 2. Start new feature
npm run new-feature brainiac-ai-service my-feature

# 3. Create service PR
npm run create-pr brainiac-ai-service

# 4. After PR merge, create parent PR
npm run parent-pr my-feature
```

### Interactive Mode

```bash
npm start
# or
node src/index.js workflow
```

This launches an interactive menu to guide you through all operations.

## 📚 Available Commands

### Core Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `init` | Initialize all submodules | `npm run init` |
| `sync` | Sync all submodules | `npm run sync [--force]` |
| `new-feature` | Create feature branch | `npm run new-feature <service> <feature>` |
| `create-pr` | Create service PR | `npm run create-pr <service> [--draft]` |
| `parent-pr` | Create parent PR | `npm run parent-pr [feature] [--draft]` |

### Utility Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `workflow` | Interactive workflow helper | `node src/index.js workflow` |
| `status` | Show submodule status | `node src/index.js status` |
| `help-workflow` | Show workflow guide | `node src/index.js help-workflow` |

## 🔧 Command Examples

### Initialize Submodules (First Time Setup)

```bash
# Install and initialize all service submodules
npm run init
```

### Sync Submodules

```bash
# Normal sync
npm run sync

# Force sync (stashes uncommitted changes)
npm run sync --force
```

### Create Feature Branch

```bash
# Create feature branch in brainiac-ai-service
npm run new-feature brainiac-ai-service template-validation

# Create feature branch in ui-service
npm run new-feature ui-service dark-mode-toggle
```

### Create Service PRs

```bash
# Create PR for service
npm run create-pr brainiac-ai-service

# Create draft PR
npm run create-pr brainiac-ai-service --draft
```

### Create Parent Repository PR

```bash
# Create parent PR with feature name
npm run parent-pr template-validation

# Create draft parent PR
npm run parent-pr template-validation --draft

# Create parent PR without specific feature name
npm run parent-pr
```

## 🎨 CLI Features

### Interactive Workflows

The CLI provides interactive prompts for complex operations:

```bash
node src/index.js workflow
```

This shows a menu with options:
- 🚀 Initialize submodules (first time setup)
- 🔄 Sync all submodules  
- 🌱 Start new feature
- 📤 Create service PR
- 📝 Create parent PR
- ❓ Show help

### Status Checking

```bash
node src/index.js status
```

Shows current state of all submodules:
- Current branches
- Uncommitted changes
- Synchronization status

### Progress Indicators

All long-running operations show progress:
- ⏳ Fetching latest changes...
- ✅ Successfully synced brainiac-ai-service
- ⚠️ Uncommitted changes detected

## 🏗️ Project Structure

```
scripts/git-submodules-js/
├── package.json              # Dependencies and scripts
├── src/
│   ├── index.js              # Main CLI entry point
│   ├── commands/             # Individual command implementations
│   │   ├── init-submodules.js
│   │   ├── sync-submodules.js
│   │   ├── new-feature.js
│   │   ├── create-submodule-pr.js
│   │   └── create-parent-pr.js
│   └── utils/
│       ├── colors.js         # Color and logging utilities
│       └── git.js           # Git and GitHub helpers
└── README.md                 # This file
```

## 🛠️ Development

### Adding New Commands

1. Create command file in `src/commands/`
2. Add command to `src/index.js`
3. Add script to `package.json`
4. Update documentation

Example command structure:

```javascript
#!/usr/bin/env node

import { log, colors, icons } from '../utils/colors.js';
import { gitHelpers } from '../utils/git.js';

async function myCommand() {
  log.section('My Command');
  // Implementation here
}

export default myCommand;
```

### Error Handling

All commands include comprehensive error handling:

```javascript
try {
  await gitOperation();
  log.success('Operation completed');
} catch (error) {
  log.error(`Operation failed: ${error.message}`);
  return false;
}
```

## 📋 Prerequisites

- **Node.js** 18+ (for ES modules support)
- **Git** 2.30+ (for submodule operations)
- **GitHub CLI** (`gh`) (for PR operations)
- **SSH access** to GitHub repositories

### Verify Prerequisites

```bash
# Check Node.js
node --version

# Check Git
git --version

# Check GitHub CLI
gh --version

# Test GitHub authentication
gh auth status
```

## 🔄 Migration from Bash Scripts

The Node.js CLI provides identical functionality to the bash scripts:

| Bash Script | Node.js Command | Notes |
|-------------|----------------|-------|
| `01-init-submodules.sh` | `npm run init` | Same functionality |
| `02-sync-submodules.sh` | `npm run sync` | Added `--force` option |
| `03-new-feature.sh` | `npm run new-feature` | Interactive prompts |
| `04-create-submodule-pr.sh` | `npm run create-pr` | Better error handling |
| `05-create-parent-pr.sh` | `npm run parent-pr` | Improved PR templates |
| `06-cleanup.sh` | *Not yet implemented* | Coming soon |

## 🐛 Troubleshooting

### Common Issues

#### Node.js version too old
```bash
# Update Node.js to 18+
nvm install 18
nvm use 18
```

#### Dependencies not installed
```bash
cd scripts/git-submodules-js
npm install
```

#### GitHub CLI not authenticated
```bash
gh auth login
```

#### Submodule not found
```bash
# Check available services
node src/index.js status
```

### Debug Mode

Run commands with verbose output:

```bash
DEBUG=* npm run sync
```

## 📖 Related Documentation

- [Main Project README](../../README.md)
- [Git Submodule Workflow Guide](../../docs/GIT_SUBMODULE_WORKFLOW.md)
- [Service Documentation](../../services/)

## 🤝 Contributing

1. Make changes to the CLI
2. Test with real submodule operations
3. Update documentation
4. Follow the Git submodule workflow for PRs

## 📝 License

MIT - Same as parent project