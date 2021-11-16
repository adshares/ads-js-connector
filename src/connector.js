export default class AdsConnector {
  static loaded = false

  static load (callback) {
    const script = document.createElement('script')
    script.setAttribute('src', 'WALLET_JS_URL')
    script.addEventListener('load', () => {
      AdsConnector.loaded = true
      callback && callback()
    })
    document.head.appendChild(script)
  }

  static ready (callback) {
    if (AdsConnector.loaded) {
      callback && callback()
    } else {
      AdsConnector.load(callback)
    }
  }
}

AdsConnector.load()
