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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJTeW5jIiwiZGVmYXVsdHMiLCJ2aWV3UHJpb3JpdHkiLCJnZXRUaW1lIiwicHJvY2VzcyIsImhydGltZSIsInN0YXJ0VGltZSIsInRpbWUiLCJwZXJmb3JtYW5jZSIsIm5vdyIsImNvbmZpZ3VyZSIsIl9yZWFkeSIsIl9yZXBvcnRMaXN0ZW5lcnMiLCJnZXRBdWRpb1RpbWUiLCJiaW5kIiwiZ2V0TG9jYWxUaW1lIiwiZ2V0U3luY1RpbWUiLCJfc3luY1N0YXR1c1JlcG9ydCIsInNlbmRGdW5jdGlvbiIsImFyZ3MiLCJzZW5kIiwicmVjZWl2ZUZ1bmN0aW9uIiwicmVjZWl2ZSIsImNhbGxiYWNrIiwiX3N5bmMiLCJvcHRpb25zIiwic3RhcnQiLCJzeW5jVGltZSIsImF1ZGlvVGltZSIsInB1c2giLCJyZXBvcnQiLCJzdGF0dXMiLCJmb3JFYWNoIiwicmVhZHkiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxhQUFhLGNBQW5COztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXlCTUMsSTs7O0FBQ0osa0JBQWM7QUFBQTs7QUFBQSxrSUFDTkQsVUFETSxFQUNNLElBRE47O0FBR1osUUFBTUUsV0FBVztBQUNmQyxvQkFBYyxDQURDO0FBRWZDLGVBQVUsWUFBVztBQUNuQixZQUFJQyxXQUFXQSxRQUFRQyxNQUF2QixFQUErQjtBQUM3QixjQUFNQyxZQUFZRixRQUFRQyxNQUFSLEVBQWxCOztBQUVBLGlCQUFPLFlBQU07QUFDWCxnQkFBTUUsT0FBT0gsUUFBUUMsTUFBUixDQUFlQyxTQUFmLENBQWI7QUFDQSxtQkFBT0MsS0FBSyxDQUFMLElBQVVBLEtBQUssQ0FBTCxJQUFVLElBQTNCO0FBQ0QsV0FIRDtBQUlELFNBUEQsTUFPTztBQUNMLGlCQUFPO0FBQUEsbUJBQU1DLFlBQVlDLEdBQVosRUFBTjtBQUFBLFdBQVA7QUFDRDtBQUNGLE9BWFE7QUFZVDtBQWRlLEtBQWpCOztBQWlCQSxVQUFLQyxTQUFMLENBQWVULFFBQWY7O0FBRUEsVUFBS1UsTUFBTCxHQUFjLEtBQWQ7QUFDQSxVQUFLQyxnQkFBTCxHQUF3QixFQUF4Qjs7QUFFQSxVQUFLQyxZQUFMLEdBQW9CLE1BQUtBLFlBQUwsQ0FBa0JDLElBQWxCLE9BQXBCO0FBQ0EsVUFBS0MsWUFBTCxHQUFvQixNQUFLQSxZQUFMLENBQWtCRCxJQUFsQixPQUFwQjtBQUNBLFVBQUtFLFdBQUwsR0FBbUIsTUFBS0EsV0FBTCxDQUFpQkYsSUFBakIsT0FBbkI7QUFDQSxVQUFLRyxpQkFBTCxHQUF5QixNQUFLQSxpQkFBTCxDQUF1QkgsSUFBdkIsT0FBekI7QUE1Qlk7QUE2QmI7O0FBRUQ7Ozs7OzRCQUNRO0FBQUE7O0FBQ047O0FBRUEsVUFBTUksZUFBZSxTQUFmQSxZQUFlO0FBQUEsMENBQUlDLElBQUo7QUFBSUEsY0FBSjtBQUFBOztBQUFBLGVBQWEsT0FBS0MsSUFBTCxnQkFBVSxNQUFWLFNBQXFCRCxJQUFyQixFQUFiO0FBQUEsT0FBckI7QUFDQSxVQUFNRSxrQkFBa0IsU0FBbEJBLGVBQWtCO0FBQUEsZUFBWSxPQUFLQyxPQUFMLENBQWEsTUFBYixFQUFxQkMsUUFBckIsQ0FBWjtBQUFBLE9BQXhCOztBQUVBLFdBQUtDLEtBQUwsR0FBYSxxQkFBZSxLQUFLQyxPQUFMLENBQWF0QixPQUE1QixDQUFiO0FBQ0EsV0FBS3FCLEtBQUwsQ0FBV0UsS0FBWCxDQUFpQlIsWUFBakIsRUFBK0JHLGVBQS9CLEVBQWdELEtBQUtKLGlCQUFyRDtBQUNEOztBQUVEOzs7OzJCQUNPO0FBQ0w7QUFDRDs7QUFFRDs7Ozs7Ozs7OztpQ0FPYVUsUSxFQUFVO0FBQ3JCLGFBQU8sS0FBS0gsS0FBTCxDQUFXVCxZQUFYLENBQXdCWSxRQUF4QixDQUFQO0FBQ0Q7OztpQ0FFWUEsUSxFQUFVO0FBQ3JCLGFBQU8sS0FBS0gsS0FBTCxDQUFXVCxZQUFYLENBQXdCWSxRQUF4QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Z0NBT1lDLFMsRUFBVztBQUNyQixhQUFPLEtBQUtKLEtBQUwsQ0FBV1IsV0FBWCxDQUF1QlksU0FBdkIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7O2dDQUlZTCxRLEVBQVU7QUFDcEIsV0FBS1gsZ0JBQUwsQ0FBc0JpQixJQUF0QixDQUEyQk4sUUFBM0I7QUFDRDs7O3NDQUVpQk8sTSxFQUFRO0FBQ3hCLFVBQUlBLE9BQU9DLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0NELE9BQU9DLE1BQVAsS0FBa0IsTUFBdEQsRUFBOEQ7QUFDNUQsYUFBS25CLGdCQUFMLENBQXNCb0IsT0FBdEIsQ0FBOEIsVUFBQ1QsUUFBRDtBQUFBLGlCQUFlQSxTQUFTTyxNQUFULENBQWY7QUFBQSxTQUE5Qjs7QUFFQSxZQUFJLENBQUMsS0FBS25CLE1BQVYsRUFBa0I7QUFDaEIsZUFBS0EsTUFBTCxHQUFjLElBQWQ7QUFDQSxlQUFLc0IsS0FBTDtBQUNEO0FBQ0Y7QUFDRjs7Ozs7QUFJSCx5QkFBZUMsUUFBZixDQUF3Qm5DLFVBQXhCLEVBQW9DQyxJQUFwQzs7a0JBRWVBLEkiLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFN5bmNNb2R1bGUgZnJvbSAnc3luYy9jbGllbnQnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c3luYyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnc3luYydgIHNlcnZpY2UuXG4gKlxuICogVGhlIGBzeW5jYCBzZXJ2aWNlIHN5bmNocm9uaXplcyB0aGUgbG9jYWwgYXVkaW8gY2xvY2sgb2YgdGhlIGNsaWVudCB3aXRoIHRoZVxuICogY2xvY2sgb2YgdGhlIHNlcnZlciAobWFzdGVyIGNsb2NrKS4gSXQgaW50ZXJuYWxseSByZWxpZXMgb24gdGhlIGBXZWJBdWRpb2BcbiAqIGNsb2NrIGFuZCB0aGVuIHJlcXVpcmVzIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UgdG8gYWNjZXNzIHRoaXMgZmVhdHVyZS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHNcbiAqIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlN5bmN9Kl9fXG4gKlxuICogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZVxuICogaW5zdGFuY2lhdGVkIG1hbnVhbGx5X1xuICpcbiAqIF9Ob3RlOl8gdGhlIHNlcnZpY2UgaXMgYmFzZWQgb25cbiAqIFtgZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luY2BdKGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc3luYykuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZCwgdHJhbnNsYXRlIHRoZSBzeW5jIHRpbWUgaW4gbG9jYWwgdGltZVxuICogY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcbiAqIGNvbnN0IGxvY2FsVGltZSA9IHRoaXMuc3luYy5nZXRBdWRpb1RpbWUoc3luY1RpbWUpO1xuICovXG5jbGFzcyBTeW5jIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICB2aWV3UHJpb3JpdHk6IDMsXG4gICAgICBnZXRUaW1lOiAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChwcm9jZXNzICYmIHByb2Nlc3MuaHJ0aW1lKSB7XG4gICAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gcHJvY2Vzcy5ocnRpbWUoKTtcblxuICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aW1lID0gcHJvY2Vzcy5ocnRpbWUoc3RhcnRUaW1lKTtcbiAgICAgICAgICAgIHJldHVybiB0aW1lWzBdICsgdGltZVsxXSAqIDFlLTk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKCkgPT4gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIH1cbiAgICAgIH0pKCksXG4gICAgICAvLyBAdG9kbyAtIGFkZCBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc3luYyBzZXJ2aWNlXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX3JlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzID0gW107XG5cbiAgICB0aGlzLmdldEF1ZGlvVGltZSA9IHRoaXMuZ2V0QXVkaW9UaW1lLmJpbmQodGhpcyk7XG4gICAgdGhpcy5nZXRMb2NhbFRpbWUgPSB0aGlzLmdldExvY2FsVGltZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZ2V0U3luY1RpbWUgPSB0aGlzLmdldFN5bmNUaW1lLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fc3luY1N0YXR1c1JlcG9ydCA9IHRoaXMuX3N5bmNTdGF0dXNSZXBvcnQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgY29uc3Qgc2VuZEZ1bmN0aW9uID0gKC4uLmFyZ3MpID0+IHRoaXMuc2VuZCgncGluZycsIC4uLmFyZ3MpO1xuICAgIGNvbnN0IHJlY2VpdmVGdW5jdGlvbiA9IGNhbGxiYWNrID0+IHRoaXMucmVjZWl2ZSgncG9uZycsIGNhbGxiYWNrKTtcblxuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY01vZHVsZSh0aGlzLm9wdGlvbnMuZ2V0VGltZSk7XG4gICAgdGhpcy5fc3luYy5zdGFydChzZW5kRnVuY3Rpb24sIHJlY2VpdmVGdW5jdGlvbiwgdGhpcy5fc3luY1N0YXR1c1JlcG9ydCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0aW1lIGluIHRoZSBsb2NhbCBjbG9jay4gSWYgbm8gYXJndW1lbnRzIHByb3ZpZGVkLFxuICAgKiByZXR1cm5zIHRoZSBjdXJyZW50IGxvY2FsIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzeW5jVGltZSAtIFRpbWUgZnJvbSB0aGUgc3luYyBjbG9jayAoaW4gX3NlY29uZHNfKS5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIExvY2FsIHRpbWUgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW5cbiAgICogIGBzeW5jVGltZWAgKGluIF9zZWNvbmRzXykuXG4gICAqL1xuICBnZXRBdWRpb1RpbWUoc3luY1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRMb2NhbFRpbWUoc3luY1RpbWUpO1xuICB9XG5cbiAgZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0TG9jYWxUaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRpbWUgaW4gdGhlIHN5bmMgY2xvY2suIElmIG5vIGFyZ3VtZW50cyBwcm92aWRlZCxcbiAgICogcmV0dXJucyB0aGUgY3VycmVudCBzeW5jIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhdWRpb1RpbWUgLSBUaW1lIGZyb20gdGhlIGxvY2FsIGNsb2NrIChpbiBfc2Vjb25kc18pLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gU3luYyB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuXG4gICAqICBgYXVkaW9UaW1lYCAoaW4gX3NlY29uZHNfKS5cbiAgICovXG4gIGdldFN5bmNUaW1lKGF1ZGlvVGltZSkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKGF1ZGlvVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gdGhlIHN5bmNocm9uaXphdGlvbiByZXBvcnRzIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIGFkZExpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fcmVwb3J0TGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgX3N5bmNTdGF0dXNSZXBvcnQocmVwb3J0KSB7XG4gICAgaWYgKHJlcG9ydC5zdGF0dXMgPT09ICd0cmFpbmluZycgfHwgcmVwb3J0LnN0YXR1cyA9PT0gJ3N5bmMnKSB7XG4gICAgICB0aGlzLl9yZXBvcnRMaXN0ZW5lcnMuZm9yRWFjaCgoY2FsbGJhY2spID0+ICBjYWxsYmFjayhyZXBvcnQpKTtcblxuICAgICAgaWYgKCF0aGlzLl9yZWFkeSkge1xuICAgICAgICB0aGlzLl9yZWFkeSA9IHRydWU7XG4gICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTeW5jKTtcblxuZXhwb3J0IGRlZmF1bHQgU3luYztcbiJdfQ==