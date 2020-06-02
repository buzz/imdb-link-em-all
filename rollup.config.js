import path from 'path'
import alias from '@rollup/plugin-alias'
import babel from 'rollup-plugin-babel'
import image from '@rollup/plugin-image'
import metablock from 'rollup-plugin-userscript-metablock'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import precss from 'precss'

const pkg = require('./package.json')

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.jsx',
  output: {
    file: 'dist/imdb-link-em-all.user.js',
    format: 'iife',
  },
  plugins: [
    metablock({
      override: {
        author: pkg.author,
        description: pkg.description,
        version: pkg.version,
      },
    }),
    alias({
      entries: [
        {
          find: pkg.name,
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    }),
    resolve({
      browser: true,
      extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
    }),
    postcss({
      parser: 'sugarss',
      plugins: [precss()],
      modules: true,
      minimize: production,
      sourceMap: production ? 'false' : 'inline',
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    image(),
    production && terser(),
  ],
}
