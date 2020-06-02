const path = require('path')
const pkg = require('./package.json')

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  globals: {
    browser: true,
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
    'react/prop-types': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [[pkg.name, path.resolve(__dirname, 'src')]],
        extensions: ['.jsx'],
      },
    },
    react: {
      pragma: 'h',
      version: '16',
    },
  },
}
