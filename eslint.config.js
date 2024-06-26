/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
module.exports = [
  ...require('@atmina/linting/eslint/recommended'),
  require('@atmina/linting/eslint/tailwind'),
  require('@atmina/linting/eslint/react'),
  {ignores: ['out/**/*']},
];
