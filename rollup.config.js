import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import htmlTemplate from 'rollup-plugin-generate-html-template'
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import config from './config/config'

const dev = process.env.BUILD === 'dev';

const plugins = [
  replace({
    preventAssignment: true,
    'CONNECTOR_ORIGIN': config.connectorOrigin,
    'CHROME_EXTENSION_ID': config.chromeExtensionId,
    'MOZILLA_EXTENSION_ID': config.mozillaExtensionId
  }),
  resolve(),
  commonjs(),
  babel({
    babelHelpers: 'runtime',
    exclude: ['node_modules/**'],
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-transform-runtime'],
  }),
]

export default [
  {
    input: 'src/connector.js',
    output: {
      name: 'Ads',
      file: 'public/dist/ads-connector.js',
      format: 'iife',
    },
    plugins,
  },
  {
    input: 'src/connector.js',
    output: {
      name: 'Ads',
      file: 'public/dist/ads-connector.min.js',
      format: 'iife',
    },
    plugins: [
      ...plugins,
      terser(),
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
      ...plugins,
      htmlTemplate({
        template: 'src/index.html',
        target: 'public/index.html',
      }),
      dev ? null : terser(),
    ],
  },
]
