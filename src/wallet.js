import BaseWallet from '@adshares/ads-wallet'

export default class AdsWallet extends BaseWallet {
  constructor (testnet = false) {
    super('CHROME_EXTENSION_ID', 'MOZILLA_EXTENSION_ID', testnet)
  }

  authenticate (message) {
    return super.authenticate(message, window.location.hostname)
  }
}
