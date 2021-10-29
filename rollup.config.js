import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import htmlTemplate from 'rollup-plugin-generate-html-template'

export default [
  {
    input: 'src/connector.js',
    output: {
      name: 'Ads',
      file: 'public/dist/ads-connector.js',
      format: 'iife',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        exclude: ['node_modules/**'],
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
    ],
  },
  {
    input: 'src/main.js',
    output: {
      name: 'AdsConnector',
      file: 'public/main.js',
      format: 'iife',
      globals: {
        crypto: 'Crypto',
      },
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'runtime',
        exclude: ['node_modules/**'],
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
      htmlTemplate({
        template: 'src/index.html',
        target: 'public/index.html',
      }),
    ],
  },
]
