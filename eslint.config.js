import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import js from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import babelParser from '@babel/eslint-parser'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = require('./package.json')

export default [
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.greasemonkey,
        preact: 'readonly',
        GM: 'readonly',
      },
    },
    settings: {
      react: {
        pragma: 'h',
        version: '16.2',
      },
      // Keep alias settings in case you add eslint-plugin-import later
      'import/core-modules': ['preact', 'preact/hooks'],
      'import/resolver': {
        alias: {
          map: [[pkg.name, path.resolve(__dirname, 'src')]],
          extensions: ['.js', '.jsx'],
        },
      },
    },
    rules: {
      'no-console': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^Fragment$' }],
    },
  },

  // Disable formatting rules that conflict with Prettier (must be last)
  prettierConfig,
]
