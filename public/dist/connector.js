var AdsConnector = (function () {
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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var AdsConnector = /*#__PURE__*/function () {
    function AdsConnector() {
      _classCallCheck(this, AdsConnector);
    }

    _createClass(AdsConnector, null, [{
      key: "load",
      value: function load(callback) {
        var script = document.createElement('script');
        script.setAttribute('src', '../public/dist/wallet.js');
        script.addEventListener('load', function () {
          AdsConnector.loaded = true;
          callback && callback();
        });
        document.head.appendChild(script);
      }
    }, {
      key: "ready",
      value: function ready(callback) {
        if (AdsConnector.loaded) {
          callback && callback();
        } else {
          AdsConnector.load(callback);
        }
      }
    }]);

    return AdsConnector;
  }();

  _defineProperty(AdsConnector, "loaded", false);
  AdsConnector.load();

  return AdsConnector;

})();
