const config = require('./config/config.json')

let envConfig
try {
  envConfig = require(`./config/config.${process.env.BUILD}.json`)
} catch (error) {
  envConfig = {}
}

export default {
  ...config,
  ...envConfig
}
