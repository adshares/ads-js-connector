import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import config from './config/config'

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
  }
]
