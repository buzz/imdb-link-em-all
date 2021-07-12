import path from 'path'
import alias from '@rollup/plugin-alias'
import babel from 'rollup-plugin-babel'
import image from '@rollup/plugin-image'
import json from '@rollup/plugin-json'
import metablock from 'rollup-plugin-userscript-metablock'
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import precss from 'precss'

const pkg = require('./package.json')

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
      entries: [
        {
          find: pkg.name,
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
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
    replace({
      __SITES_URL__: production ? pkg.config.sitesUrl : 'http://localhost:8001/sites.json',
      include: 'src/constants.js',
      preventAssignment: true,
    }),
    metablock({
      override: {
        author: pkg.author,
        description: pkg.description,
        version: pkg.version,
      },
    }),
  ],
}
