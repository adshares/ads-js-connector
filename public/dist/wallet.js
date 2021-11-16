var AdsWallet = (function () {
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

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get() {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(arguments.length < 3 ? target : receiver);
        }

        return desc.value;
      };
    }

    return _get.apply(this, arguments);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  var AdsWallet$1 = /*#__PURE__*/function () {
    function AdsWallet(chromeExtensionId, mozillaExtensionId) {
      var testnet = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      _classCallCheck(this, AdsWallet);

      this.chromeExtensionId = chromeExtensionId;
      this.mozillaExtensionId = mozillaExtensionId;
      this.testnet = testnet;
      this.port = null;
      this.initialized = false;
      this.queue = [];
    }

    _createClass(AdsWallet, [{
      key: "extensionUrl",
      value: function extensionUrl() {
        return typeof InstallTrigger !== 'undefined' ? "'moz-extension://".concat(this.mozillaExtensionId) : "chrome-extension://".concat(this.chromeExtensionId);
      }
    }, {
      key: "init",
      value: function init() {
        var _this = this;

        return new Promise(function (resolve, reject) {
          var isChromium = typeof window.chrome !== 'undefined';

          if (!isChromium) {
            reject(new Error('Your browser is not supported'));
          }

          if (_this.port) {
            return _this.initialized ? resolve(_this.port) : reject(new Error('ADS Wallet is not ready yet'));
          }

          var channel = new MessageChannel();
          _this.port = channel.port1;
          var timer;

          var onReady = function onReady(message) {
            // when the iframe is ready to receive messages, it will send the string 'ready'
            clearTimeout(timer);

            if (message.data && message.data === 'ready') {
              _this.port.removeEventListener('message', onReady);

              var base = _this;

              _this.port.onmessage = function (event) {
                return base.onMessage(event);
              };

              _this.initialized = true;
              resolve(_this.port);
            } else {
              reject(new Error('Failed to initialize connection with ADS Wallet'));
            }
          };

          _this.port.addEventListener('message', onReady);

          _this.port.start(); // create the iframe


          var iframe = document.createElement('iframe');
          iframe.src = "".concat(_this.extensionUrl(), "/proxy.html");
          iframe.setAttribute('style', 'display:none');
          document.body.appendChild(iframe);
          iframe.addEventListener('error', function () {
            clearTimeout(timer);
            reject(new Error('ADS Wallet is not installed'));
          });
          iframe.addEventListener('load', function () {
            // pass the port of message channel to the iframe
            timer = setTimeout(function () {
              return reject(new Error('ADS Wallet is not installed'));
            }, 100);
            iframe.contentWindow.postMessage('init', _this.extensionUrl(), [channel.port2]);
          });
          return null;
        });
      }
    }, {
      key: "onMessage",
      value: function onMessage(event) {
        if (!event.data || !event.data.id) {
          throw new Error('ADS Wallet: malformed message');
        }

        var item = this.queue.find(function (i) {
          return i.id === event.data.id;
        });

        if (event.data.error) {
          if (!item || !item.reject) {
            throw new Error("ADS Wallet: cannot reject message ".concat(event.data.id));
          }

          item.reject(new Error("".concat(event.data.error.code, ": ").concat(event.data.error.message)));
        } else if (!item || !item.resolve) {
          throw new Error("ADS Wallet: cannot resolve message ".concat(event.data.id));
        }

        item.resolve(event.data.data);
      }
    }, {
      key: "sendMessage",
      value: function sendMessage(type, data) {
        var _this2 = this;

        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return new Promise(function (resolve, reject) {
          _this2.init().then(function () {
            var id = AdsWallet.uuidv4();

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
            });
          }, reject);
        });
      }
    }, {
      key: "ping",
      value: function ping(data) {
        return this.sendMessage('ping', data);
      }
    }, {
      key: "getInfo",
      value: function getInfo() {
        return this.sendMessage('info');
      }
    }, {
      key: "authenticate",
      value: function authenticate(nonce, hostname) {
        return this.sendMessage('authenticate', {
          nonce: nonce,
          hostname: hostname
        }, {
          newTab: true
        });
      }
    }, {
      key: "signTransaction",
      value: function signTransaction(data, hash, publicKey) {
        return this.sendMessage('sign', {
          data: data,
          hash: hash,
          publicKey: publicKey
        }, {
          newTab: true
        });
      }
    }, {
      key: "broadcast",
      value: function broadcast(message) {
        return this.sendMessage('broadcast', {
          message: message
        });
      }
    }, {
      key: "sendOne",
      value: function sendOne(address, amount, message) {
        return this.sendMessage('send_one', {
          address: address,
          amount: amount,
          message: message
        });
      }
    }], [{
      key: "uuidv4",
      value: function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0;
          var v = c === 'x' ? r : r & 0x3 | 0x8;
          return v.toString(16);
        });
      }
    }]);

    return AdsWallet;
  }();

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var AdsWallet = /*#__PURE__*/function (_BaseWallet) {
    _inherits(AdsWallet, _BaseWallet);

    var _super = _createSuper(AdsWallet);

    function AdsWallet() {
      var testnet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      _classCallCheck(this, AdsWallet);

      return _super.call(this, 'plhalclcdonbmokpgbophapibncijdko', 'f6f321f2-9f13-403f-8832-7b593f35caa1', testnet);
    }

    _createClass(AdsWallet, [{
      key: "authenticate",
      value: function authenticate(nonce) {
        return _get(_getPrototypeOf(AdsWallet.prototype), "authenticate", this).call(this, nonce, window.location.hostname);
      }
    }]);

    return AdsWallet;
  }(AdsWallet$1);

  return AdsWallet;

})();
