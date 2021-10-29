export default class Ads {

  constructor (testnet = false) {
    this.testnet = testnet
    this.port = null
    this.initialized = false
    this.queue = []
    // const iframeOrigin = 'https://connect.adshares.net'
    this.iframeOrigin = 'http://localhost:63342/ads-js-connector/public'
  }

  #uuidv4 () {
    /*eslint no-bitwise: ["error", { "allow": ["|", "&" ] }]*/
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : ((r & 0x3) | 0x8)
      return v.toString(16)
    })
  }

  #init () {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel()
      channel.port1.onmessage = event => this.#onMessage(event)
      channel.port1.start()

      if (this.port) {
        return this.initialized ?
          resolve(channel.port2) :
          reject('ADS Connector is not ready yet')
      }

      const iframe = document.createElement('iframe')
      iframe.src = this.iframeOrigin + '/index.html'
      iframe.setAttribute('style', 'display:none')
      document.body.appendChild(iframe)

      iframe.addEventListener('load', () => {
        // pass the port of message channel to the iframe
        this.initialized = true
        resolve(channel.port2)
      })
      this.port = iframe.contentWindow
    })
  }

  #onMessage (event) {
    if (!event.data || !event.data.id) {
      throw new Error('ADS Connector: malformed message')
    }
    const item = this.queue.find(r => r.id === event.data.id)
    if (event.data.error) {
      if (!item || !item.reject) {
        throw new Error(`ADS Connector: cannot reject message ${event.data.id}`)
      }
      item.reject(`${event.data.error.code}: ${event.data.error.message}`)
    }
    else if (!item || !item.resolve) {
      throw new Error(`ADS Connector: cannot resolve message ${event.data.id}`)
    }
    item.resolve(event.data.data)
  }

  #sendMessage (type, data, options = {}) {
    return new Promise((resolve, reject) => {
      this.#init().then(port => {
        const id = this.#uuidv4()
        this.queue.push({ id, resolve, reject })
        this.port.postMessage({
          id,
          testnet: this.testnet,
          type,
          data,
          options,
        }, '*', [port])
      }, reject)
    })
  }

  /**
   * Get info about ADS Wallet
   *
   * @returns {Promise<unknown>}
   */
  getInfo () {
    return this.#sendMessage('info')
  }

  /**
   * Ping ADS Wallet
   *
   * @param nonce
   * @returns {Promise<unknown>}
   */
  ping (nonce = '') {
    return this.#sendMessage('ping', nonce)
  }

  /**
   * Authenticate with ADS Wallet
   *
   * @param nonce
   * @returns {Promise<unknown>}
   */
  authenticate (nonce = '') {
    return this.#sendMessage('authenticate', { nonce })
  }

  /**
   * Broadcast a message on ADS network
   *
   * @param message
   * @returns {Promise<unknown>}
   */
  broadcast (message) {
    return this.#sendMessage('broadcast', { message })
  }

  /**
   * Send payment to one destination account on ADS network
   *
   * @param recipient
   * @param amount
   * @param message
   * @returns {Promise<unknown>}
   */
  sendOne (recipient, amount, message = '') {
    return this.#sendMessage('sendOne', { recipient, amount, message })
  }

}
