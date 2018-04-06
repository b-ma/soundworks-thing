'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _client = require('sync/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:sync';

/**
 * Interface for the client `'sync'` service.
 *
 * The `sync` service synchronizes the local audio clock of the client with the
 * clock of the server (master clock). It internally relies on the `WebAudio`
 * clock and then requires the `platform` service to access this feature.
 *
 * __*The service must be used with its
 * [server-side counterpart]{@link module:soundworks/server.Sync}*__
 *
 * _<span class="warning">__WARNING__</span> This class should never be
 * instanciated manually_
 *
 * _Note:_ the service is based on
 * [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * @memberof module:soundworks/client
 *
 * @example
 * // inside the experience constructor
 * this.sync = this.require('sync');
 * // when the experience has started, translate the sync time in local time
 * const syncTime = this.sync.getSyncTime();
 * const localTime = this.sync.getAudioTime(syncTime);
 */

var Sync = function (_Service) {
  (0, _inherits3.default)(Sync, _Service);

  function Sync() {
    (0, _classCallCheck3.default)(this, Sync);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Sync.__proto__ || (0, _getPrototypeOf2.default)(Sync)).call(this, SERVICE_ID, true));

    var defaults = {
      viewPriority: 3,
      getTime: function () {
        if (process && process.hrtime) {
          var startTime = process.hrtime();

          return function () {
            var time = process.hrtime(startTime);
            return time[0] + time[1] * 1e-9;
          };
        } else {
          return function () {
            return performance.now();
          };
        }
      }()
      // @todo - add options to configure the sync service
    };

    _this.configure(defaults);

    _this._ready = false;
    _this._reportListeners = [];

    _this.getAudioTime = _this.getAudioTime.bind(_this);
    _this.getLocalTime = _this.getLocalTime.bind(_this);
    _this.getSyncTime = _this.getSyncTime.bind(_this);
    _this._syncStatusReport = _this._syncStatusReport.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Sync, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)(Sync.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sync.prototype), 'start', this).call(this);

      var sendFunction = function sendFunction() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _this2.send.apply(_this2, ['ping'].concat(args));
      };
      var receiveFunction = function receiveFunction(callback) {
        return _this2.receive('pong', callback);
      };

      this._sync = new _client2.default(this.options.getTime);
      this._sync.start(sendFunction, receiveFunction, this._syncStatusReport);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)(Sync.prototype.__proto__ || (0, _getPrototypeOf2.default)(Sync.prototype), 'stop', this).call(this);
    }

    /**
     * Return the time in the local clock. If no arguments provided,
     * returns the current local time.
     * @param {Number} syncTime - Time from the sync clock (in _seconds_).
     * @return {Number} - Local time corresponding to the given
     *  `syncTime` (in _seconds_).
     */

  }, {
    key: 'getAudioTime',
    value: function getAudioTime(syncTime) {
      return this._sync.getLocalTime(syncTime);
    }
  }, {
    key: 'getLocalTime',
    value: function getLocalTime(syncTime) {
      return this._sync.getLocalTime(syncTime);
    }

    /**
     * Return the time in the sync clock. If no arguments provided,
     * returns the current sync time.
     * @param {Number} audioTime - Time from the local clock (in _seconds_).
     * @return {Number} - Sync time corresponding to the given
     *  `audioTime` (in _seconds_).
     */

  }, {
    key: 'getSyncTime',
    value: function getSyncTime(audioTime) {
      return this._sync.getSyncTime(audioTime);
    }

    /**
     * Add a callback function to the synchronization reports from the server.
     * @param {Function} callback
     */

  }, {
    key: 'addListener',
    value: function addListener(callback) {
      this._reportListeners.push(callback);
    }
  }, {
    key: '_syncStatusReport',
    value: function _syncStatusReport(report) {
      if (report.status === 'training' || report.status === 'sync') {
        this._reportListeners.forEach(function (callback) {
          return callback(report);
        });

        if (!this._ready) {
          this._ready = true;
          this.ready();
        }
      }
    }
  }]);
  return Sync;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Sync);

