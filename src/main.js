import Ads from '@adshares/ads-client'

const wallet = new Ads.Wallet();

function getErrorMessage (id, error) {
  return {
    id,
    error: {
      code: error.code || 500,
      message: error.message || 'Unknown error',
      data: error.data,
    },
  }
}

function sendErrorMessage (port, id, error) {
  console.log('Error:', id, error)
  port.postMessage(getErrorMessage(id, error))
}

function handleMessage (port, message) {
  console.log('Received message:', message)
  throw Error('ok');
  // handleProxyApiMessage(message, portId, (data) => {
  //   if (!connections[portId]) {
  //     throw new PostMessageError(`Cannot find connection ${portId}`, 500);
  //   }
  //   connections[portId].postMessage({ type: types.MSG_RESPONSE, id: message.id, data });
  // });
}

window.addEventListener('message', event => {
  const port = event.ports[0]
  if (port && event.data && event.data.id) {
    console.log('init channel')
    try {
      handleMessage(port, event.data)
    }
    catch (err) {
      sendErrorMessage(port, event.data.id, err)
    }
  }
})
