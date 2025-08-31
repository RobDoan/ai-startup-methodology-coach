import simpleGit from 'simple-git';
import { execa } from 'execa';
import fs from 'fs/promises';
import path from 'path';
import { log, colors } from './colors.js';

// Initialize git client
export const git = simpleGit();

// Git helper functions
export const gitHelpers = {
  // Check if we're in a git repository
  async isGitRepo(dir = '.') {
    try {
      const gitInstance = simpleGit(dir);
      await gitInstance.status();
      return true;
    } catch {
      return false;
    }
  },

  // Check if directory is a submodule
  async isSubmodule(dir) {
    try {
      await fs.access(path.join(dir, '.git'));
      return true;
    } catch {
      return false;
    }
  },

  // Get current branch
  async getCurrentBranch(dir = '.') {
    const gitInstance = simpleGit(dir);
    const status = await gitInstance.status();
    return status.current || null;
  },

  // Get default branch (main/master)
  async getDefaultBranch(dir = '.') {
    const gitInstance = simpleGit(dir);
    try {
      const result = await gitInstance.raw(['symbolic-ref', 'refs/remotes/origin/HEAD']);
      return result.trim().replace('refs/remotes/origin/', '');
    } catch {
      // Fallback to checking which exists
      const branches = await gitInstance.branch();
      if (branches.all.includes('origin/main')) return 'main';
      if (branches.all.includes('origin/master')) return 'master';
      return 'main'; // Default assumption
    }
  },

  // Check for uncommitted changes
  async hasUncommittedChanges(dir = '.') {
    const gitInstance = simpleGit(dir);
    const status = await gitInstance.status();
    return !status.isClean();
  },

  // Get list of submodules from .gitmodules
  async getSubmodules() {
    try {
      const gitmodulesContent = await fs.readFile('.gitmodules', 'utf-8');
      const submodules = [];
      const lines = gitmodulesContent.split('\n');
      
      let currentSubmodule = null;
      for (const line of lines) {
        if (line.startsWith('[submodule')) {
          const name = line.match(/\[submodule "(.+)"\]/)?.[1];
          if (name) {
            currentSubmodule = { name };
            submodules.push(currentSubmodule);
          }
        } else if (currentSubmodule) {
          if (line.includes('path =')) {
            currentSubmodule.path = line.split('=')[1].trim();
          } else if (line.includes('url =')) {
            currentSubmodule.url = line.split('=')[1].trim();
          }
        }
      }
      
      return submodules;
    } catch (error) {
      return [];
    }
  },

  // Fetch latest changes
  async fetch(dir = '.', remote = 'origin') {
    const gitInstance = simpleGit(dir);
    await gitInstance.fetch(remote);
  },

  // Pull latest changes
  async pull(dir = '.', remote = 'origin', branch = null) {
    const gitInstance = simpleGit(dir);
    if (branch) {
      await gitInstance.pull(remote, branch);
    } else {
      await gitInstance.pull();
    }
  },

  // Create and checkout new branch
  async createBranch(branchName, dir = '.') {
    const gitInstance = simpleGit(dir);
    await gitInstance.checkoutLocalBranch(branchName);
  },

  // Checkout existing branch
  async checkout(branch, dir = '.') {
    const gitInstance = simpleGit(dir);
    await gitInstance.checkout(branch);
  },

  // Push to remote
  async push(dir = '.', setUpstream = false, branch = null) {
    const gitInstance = simpleGit(dir);
    const currentBranch = branch || (await this.getCurrentBranch(dir));
    
    if (setUpstream) {
      await gitInstance.push(['-u', 'origin', currentBranch]);
    } else {
      await gitInstance.push('origin', currentBranch);
    }
  },

  // Add files
  async add(files = '.', dir = '.') {
    const gitInstance = simpleGit(dir);
    await gitInstance.add(files);
  },

  // Commit changes
  async commit(message, dir = '.') {
    const gitInstance = simpleGit(dir);
    await gitInstance.commit(message);
  },

  // Get remote branches
  async getRemoteBranches(dir = '.') {
    const gitInstance = simpleGit(dir);
    const branches = await gitInstance.branch(['-r']);
    return branches.all.map(b => b.replace('origin/', ''));
  },

  // Get local branches
  async getLocalBranches(dir = '.') {
    const gitInstance = simpleGit(dir);
    const branches = await gitInstance.branchLocal();
    return branches.all;
  },

  // Check if branch exists locally
  async branchExists(branchName, dir = '.') {
    const branches = await this.getLocalBranches(dir);
    return branches.includes(branchName);
  },

  // Check if remote branch exists
  async remoteBranchExists(branchName, dir = '.') {
    const branches = await this.getRemoteBranches(dir);
    return branches.includes(branchName);
  },

  // Get merged branches
  async getMergedBranches(targetBranch, dir = '.') {
    const gitInstance = simpleGit(dir);
    const result = await gitInstance.raw(['branch', '--merged', targetBranch]);
    return result
      .split('\n')
      .map(b => b.trim().replace('* ', ''))
      .filter(b => b && !['main', 'master', 'develop'].includes(b));
  },

  // Delete local branch
  async deleteBranch(branchName, dir = '.', force = false) {
    const gitInstance = simpleGit(dir);
    if (force) {
      await gitInstance.deleteLocalBranch(branchName, true);
    } else {
      await gitInstance.deleteLocalBranch(branchName);
    }
  },

  // Prune remote branches
  async pruneRemote(dir = '.', remote = 'origin') {
    const gitInstance = simpleGit(dir);
    await gitInstance.raw(['remote', 'prune', remote]);
  },

  // Stash changes
  async stash(message = null, dir = '.') {
    const gitInstance = simpleGit(dir);
    if (message) {
      await gitInstance.stash(['push', '-m', message]);
    } else {
      await gitInstance.stash();
    }
  },

  // Initialize submodules
  async initSubmodules() {
    await git.submoduleInit();
  },

  // Update submodules
  async updateSubmodules() {
    await git.submoduleUpdate();
  },

  // Add submodule
  async addSubmodule(url, path) {
    await git.submoduleAdd(url, path);
  },

  // Get submodule status
  async getSubmoduleStatus() {
    const result = await git.raw(['submodule', 'status']);
    return result.split('\n').filter(line => line.trim());
  },

  // Check if path is already a submodule according to .gitmodules
  async isRegisteredSubmodule(path) {
    try {
      const result = await git.raw(['config', '--file', '.gitmodules', '--get-regexp', '^submodule\\..*\\.path$']);
      const lines = result.split('\n').filter(line => line.trim());
      return lines.some(line => line.includes(path));
    } catch {
      return false;
    }
  },
};

