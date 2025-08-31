# Git Submodule Workflow Guide

This document outlines the complete workflow for working with Git submodules in the AI Startup Methodology Coach project. Each service is managed as a separate Git repository and included as a submodule in the parent repository.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Daily Development Workflow](#daily-development-workflow)
- [Scripts Reference](#scripts-reference)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Overview

### Architecture

```
ai-startup-methodology-coach/          # Parent repository
├── services/                          # Services directory
│   ├── brainiac-ai-service/          # Submodule → separate repo
│   ├── ui-service/                   # Submodule → separate repo
│   └── api-gateway/                  # Submodule → separate repo
├── scripts/git-submodules/           # Workflow scripts
├── templates/                        # Shared templates
└── docs/                            # Documentation
```

### Why Submodules?

- **Independent Development**: Each service can be developed independently
- **Version Control**: Track specific versions of each service
- **Team Collaboration**: Teams can work on different services without conflicts
- **Release Management**: Deploy services independently or together

## Prerequisites

Before starting, ensure you have:

- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) 18+ (for the modern CLI)
- [GitHub CLI](https://cli.github.com/) installed (`gh` command)
- Access to all service repositories
- SSH keys configured for GitHub

### Verify Prerequisites

```bash
# Check Git
git --version

# Check Node.js (for modern CLI)
node --version

# Check GitHub CLI
gh --version

# Check SSH access
ssh -T git@github.com
```

## Initial Setup

We provide two options for managing submodules: a **modern Node.js CLI** (recommended) and traditional **bash scripts**.

### Option 1: Node.js CLI (Recommended)

#### Setup the CLI
```bash
# One-time setup
cd scripts/git-submodules-js
npm install
```

#### Initialize Submodules
```bash
# From scripts/git-submodules-js directory
npm run init
```

### Option 2: Bash Scripts

#### Initialize Submodules
```bash
# From project root
./scripts/git-submodules/01-init-submodules.sh
```

Both methods will:
- Add each service as a submodule
- Initialize and update all submodules
- Create a backup of `.gitmodules`

### Verify Setup

Check that all submodules are properly initialized:

```bash
# Using Git command (both options)
git submodule status

# Using Node.js CLI (shows more details)
cd scripts/git-submodules-js
node src/index.js status
```

Expected `git submodule status` output:
```
 abc123def services/brainiac-ai-service (main)
 def456ghi services/ui-service (main)
 ghi789jkl services/api-gateway (main)
```

## Daily Development Workflow

Choose between the **Node.js CLI** (recommended) or **bash scripts** for your daily workflow.

### Starting a New Feature

#### Step 1: Sync Submodules
Always start by syncing all submodules to the latest state:

**Node.js CLI:**
```bash
cd scripts/git-submodules-js
npm run sync
```

**Bash Scripts:**
```bash
./scripts/git-submodules/02-sync-submodules.sh
```

#### Step 2: Create Feature Branch
Create a new feature branch in the specific service:

**Node.js CLI:**
```bash
# Interactive mode (recommended)
npm start
# Then select "🌱 Start new feature"

# Or direct command
npm run new-feature <service-name> <feature-name>
```

**Bash Scripts:**
```bash
./scripts/git-submodules/03-new-feature.sh <service-name> <feature-name>
```

**Example:**
```bash
# Node.js CLI
npm run new-feature brainiac-ai-service template-scanner

# Bash script
./scripts/git-submodules/03-new-feature.sh brainiac-ai-service template-scanner
```

Both methods create a branch: `feature/template-scanner`

#### Step 3: Develop Your Feature
Navigate to the service and make your changes:

```bash
cd services/brainiac-ai-service
# Make your changes
git add .
git commit -m "feat: implement template scanner functionality"
```

#### Step 4: Create Submodule PR
Push your changes and create a PR for the service:

**Node.js CLI:**
```bash
# Interactive mode (recommended)
npm start
# Then select "📤 Create service PR"

# Or direct command
npm run create-pr brainiac-ai-service

# For draft PRs
npm run create-pr brainiac-ai-service --draft
```

**Bash Scripts:**
```bash
./scripts/git-submodules/04-create-submodule-pr.sh brainiac-ai-service

# Add --draft flag for draft PRs
./scripts/git-submodules/04-create-submodule-pr.sh brainiac-ai-service --draft
```

#### Step 5: Update Parent Repository
After the submodule PR is merged, update the parent repository:

**Node.js CLI:**
```bash
# Sync submodules to get the merged changes
npm run sync

# Create PR for parent repo
npm run parent-pr template-scanner
```

**Bash Scripts:**
```bash
# Sync submodules to get the merged changes
./scripts/git-submodules/02-sync-submodules.sh

# Create PR for parent repo
./scripts/git-submodules/05-create-parent-pr.sh template-scanner
```

### Complete Workflow Example

Here's a complete example of implementing a new feature:

#### Using Node.js CLI (Recommended)

```bash
# Setup (first time only)
cd scripts/git-submodules-js && npm install

# 1. Sync everything
npm run sync

# 2. Create feature branch
npm run new-feature brainiac-ai-service user-authentication

# 3. Navigate and develop
cd ../../services/brainiac-ai-service
# ... make changes ...
git add .
git commit -m "feat: add JWT authentication middleware"

# 4. Create submodule PR
cd ../../scripts/git-submodules-js
npm run create-pr brainiac-ai-service

# 5. After PR is merged, update parent
npm run sync
npm run parent-pr user-authentication
```

#### Using Bash Scripts

```bash
# 1. Sync everything
./scripts/git-submodules/02-sync-submodules.sh

# 2. Create feature branch
./scripts/git-submodules/03-new-feature.sh brainiac-ai-service user-authentication

# 3. Navigate and develop
cd services/brainiac-ai-service
# ... make changes ...
git add .
git commit -m "feat: add JWT authentication middleware"

# 4. Create submodule PR
cd ../..  # Back to root
./scripts/git-submodules/04-create-submodule-pr.sh brainiac-ai-service

# 5. After PR is merged, update parent
./scripts/git-submodules/02-sync-submodules.sh
./scripts/git-submodules/05-create-parent-pr.sh user-authentication
```

## Tools Reference

We provide both a **modern Node.js CLI** and **traditional bash scripts** for submodule management.

### Which Tool Should You Use?

**Node.js CLI (Recommended)** if you want:
- ✅ Cross-platform compatibility (Windows, macOS, Linux)
- ✅ Interactive guided workflows
- ✅ Better error messages and recovery suggestions
- ✅ Beautiful colored output with progress indicators
- ✅ Status checking and troubleshooting commands

**Bash Scripts** if you prefer:
- ✅ Simple, traditional shell scripts
- ✅ No Node.js dependency
- ✅ Direct control over each step
- ✅ Easier to customize for specific needs

### Node.js CLI Commands (Recommended)

After setup (`cd scripts/git-submodules-js && npm install`):

| Command | Purpose | Usage |
|---------|---------|-------|
| `npm run init` | Initialize all submodules | First-time setup |
| `npm run sync` | Sync all submodules | Daily sync, before work |
| `npm run sync --force` | Force sync with stash | When stuck with changes |
| `npm run new-feature <svc> <feat>` | Create feature branch | Start new development |
| `npm run create-pr <svc>` | Create service PR | After completing feature |
| `npm run create-pr <svc> --draft` | Create draft service PR | For work-in-progress |
| `npm run parent-pr [feat]` | Create parent PR | After service PRs merge |
| `npm start` | Interactive workflow | Guided step-by-step |
| `node src/index.js status` | Check submodule status | Troubleshooting |
| `node src/index.js help-workflow` | Show workflow guide | Quick reference |

### Bash Scripts Reference

### 01-init-submodules.sh
**Purpose**: Initialize all service submodules
**Usage**: `./scripts/git-submodules/01-init-submodules.sh`

- Adds each service as a Git submodule
- Initializes and updates submodules
- Creates `.gitmodules` backup

### 02-sync-submodules.sh
**Purpose**: Sync all submodules to latest commits
**Usage**: `./scripts/git-submodules/02-sync-submodules.sh [--force]`

**Options**:
- `--force`: Force sync even with uncommitted changes (stashes them)

**What it does**:
- Syncs submodule URLs
- Fetches latest changes for each submodule
- Updates submodule references in parent repo
- Optionally commits updates

### 03-new-feature.sh
**Purpose**: Create a new feature branch in a service
**Usage**: `./scripts/git-submodules/03-new-feature.sh <service-name> <feature-name>`

**Examples**:
```bash
./scripts/git-submodules/03-new-feature.sh brainiac-ai-service api-refactor
./scripts/git-submodules/03-new-feature.sh ui-service dark-mode
```

**What it does**:
- Validates service exists
- Switches to main/master branch
- Pulls latest changes
- Creates and switches to feature branch

### 04-create-submodule-pr.sh
**Purpose**: Push feature branch and create PR for a service
**Usage**: `./scripts/git-submodules/04-create-submodule-pr.sh <service-name> [--draft]`

**Options**:
- `--draft`: Create as draft PR

**What it does**:
- Commits any uncommitted changes
- Pushes branch to remote
- Creates GitHub PR using `gh` CLI
- Provides PR URL and next steps

### 05-create-parent-pr.sh
**Purpose**: Create PR for parent repository with submodule updates
**Usage**: `./scripts/git-submodules/05-create-parent-pr.sh [feature-name] [--draft]`

**Options**:
- `feature-name`: Optional name for the feature (used in branch/PR naming)
- `--draft`: Create as draft PR

**What it does**:
- Creates feature branch if on main
- Commits submodule reference updates
- Pushes to remote
- Creates GitHub PR

## Troubleshooting

### Common Issues

#### 1. Submodule is in detached HEAD state

**Problem**: After syncing, a submodule shows detached HEAD.

**Solution**:
```bash
cd services/<service-name>
git checkout main  # or master
git pull origin main
```

#### 2. Uncommitted changes blocking sync

**Problem**: Sync fails due to uncommitted changes.

**Solutions**:
```bash
# Option 1: Commit changes
cd services/<service-name>
git add .
git commit -m "WIP: save current progress"

# Option 2: Stash changes
git stash push -m "Temporary stash"

# Option 3: Force sync (auto-stashes)
./scripts/git-submodules/02-sync-submodules.sh --force
```

#### 3. Submodule directory missing after clone

**Problem**: After cloning parent repo, service directories are empty.

**Solution**:
```bash
git submodule update --init --recursive
```

#### 4. GitHub CLI not authenticated

**Problem**: `gh` commands fail with authentication error.

**Solution**:
```bash
gh auth login
```

#### 5. Merge conflicts in parent repo

**Problem**: Multiple people updated different submodules.

**Solution**:
```bash
# Sync all submodules first
./scripts/git-submodules/02-sync-submodules.sh

# Then resolve conflicts in parent repo
git add .
git commit -m "resolve: merge submodule conflicts"
```

### Recovery Commands

#### Reset submodule to clean state
```bash
cd services/<service-name>
git fetch origin
git reset --hard origin/main
git clean -fd
```

#### Re-initialize corrupted submodule
```bash
git submodule deinit -f services/<service-name>
git rm -f services/<service-name>
git submodule add <repo-url> services/<service-name>
```

#### Force sync all submodules
```bash
git submodule foreach --recursive git reset --hard HEAD
git submodule foreach --recursive git clean -fd
git submodule update --init --recursive --force
```

## Best Practices

### Development Workflow

1. **Always sync first**: Run sync script before starting new work
2. **One feature per branch**: Keep feature branches focused
3. **Commit frequently**: Make small, focused commits
4. **Write clear commit messages**: Follow conventional commit format
5. **Test before PR**: Ensure your changes work locally

### Branch Naming

Use consistent branch naming:
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `chore/task-description` - Maintenance tasks
- `docs/update-description` - Documentation updates

### Commit Messages

Follow conventional commit format:
```
type(scope): short description

Longer description if needed

Fixes #123
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### PR Best Practices

1. **Use descriptive titles**: Include service name and brief description
2. **Write detailed descriptions**: Explain what and why
3. **Add checklists**: Include testing and review items
4. **Request reviews**: Tag appropriate team members
5. **Keep PRs small**: Easier to review and merge

### Collaboration

1. **Communicate changes**: Use team chat/issues for coordination
2. **Review thoroughly**: Check both code and submodule updates
3. **Update documentation**: Keep workflow docs current
4. **Share knowledge**: Help teammates learn the workflow

### Deployment

1. **Test integration**: Verify all services work together
2. **Staged deployment**: Deploy services in order if needed
3. **Monitor health**: Check service status after deployment
4. **Rollback plan**: Know how to revert if issues arise

## Interactive Workflow with Node.js CLI

The Node.js CLI provides an interactive mode that guides you through the entire workflow:

```bash
cd scripts/git-submodules-js
npm start
```

This launches a menu with options:
- 🚀 Initialize submodules (first time setup)
- 🔄 Sync all submodules  
- 🌱 Start new feature
- 📤 Create service PR
- 📝 Create parent PR
- ❓ Show help

### Status Checking

Get detailed status information about all submodules:

```bash
node src/index.js status
```

This shows:
- Current branch for each submodule
- Whether there are uncommitted changes
- Synchronization status with remotes

### Troubleshooting Mode

The Node.js CLI provides better error messages and recovery suggestions. When something goes wrong, it will:

1. Clearly explain what happened
2. Suggest specific commands to fix the issue
3. Offer to automatically fix common problems
4. Provide links to relevant documentation

### Force Operations

When you have uncommitted changes blocking operations:

```bash
# The CLI will ask if you want to stash changes
npm run sync --force

# Or create PR even with local changes
npm run create-pr brainiac-ai-service --draft
```

## Advanced Usage

### Working with Multiple Services

To work on multiple services simultaneously:

```bash
# Create feature branches in multiple services
./scripts/git-submodules/03-new-feature.sh brainiac-ai-service multi-service-feature
./scripts/git-submodules/03-new-feature.sh ui-service multi-service-feature

# Work in each service
cd services/brainiac-ai-service
# Make changes
git commit -m "feat: add API endpoint"

cd ../ui-service
# Make changes
git commit -m "feat: add UI components"

# Create PRs for each service
cd ../..
./scripts/git-submodules/04-create-submodule-pr.sh brainiac-ai-service
./scripts/git-submodules/04-create-submodule-pr.sh ui-service

# After both PRs are merged
./scripts/git-submodules/02-sync-submodules.sh
./scripts/git-submodules/05-create-parent-pr.sh multi-service-feature
```

### Custom Git Hooks

You can add Git hooks to automate parts of the workflow:

#### Pre-commit hook to check submodule status
```bash
#!/bin/sh
# .git/hooks/pre-commit

# Check if submodules are properly committed
git submodule foreach --quiet --recursive 'git diff-index --quiet HEAD -- || exit 1'
if [ $? -ne 0 ]; then
    echo "Error: Uncommitted changes in submodules"
    exit 1
fi
```

## Getting Help

If you encounter issues not covered in this guide:

### Using Node.js CLI

1. **Check status**: `node src/index.js status` - Shows detailed submodule information
2. **Interactive help**: `npm start` - Guided workflow assistance
3. **Workflow guide**: `node src/index.js help-workflow` - Complete command reference
4. **Force operations**: Most commands support `--force` for difficult situations

### General Troubleshooting

1. **Check Git status**: `git status` and `git submodule status`
2. **Review recent commits**: `git log --oneline -10`
3. **Ask the team**: Share your issue in team chat
4. **Update this guide**: Add solutions for new issues

### Quick Fixes

```bash
# Using Node.js CLI
cd scripts/git-submodules-js
npm run sync --force              # Fix most sync issues
node src/index.js status          # Detailed status check

# Using bash scripts  
./scripts/git-submodules/02-sync-submodules.sh --force  # Force sync
git submodule status              # Basic status check
```

## Reference Links

- [Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Conventional Commits](https://conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

*This guide is maintained by the development team. Please keep it updated as the workflow evolves.*