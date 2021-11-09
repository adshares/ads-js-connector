let config = require('./config/config.json')
if (process.env.BUILD) {
  try {
    const devConfig = require(`./config/config.json.${process.env.BUILD}`)
    config = {
      ...config,
      ...devConfig,
    }
  } catch (error) {}
}
export default config