exports.default = Sync;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIlN5bmMiLCJkZWZhdWx0cyIsInZpZXdQcmlvcml0eSIsImdldFRpbWUiLCJwcm9jZXNzIiwiaHJ0aW1lIiwic3RhcnRUaW1lIiwidGltZSIsInBlcmZvcm1hbmNlIiwibm93IiwiY29uZmlndXJlIiwiX3JlYWR5IiwiX3JlcG9ydExpc3RlbmVycyIsImdldEF1ZGlvVGltZSIsImJpbmQiLCJnZXRMb2NhbFRpbWUiLCJnZXRTeW5jVGltZSIsIl9zeW5jU3RhdHVzUmVwb3J0Iiwic2VuZEZ1bmN0aW9uIiwiYXJncyIsInNlbmQiLCJyZWNlaXZlRnVuY3Rpb24iLCJyZWNlaXZlIiwiY2FsbGJhY2siLCJfc3luYyIsIm9wdGlvbnMiLCJzdGFydCIsInN5bmNUaW1lIiwiYXVkaW9UaW1lIiwicHVzaCIsInJlcG9ydCIsInN0YXR1cyIsImZvckVhY2giLCJyZWFkeSIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsY0FBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBeUJNQyxJOzs7QUFDSixrQkFBYztBQUFBOztBQUFBLGtJQUNORCxVQURNLEVBQ00sSUFETjs7QUFHWixRQUFNRSxXQUFXO0FBQ2ZDLG9CQUFjLENBREM7QUFFZkMsZUFBVSxZQUFXO0FBQ25CLFlBQUlDLFdBQVdBLFFBQVFDLE1BQXZCLEVBQStCO0FBQzdCLGNBQU1DLFlBQVlGLFFBQVFDLE1BQVIsRUFBbEI7O0FBRUEsaUJBQU8sWUFBTTtBQUNYLGdCQUFNRSxPQUFPSCxRQUFRQyxNQUFSLENBQWVDLFNBQWYsQ0FBYjtBQUNBLG1CQUFPQyxLQUFLLENBQUwsSUFBVUEsS0FBSyxDQUFMLElBQVUsSUFBM0I7QUFDRCxXQUhEO0FBSUQsU0FQRCxNQU9PO0FBQ0wsaUJBQU87QUFBQSxtQkFBTUMsWUFBWUMsR0FBWixFQUFOO0FBQUEsV0FBUDtBQUNEO0FBQ0YsT0FYUTtBQVlUO0FBZGUsS0FBakI7O0FBaUJBLFVBQUtDLFNBQUwsQ0FBZVQsUUFBZjs7QUFFQSxVQUFLVSxNQUFMLEdBQWMsS0FBZDtBQUNBLFVBQUtDLGdCQUFMLEdBQXdCLEVBQXhCOztBQUVBLFVBQUtDLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQkMsSUFBbEIsT0FBcEI7QUFDQSxVQUFLQyxZQUFMLEdBQW9CLE1BQUtBLFlBQUwsQ0FBa0JELElBQWxCLE9BQXBCO0FBQ0EsVUFBS0UsV0FBTCxHQUFtQixNQUFLQSxXQUFMLENBQWlCRixJQUFqQixPQUFuQjtBQUNBLFVBQUtHLGlCQUFMLEdBQXlCLE1BQUtBLGlCQUFMLENBQXVCSCxJQUF2QixPQUF6QjtBQTVCWTtBQTZCYjs7QUFFRDs7Ozs7NEJBQ1E7QUFBQTs7QUFDTjs7QUFFQSxVQUFNSSxlQUFlLFNBQWZBLFlBQWU7QUFBQSwwQ0FBSUMsSUFBSjtBQUFJQSxjQUFKO0FBQUE7O0FBQUEsZUFBYSxPQUFLQyxJQUFMLGdCQUFVLE1BQVYsU0FBcUJELElBQXJCLEVBQWI7QUFBQSxPQUFyQjtBQUNBLFVBQU1FLGtCQUFrQixTQUFsQkEsZUFBa0I7QUFBQSxlQUFZLE9BQUtDLE9BQUwsQ0FBYSxNQUFiLEVBQXFCQyxRQUFyQixDQUFaO0FBQUEsT0FBeEI7O0FBRUEsV0FBS0MsS0FBTCxHQUFhLHFCQUFlLEtBQUtDLE9BQUwsQ0FBYXRCLE9BQTVCLENBQWI7QUFDQSxXQUFLcUIsS0FBTCxDQUFXRSxLQUFYLENBQWlCUixZQUFqQixFQUErQkcsZUFBL0IsRUFBZ0QsS0FBS0osaUJBQXJEO0FBQ0Q7O0FBRUQ7Ozs7MkJBQ087QUFDTDtBQUNEOztBQUVEOzs7Ozs7Ozs7O2lDQU9hVSxRLEVBQVU7QUFDckIsYUFBTyxLQUFLSCxLQUFMLENBQVdULFlBQVgsQ0FBd0JZLFFBQXhCLENBQVA7QUFDRDs7O2lDQUVZQSxRLEVBQVU7QUFDckIsYUFBTyxLQUFLSCxLQUFMLENBQVdULFlBQVgsQ0FBd0JZLFFBQXhCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OztnQ0FPWUMsUyxFQUFXO0FBQ3JCLGFBQU8sS0FBS0osS0FBTCxDQUFXUixXQUFYLENBQXVCWSxTQUF2QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Z0NBSVlMLFEsRUFBVTtBQUNwQixXQUFLWCxnQkFBTCxDQUFzQmlCLElBQXRCLENBQTJCTixRQUEzQjtBQUNEOzs7c0NBRWlCTyxNLEVBQVE7QUFDeEIsVUFBSUEsT0FBT0MsTUFBUCxLQUFrQixVQUFsQixJQUFnQ0QsT0FBT0MsTUFBUCxLQUFrQixNQUF0RCxFQUE4RDtBQUM1RCxhQUFLbkIsZ0JBQUwsQ0FBc0JvQixPQUF0QixDQUE4QixVQUFDVCxRQUFEO0FBQUEsaUJBQWVBLFNBQVNPLE1BQVQsQ0FBZjtBQUFBLFNBQTlCOztBQUVBLFlBQUksQ0FBQyxLQUFLbkIsTUFBVixFQUFrQjtBQUNoQixlQUFLQSxNQUFMLEdBQWMsSUFBZDtBQUNBLGVBQUtzQixLQUFMO0FBQ0Q7QUFDRjtBQUNGOzs7OztBQUlILHlCQUFlQyxRQUFmLENBQXdCbkMsVUFBeEIsRUFBb0NDLElBQXBDOztrQkFFZUEsSSIsImZpbGUiOiJTeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTeW5jTW9kdWxlIGZyb20gJ3N5bmMvY2xpZW50JztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnN5bmMnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ3N5bmMnYCBzZXJ2aWNlLlxuICpcbiAqIFRoZSBgc3luY2Agc2VydmljZSBzeW5jaHJvbml6ZXMgdGhlIGxvY2FsIGF1ZGlvIGNsb2NrIG9mIHRoZSBjbGllbnQgd2l0aCB0aGVcbiAqIGNsb2NrIG9mIHRoZSBzZXJ2ZXIgKG1hc3RlciBjbG9jaykuIEl0IGludGVybmFsbHkgcmVsaWVzIG9uIHRoZSBgV2ViQXVkaW9gXG4gKiBjbG9jayBhbmQgdGhlbiByZXF1aXJlcyB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlIHRvIGFjY2VzcyB0aGlzIGZlYXR1cmUuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzXG4gKiBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5TeW5jfSpfX1xuICpcbiAqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmVcbiAqIGluc3RhbmNpYXRlZCBtYW51YWxseV9cbiAqXG4gKiBfTm90ZTpfIHRoZSBzZXJ2aWNlIGlzIGJhc2VkIG9uXG4gKiBbYGdpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmNgXShodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmMpLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnN5bmMgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWQsIHRyYW5zbGF0ZSB0aGUgc3luYyB0aW1lIGluIGxvY2FsIHRpbWVcbiAqIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5zeW5jLmdldFN5bmNUaW1lKCk7XG4gKiBjb25zdCBsb2NhbFRpbWUgPSB0aGlzLnN5bmMuZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKTtcbiAqL1xuY2xhc3MgU3luYyBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgdmlld1ByaW9yaXR5OiAzLFxuICAgICAgZ2V0VGltZTogKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAocHJvY2VzcyAmJiBwcm9jZXNzLmhydGltZSkge1xuICAgICAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHByb2Nlc3MuaHJ0aW1lKCk7XG5cbiAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGltZSA9IHByb2Nlc3MuaHJ0aW1lKHN0YXJ0VGltZSk7XG4gICAgICAgICAgICByZXR1cm4gdGltZVswXSArIHRpbWVbMV0gKiAxZS05O1xuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICgpID0+IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICB9XG4gICAgICB9KSgpLFxuICAgICAgLy8gQHRvZG8gLSBhZGQgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHN5bmMgc2VydmljZVxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMuX3JlcG9ydExpc3RlbmVycyA9IFtdO1xuXG4gICAgdGhpcy5nZXRBdWRpb1RpbWUgPSB0aGlzLmdldEF1ZGlvVGltZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0TG9jYWxUaW1lID0gdGhpcy5nZXRMb2NhbFRpbWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldFN5bmNUaW1lID0gdGhpcy5nZXRTeW5jVGltZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQgPSB0aGlzLl9zeW5jU3RhdHVzUmVwb3J0LmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGNvbnN0IHNlbmRGdW5jdGlvbiA9ICguLi5hcmdzKSA9PiB0aGlzLnNlbmQoJ3BpbmcnLCAuLi5hcmdzKTtcbiAgICBjb25zdCByZWNlaXZlRnVuY3Rpb24gPSBjYWxsYmFjayA9PiB0aGlzLnJlY2VpdmUoJ3BvbmcnLCBjYWxsYmFjayk7XG5cbiAgICB0aGlzLl9zeW5jID0gbmV3IFN5bmNNb2R1bGUodGhpcy5vcHRpb25zLmdldFRpbWUpO1xuICAgIHRoaXMuX3N5bmMuc3RhcnQoc2VuZEZ1bmN0aW9uLCByZWNlaXZlRnVuY3Rpb24sIHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdGltZSBpbiB0aGUgbG9jYWwgY2xvY2suIElmIG5vIGFyZ3VtZW50cyBwcm92aWRlZCxcbiAgICogcmV0dXJucyB0aGUgY3VycmVudCBsb2NhbCB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc3luY1RpbWUgLSBUaW1lIGZyb20gdGhlIHN5bmMgY2xvY2sgKGluIF9zZWNvbmRzXykuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBMb2NhbCB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuXG4gICAqICBgc3luY1RpbWVgIChpbiBfc2Vjb25kc18pLlxuICAgKi9cbiAgZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG4gIGdldExvY2FsVGltZShzeW5jVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldExvY2FsVGltZShzeW5jVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLiBJZiBubyBhcmd1bWVudHMgcHJvdmlkZWQsXG4gICAqIHJldHVybnMgdGhlIGN1cnJlbnQgc3luYyB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gYXVkaW9UaW1lIC0gVGltZSBmcm9tIHRoZSBsb2NhbCBjbG9jayAoaW4gX3NlY29uZHNfKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIFN5bmMgdGltZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlblxuICAgKiAgYGF1ZGlvVGltZWAgKGluIF9zZWNvbmRzXykuXG4gICAqL1xuICBnZXRTeW5jVGltZShhdWRpb1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZShhdWRpb1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIHRoZSBzeW5jaHJvbml6YXRpb24gcmVwb3J0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBhZGRMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuX3JlcG9ydExpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIF9zeW5jU3RhdHVzUmVwb3J0KHJlcG9ydCkge1xuICAgIGlmIChyZXBvcnQuc3RhdHVzID09PSAndHJhaW5pbmcnIHx8IHJlcG9ydC5zdGF0dXMgPT09ICdzeW5jJykge1xuICAgICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzLmZvckVhY2goKGNhbGxiYWNrKSA9PiAgY2FsbGJhY2socmVwb3J0KSk7XG5cbiAgICAgIGlmICghdGhpcy5fcmVhZHkpIHtcbiAgICAgICAgdGhpcy5fcmVhZHkgPSB0cnVlO1xuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU3luYyk7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bmM7XG4iXX0=