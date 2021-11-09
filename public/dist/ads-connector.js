var Ads = (function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

  function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

  function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

  var _uuidv = /*#__PURE__*/new WeakSet();

  var _init = /*#__PURE__*/new WeakSet();

  var _onMessage = /*#__PURE__*/new WeakSet();

  var _sendMessage = /*#__PURE__*/new WeakSet();

  var Ads = /*#__PURE__*/function () {
    function Ads() {
      var testnet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      _classCallCheck(this, Ads);

      _classPrivateMethodInitSpec(this, _sendMessage);

      _classPrivateMethodInitSpec(this, _onMessage);

      _classPrivateMethodInitSpec(this, _init);

      _classPrivateMethodInitSpec(this, _uuidv);

      this.testnet = testnet;
      this.port = null;
      this.initialized = false;
      this.queue = [];
      this.iframeOrigin = 'https://connect.adshares.net';
    }

    _createClass(Ads, [{
      key: "isWalletInstalled",
      value:
      /**
       * Check if ADS Wallet is enabled
       *
       * @returns {Promise<boolean>}
       */
      function isWalletInstalled() {
        return _classPrivateMethodGet(this, _sendMessage, _sendMessage2).call(this, 'walletInstalled');
      }
      /**
       * Get info about ADS Wallet
       *
       * @returns {Promise<unknown>}
       */

    }, {
      key: "getWalletInfo",
      value: function getWalletInfo() {
        return _classPrivateMethodGet(this, _sendMessage, _sendMessage2).call(this, 'walletInfo');
      }
      /**
       * Ping ADS Wallet
       *
       * @param data
       * @returns {Promise<{data: string}>}
       */

    }, {
      key: "pingWallet",
      value: function pingWallet() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        return _classPrivateMethodGet(this, _sendMessage, _sendMessage2).call(this, 'pingWallet', {
          data: data
        });
      }
      /**
       * Get info about ADS client
       *
       * @returns {Promise<unknown>}
       */

    }, {
      key: "getClientInfo",
      value: function getClientInfo() {
        return _classPrivateMethodGet(this, _sendMessage, _sendMessage2).call(this, 'clientInfo');
      }
      /**
       * Ping ADS client
       *
       * @param data
       * @returns {Promise<{data: string}>}
       */

    }, {
      key: "pingClient",
      value: function pingClient() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        return _classPrivateMethodGet(this, _sendMessage, _sendMessage2).call(this, 'pingClient', {
          data: data
        });
      }
      /**
       * Authenticate with ADS Wallet
       *
       * @param nonce
       * @returns {Promise<unknown>}
       */

    }, {
      key: "authenticate",
      value: function authenticate() {
        var nonce = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        return _classPrivateMethodGet(this, _sendMessage, _sendMessage2).call(this, 'authenticate', {
          nonce: nonce,
          hostname: window.location.host
        });
      }
      /**
       * Broadcast a message on ADS network
       *
       * @param message
       * @returns {Promise<unknown>}
       */

    }, {
      key: "broadcast",
      value: function broadcast(message) {
        return _classPrivateMethodGet(this, _sendMessage, _sendMessage2).call(this, 'broadcast', {
          message: message
        });
      }
      /**
       * Send payment to one destination account on ADS network
       *
       * @param recipient
       * @param amount
       * @param message
       * @returns {Promise<unknown>}
       */

    }, {
      key: "sendOne",
      value: function sendOne(recipient, amount) {
        var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        return _classPrivateMethodGet(this, _sendMessage, _sendMessage2).call(this, 'sendOne', {
          recipient: recipient,
          amount: amount,
          message: message
        });
      }
    }]);

    return Ads;
  }();

  function _uuidv2() {
    /*eslint no-bitwise: ["error", { "allow": ["|", "&" ] }]*/
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }

  function _init2() {
    var _this = this;

    return new Promise(function (resolve, reject) {
      var channel = new MessageChannel();

      channel.port1.onmessage = function (event) {
        return _classPrivateMethodGet(_this, _onMessage, _onMessage2).call(_this, event);
      };

      channel.port1.start();

      if (_this.port) {
        return _this.initialized ? resolve(channel.port2) : reject('ADS Connector is not ready yet');
      }

      var iframe = document.createElement('iframe');
      iframe.src = _this.iframeOrigin + '/index.html';
      iframe.setAttribute('style', 'display:none');
      document.body.appendChild(iframe);
      iframe.addEventListener('load', function () {
        // pass the port of message channel to the iframe
        _this.initialized = true;
        resolve(channel.port2);
      });
      _this.port = iframe.contentWindow;
    });
  }

  function _onMessage2(event) {
    console.debug('#onMessage', event);

    if (!event.data || !event.data.id) {
      throw new Error('ADS Connector: malformed message');
    }

    var item = this.queue.find(function (r) {
      return r.id === event.data.id;
    });

    if (event.data.error) {
      if (!item || !item.reject) {
        throw new Error("ADS Connector: cannot reject message ".concat(event.data.id));
      }

      item.reject("".concat(event.data.error.code, ": ").concat(event.data.error.message));
    } else if (!item || !item.resolve) {
      throw new Error("ADS Connector: cannot resolve message ".concat(event.data.id));
    }

    item.resolve(event.data.data);
  }

  function _sendMessage2(type, data) {
    var _this2 = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return new Promise(function (resolve, reject) {
      _classPrivateMethodGet(_this2, _init, _init2).call(_this2).then(function (port) {
        var id = _classPrivateMethodGet(_this2, _uuidv, _uuidv2).call(_this2);

        _this2.queue.push({
          id: id,
          resolve: resolve,
          reject: reject
        });

        _this2.port.postMessage({
          id: id,
          testnet: _this2.testnet,
          type: type,
          data: data,
          options: options
        }, '*', [port]);
      }, reject);
    });
  }

  return Ads;

})();
