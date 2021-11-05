import devConfig from './config.dev'

let config = {
  connectorOrigin: 'https://connect.adshares.net',
  chromeExtensionId: 'algblmhagnobbnmakepomicmfljlbehg',
  mozillaExtensionId: 'f6f321f2-9f13-403f-8832-7b593f35caa1',
}

if (process.env.BUILD === 'dev') {
  config = {
    ...config,
    ...devConfig,
  }
}

export default config