// GitHub CLI helpers
export const githubHelpers = {
  // Check if gh CLI is installed
  async isGhInstalled() {
    try {
      await execa('gh', ['--version']);
      return true;
    } catch {
      return false;
    }
  },

  // Check if gh is authenticated
  async isAuthenticated() {
    try {
      await execa('gh', ['auth', 'status']);
      return true;
    } catch {
      return false;
    }
  },

  // Create PR
  async createPR(title, body, base = null, draft = false, dir = '.') {
    const args = ['pr', 'create', '--title', title, '--body', body];
    
    if (base) {
      args.push('--base', base);
    }
    
    if (draft) {
      args.push('--draft');
    }
    
    const { stdout } = await execa('gh', args, { cwd: dir });
    
    // Extract PR number from output
    const prNumber = stdout.match(/#(\d+)/)?.[1];
    const prUrl = stdout.match(/https:\/\/[^\s]+/)?.[0];
    
    return { number: prNumber, url: prUrl };
  },

  // Check if PR exists for current branch
  async getPRForBranch(branch, dir = '.') {
    try {
      const { stdout } = await execa('gh', [
        'pr', 'list',
        '--head', branch,
        '--json', 'number,url',
        '--jq', '.[0]'
      ], { cwd: dir });
      
      if (stdout) {
        return JSON.parse(stdout);
      }
      return null;
    } catch {
      return null;
    }
  },

  // Update PR
  async updatePR(prNumber, title, body, dir = '.') {
    await execa('gh', [
      'pr', 'edit', prNumber,
      '--title', title,
      '--body', body
    ], { cwd: dir });
  },

  // View PR
  async viewPR(prNumber = null, dir = '.') {
    const args = ['pr', 'view'];
    if (prNumber) {
      args.push(prNumber);
    }
    args.push('--json', 'url', '--jq', '.url');
    
    const { stdout } = await execa('gh', args, { cwd: dir });
    return stdout.trim();
  },

  // List PRs
  async listPRs(dir = '.') {
    const { stdout } = await execa('gh', [
      'pr', 'list',
      '--json', 'number,title,state',
      '--jq', '.[] | "\\(.number): \\(.title) (\\(.state))"'
    ], { cwd: dir });
    
    return stdout.split('\n').filter(line => line.trim());
  },
};