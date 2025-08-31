import chalk from 'chalk';

// Color utilities for consistent output
export const colors = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blue,
  dim: chalk.gray,
  bold: chalk.bold,
};

// Icons for different message types
export const icons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  rocket: '🚀',
  package: '📦',
  sync: '🔄',
  branch: '🌱',
  pr: '📤',
  cleanup: '🧹',
  check: '✓',
  cross: '✗',
  arrow: '→',
  dot: '•',
};

// Log helper functions
export const log = {
  success: (message) => console.log(colors.success(`${icons.success} ${message}`)),
  error: (message) => console.log(colors.error(`${icons.error} ${message}`)),
  warning: (message) => console.log(colors.warning(`${icons.warning} ${message}`)),
  info: (message) => console.log(colors.info(`${icons.info} ${message}`)),
  dim: (message) => console.log(colors.dim(message)),
  
  section: (title) => {
    console.log('\n' + colors.bold(colors.info(title)));
    console.log(colors.dim('='.repeat(title.length)));
  },
  
  item: (message) => console.log(`  ${icons.dot} ${message}`),
  
  newline: () => console.log(),
};