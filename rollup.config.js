import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy'
import markdown from '@jackfranklin/rollup-plugin-markdown'
import config from './config/config'
import pkg from './package.json'

const plugins = [
  replace({
    preventAssignment: true,
    WALLET_JS_URL: config.walletJsUrl,
    CHROME_EXTENSION_ID: config.chromeExtensionId,
    MOZILLA_EXTENSION_ID: config.mozillaExtensionId
  }),
  resolve(),
  commonjs(),
  babel({
    babelHelpers: 'runtime',
    exclude: ['node_modules/**'],
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-transform-runtime']
  })
]

export default [
  {
    input: 'src/connector.js',
    output: {
      name: 'AdsConnector',
      file: 'public/dist/connector.js',
      format: 'iife'
    },
    plugins
  },
  {
    input: 'src/connector.js',
    output: {
      name: 'AdsConnector',
      file: 'public/dist/connector.min.js',
      format: 'iife'
    },
    plugins: [
      ...plugins,
      terser()
    ]
  },
  {
    input: 'src/wallet.js',
    output: {
      name: 'AdsWallet',
      file: 'public/dist/wallet.js',
      format: 'iife'
    },
    plugins: [
      ...plugins
    ]
  },
  {
    input: 'src/wallet.js',
    output: {
      name: 'AdsWallet',
      file: 'public/dist/wallet.min.js',
      format: 'iife'
    },
    plugins: [
      ...plugins,
      terser()
    ]
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/wallet.js',
    external: [
      /@babel\/runtime/
    ],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'default'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins: [
      ...plugins
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'public/index.js'
    },
    plugins: [
      markdown(),
      terser(),
      copy({
        targets: [
          {
            src: 'LICENSE',
            dest: 'public'
          }
        ]
      })
    ]
  }
]
