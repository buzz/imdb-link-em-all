const path = require('path')
const pkg = require('./package.json')

module.exports = {
  env: {
    browser: true,
    es6: true,
    greasemonkey: true,
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  globals: {
    preact: true,
    GM: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['prettier', 'react', 'react-hooks'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
    'no-unused-vars': ['error', { varsIgnorePattern: '^Fragment$' }],
  },
  settings: {
    'import/core-modules': ['preact', 'preact/hooks'],
    'import/resolver': {
      alias: {
        map: [[pkg.name, path.resolve(__dirname, 'src')]],
        extensions: ['.js', '.jsx'],
      },
    },
    react: {
      pragma: 'h',
      version: '16.2',
    },
  },
}
