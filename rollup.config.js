import path from 'path'
import alias from '@rollup/plugin-alias'
import babel from 'rollup-plugin-babel'
import image from '@rollup/plugin-image'
import json from '@rollup/plugin-json'
import metablock from 'rollup-plugin-userscript-metablock'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import precss from 'precss'

import pkg from './package.json' with { type: 'json' }
import jsconfig from './jsconfig.json' with { type: 'json' }

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.jsx',
  output: {
    file: 'imdb-link-em-all.user.js',
    format: 'iife',
    globals: {
      preact: 'preact',
      'preact/hooks': 'preactHooks',
    },
  },
  external: ['preact', 'preact/hooks'],
  plugins: [
    alias({
      entries: Object.entries(jsconfig.compilerOptions.paths).map(([key, [value]]) => ({
        find: key.replace('/*', ''),
        replacement: path.resolve(jsconfig.compilerOptions.baseUrl ?? '.', value.replace('/*', '')),
      })),
    }),
    resolve({
      extensions: ['.js', '.jsx'],
    }),
    postcss({
      parser: 'sugarss',
      plugins: [precss()],
      modules: true,
      minimize: false,
      sourceMap: production ? false : 'inline',
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    image(),
    json({ namedExports: true }),
    metablock({
      override: {
        author: pkg.author,
        description: pkg.description,
        version: pkg.version,
      },
    }),
  ],
}
