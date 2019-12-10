import metablock from 'rollup-plugin-userscript-metablock'
import { terser } from 'rollup-plugin-terser'

const pkg = require('./package.json')

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/imdb-link-em-all.user.js',
    format: 'iife',
    globals: {
      jquery: '$',
    },
  },
  plugins: [
    metablock({
      override: {
        author: pkg.author,
        description: pkg.description,
        version: pkg.version,
      },
    }),
    production && terser(),
  ],
}
