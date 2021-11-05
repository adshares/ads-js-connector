import Ads from '@adshares/ads-client'

function sendErrorMessage (port, id, error) {
  port.postMessage({
    id,
    error: {
      code: error.code || 500,
      message: error.message || 'Unknown error',
      data: error.data,
    },
  })
}

function handleMessage (port, message) {
  const wallet = new Ads.Wallet('CHROME_EXTENSION_ID', 'MOZILLA_EXTENSION_ID', message.testnet)
  const client = new Ads.Client(message.testnet)
  switch (message.type) {
    case 'walletInfo':
      return wallet.getInfo()
    case 'pingWallet':
      return wallet.ping(message.data.data)
    case 'clientInfo':
      return client.getInfo()
    case 'pingClient':
      return client.ping(message.data.data)
    case 'authenticate':
      return wallet.authenticate(message.data.nonce, message.data.hostname, true)
    case 'broadcast':
      return wallet.broadcast(message.data.message)
    case 'sendOne':
      return wallet.sendOne(message.data.recipient, message.data.amount, message.data.message)
  }
}

window.addEventListener('message', event => {
  const port = event.ports[0]
  if (port && event.data && event.data.id) {
    try {
      handleMessage(port, event.data).then(
        data => port.postMessage({ id: event.data.id, data }),
        error => sendErrorMessage(port, event.data.id, error),
      )
    }
    catch (err) {
      sendErrorMessage(port, event.data.id, err)
    }
  }
})
