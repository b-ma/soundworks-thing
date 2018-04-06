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

var _wavesAudio = require('waves-audio');

var audio = _interopRequireWildcard(_wavesAudio);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var audioScheduler = audio.getScheduler();

var SyncTimeSchedulingQueue = function (_audio$SchedulingQueu) {
  (0, _inherits3.default)(SyncTimeSchedulingQueue, _audio$SchedulingQueu);

  function SyncTimeSchedulingQueue(sync, scheduler) {
    (0, _classCallCheck3.default)(this, SyncTimeSchedulingQueue);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SyncTimeSchedulingQueue.__proto__ || (0, _getPrototypeOf2.default)(SyncTimeSchedulingQueue)).call(this));

    _this.sync = sync;
    _this.scheduler = scheduler;
    _this.scheduler.add(_this, Infinity);
    _this.nextSyncTime = Infinity;

    // call this.resync in sync callback
    _this.resync = _this.resync.bind(_this);
    _this.sync.addListener(_this.resync);
    return _this;
  }

  (0, _createClass3.default)(SyncTimeSchedulingQueue, [{
    key: 'advanceTime',
    value: function advanceTime(audioTime) {
      var nextSyncTime = (0, _get3.default)(SyncTimeSchedulingQueue.prototype.__proto__ || (0, _getPrototypeOf2.default)(SyncTimeSchedulingQueue.prototype), 'advanceTime', this).call(this, this.nextSyncTime);
      var nextAudioTime = this.sync.getAudioTime(nextSyncTime);

      this.nextSyncTime = nextSyncTime;

      return nextAudioTime;
    }
  }, {
    key: 'resetTime',
    value: function resetTime(syncTime) {
      if (syncTime === undefined) syncTime = this.sync.getSyncTime();

      this.nextSyncTime = syncTime;

      var audioTime = this.sync.getAudioTime(syncTime);
      this.master.resetEngineTime(this, audioTime);
    }
  }, {
    key: 'resync',
    value: function resync() {
      if (this.nextSyncTime !== Infinity) {
        var nextAudioTime = this.sync.getAudioTime(this.nextSyncTime);
        this.master.resetEngineTime(this, nextAudioTime);
      } else {
        this.master.resetEngineTime(this, Infinity);
      }
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this.sync.getSyncTime(this.scheduler.currentTime);
    }
  }]);
  return SyncTimeSchedulingQueue;
}(audio.SchedulingQueue);

var SERVICE_ID = 'service:sync-scheduler';

/**
 * Interface for the client `'sync-scheduler'` service.
 *
 * The `sync-scheduler` provides a scheduler synchronised among all client using the
 * [`sync`]{@link module:soundworks/client.Sync} service.
 *
 * While this service has no direct server counterpart, its dependency on the
 * [`sync`]{@link module:soundworks/client.Sync} service which requires the
 * existence of a server.
 *
 * @param {Object} options
 * @param {Number} [options.period] - Period of the scheduler (defauts to
 *  current value).
 * @param {Number} [options.lookahead] - Lookahead of the scheduler (defauts
 *  to current value).
 *
 * @memberof module:soundworks/client
 * @see [`wavesAudio.Scheduler`]{@link http://wavesjs.github.io/audio/#audio-scheduler}
 * @see [`platform` service]{@link module:soundworks/client.Platform}
 * @see [`sync` service]{@link module:soundworks/client.Sync}
 *
 * @example
 * // inside the experience constructor
 * this.syncScheduler = this.require('scheduler');
 *
 * // when the experience has started
 * const nextSyncTime = this.syncScheduler.current + 2;
 * this.syncScheduler.add(timeEngine, nextSyncTime);
 */

var SyncScheduler = function (_Service) {
  (0, _inherits3.default)(SyncScheduler, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function SyncScheduler() {
    (0, _classCallCheck3.default)(this, SyncScheduler);

    // initialize sync option
    var _this2 = (0, _possibleConstructorReturn3.default)(this, (SyncScheduler.__proto__ || (0, _getPrototypeOf2.default)(SyncScheduler)).call(this, SERVICE_ID, false));

    _this2._sync = null;
    _this2._syncedQueue = null;

    // init audio time based scheduler, sync service, and queue
    // this._platform = this.require('platform', { features: 'web-audio' });
    _this2._sync = _this2.require('sync');
    _this2._syncedQueue = null;
    return _this2;
  }

  /** @private */


  (0, _createClass3.default)(SyncScheduler, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(SyncScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(SyncScheduler.prototype), 'start', this).call(this);

      this._syncedQueue = new SyncTimeSchedulingQueue(this._sync, audioScheduler);
      this.ready();
    }

    /**
     * Current audio time of the scheduler.
     * @instance
     * @type {Number}
     */

  }, {
    key: 'getSyncTimeAtAudioTime',


    /**
     * Get sync time corresponding to given audio time.
     *
     * @param  {Number} audioTime - audio time.
     * @return {Number} - sync time corresponding to given audio time.
     */
    value: function getSyncTimeAtAudioTime(audioTime) {
      return this._sync.getSyncTime(audioTime);
    }

    /**
     * Get audio time corresponding to given sync time.
     *
     * @param  {Number} syncTime - sync time.
     * @return {Number} - audio time corresponding to given sync time.
     */

  }, {
    key: 'getAudioTimeAtSyncTime',
    value: function getAudioTimeAtSyncTime(syncTime) {
      return this._sync.getAudioTime(syncTime);
    }

    /**
     * Call a function at a given time.
     *
     * @param {Function} fun - Function to be deferred.
     * @param {Number} time - The time at which the function should be executed.
     * @param {Boolean} [lookahead=false] - Defines whether the function is called
     *  anticipated (e.g. for audio events) or precisely at the given time (default).
     */

  }, {
    key: 'defer',
    value: function defer(fun, time) {
      var lookahead = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var scheduler = this._syncedQueue;
      var schedulerService = this;
      var engine = void 0;

      if (lookahead) {
        scheduler.defer(fun, time);
      } else {
        engine = {
          advanceTime: function advanceTime(time) {
            var delta = schedulerService.deltaTime;

            if (delta > 0) setTimeout(fun, 1000 * delta, time); // bridge scheduler lookahead with timeout
            else fun(time);
          }
        };

        scheduler.add(engine, time); // add without checks
      }
    }

    /**
     * Add a time engine to the queue.
     *
     * @param {Function} engine - Engine to schedule.
     * @param {Number} time - The time at which the function should be executed.
     */

  }, {
    key: 'add',
    value: function add(engine, time) {
      this._syncedQueue.add(engine, time);
    }

    /**
     * Remove the given engine from the queue.
     *
     * @param {Function} engine - Engine to remove from the scheduler.
     */

  }, {
    key: 'remove',
    value: function remove(engine) {
      this._syncedQueue.remove(engine);
    }

    /**
     * Remove all scheduled functions and time engines from the scheduler.
     */

  }, {
    key: 'clear',
    value: function clear() {
      this._syncedQueue.clear();
    }
  }, {
    key: 'audioTime',
    get: function get() {
      return audioScheduler.currentTime;
    }

    /**
     * Current sync time of the scheduler.
     * @instance
     * @type {Number}
     */

  }, {
    key: 'syncTime',
    get: function get() {
      return this._syncedQueue.currentTime;
    }

    /**
     * Current sync time of the scheduler (alias `this.syncTime`).
     * @instance
     * @type {Number}
     */

  }, {
    key: 'currentTime',
    get: function get() {
      return this._syncedQueue.currentTime;
    }

    /**
     * Difference between the scheduler's logical audio time and the `currentTime`
     * of the audio context.
     * @instance
     * @type {Number}
     */

  }, {
    key: 'deltaTime',
    get: function get() {
      return audioScheduler.currentTime - audio.audioContext.currentTime;
    }
  }]);
  return SyncScheduler;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SyncScheduler);

exports.default = SyncScheduler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIl0sIm5hbWVzIjpbImF1ZGlvIiwiYXVkaW9TY2hlZHVsZXIiLCJnZXRTY2hlZHVsZXIiLCJTeW5jVGltZVNjaGVkdWxpbmdRdWV1ZSIsInN5bmMiLCJzY2hlZHVsZXIiLCJhZGQiLCJJbmZpbml0eSIsIm5leHRTeW5jVGltZSIsInJlc3luYyIsImJpbmQiLCJhZGRMaXN0ZW5lciIsImF1ZGlvVGltZSIsIm5leHRBdWRpb1RpbWUiLCJnZXRBdWRpb1RpbWUiLCJzeW5jVGltZSIsInVuZGVmaW5lZCIsImdldFN5bmNUaW1lIiwibWFzdGVyIiwicmVzZXRFbmdpbmVUaW1lIiwiY3VycmVudFRpbWUiLCJTY2hlZHVsaW5nUXVldWUiLCJTRVJWSUNFX0lEIiwiU3luY1NjaGVkdWxlciIsIl9zeW5jIiwiX3N5bmNlZFF1ZXVlIiwicmVxdWlyZSIsInJlYWR5IiwiZnVuIiwidGltZSIsImxvb2thaGVhZCIsInNjaGVkdWxlclNlcnZpY2UiLCJlbmdpbmUiLCJkZWZlciIsImFkdmFuY2VUaW1lIiwiZGVsdGEiLCJkZWx0YVRpbWUiLCJzZXRUaW1lb3V0IiwicmVtb3ZlIiwiY2xlYXIiLCJhdWRpb0NvbnRleHQiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxLOzs7Ozs7QUFDWixJQUFNQyxpQkFBaUJELE1BQU1FLFlBQU4sRUFBdkI7O0lBRU1DLHVCOzs7QUFDSixtQ0FBWUMsSUFBWixFQUFrQkMsU0FBbEIsRUFBNkI7QUFBQTs7QUFBQTs7QUFHM0IsVUFBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsVUFBS0MsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxVQUFLQSxTQUFMLENBQWVDLEdBQWYsUUFBeUJDLFFBQXpCO0FBQ0EsVUFBS0MsWUFBTCxHQUFvQkQsUUFBcEI7O0FBRUE7QUFDQSxVQUFLRSxNQUFMLEdBQWMsTUFBS0EsTUFBTCxDQUFZQyxJQUFa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QVVDLEdBQVYsQ0FBYzBCLE1BQWQsRUFBc0JILElBQXRCLEVBWkssQ0FZd0I7QUFDOUI7QUFDRjs7QUFFRDs7Ozs7Ozs7O3dCQU1JRyxNLEVBQVFILEksRUFBTTtBQUNoQixXQUFLSixZQUFMLENBQWtCbkIsR0FBbEIsQ0FBc0IwQixNQUF0QixFQUE4QkgsSUFBOUI7QUFDRDs7QUFFRDs7Ozs7Ozs7MkJBS09HLE0sRUFBUTtBQUNiLFdBQUtQLFlBQUwsQ0FBa0JhLE1BQWxCLENBQXlCTixNQUF6QjtBQUNEOztBQUVEOzs7Ozs7NEJBR1E7QUFDTixXQUFLUCxZQUFMLENBQWtCYyxLQUFsQjtBQUNEOzs7d0JBM0dlO0FBQ2QsYUFBT3RDLGVBQWVtQixXQUF0QjtBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLZTtBQUNiLGFBQU8sS0FBS0ssWUFBTCxDQUFrQkwsV0FBekI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS2tCO0FBQ2hCLGFBQU8sS0FBS0ssWUFBTCxDQUFrQkwsV0FBekI7QUFDRDs7QUFFRDs7Ozs7Ozs7O3dCQU1nQjtBQUNkLGFBQU9uQixlQUFlbUIsV0FBZixHQUE2QnBCLE1BQU13QyxZQUFOLENBQW1CcEIsV0FBdkQ7QUFDRDs7Ozs7QUFnRkgseUJBQWVxQixRQUFmLENBQXdCbkIsVUFBeEIsRUFBb0NDLGFBQXBDOztrQkFFZUEsYSIsImZpbGUiOiJzZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgKiBhcyBhdWRpbyBmcm9tICd3YXZlcy1hdWRpbyc7XG5jb25zdCBhdWRpb1NjaGVkdWxlciA9IGF1ZGlvLmdldFNjaGVkdWxlcigpO1xuXG5jbGFzcyBTeW5jVGltZVNjaGVkdWxpbmdRdWV1ZSBleHRlbmRzIGF1ZGlvLlNjaGVkdWxpbmdRdWV1ZSB7XG4gIGNvbnN0cnVjdG9yKHN5bmMsIHNjaGVkdWxlcikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN5bmMgPSBzeW5jO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgIHRoaXMuc2NoZWR1bGVyLmFkZCh0aGlzLCBJbmZpbml0eSk7XG4gICAgdGhpcy5uZXh0U3luY1RpbWUgPSBJbmZpbml0eTtcblxuICAgIC8vIGNhbGwgdGhpcy5yZXN5bmMgaW4gc3luYyBjYWxsYmFja1xuICAgIHRoaXMucmVzeW5jID0gdGhpcy5yZXN5bmMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN5bmMuYWRkTGlzdGVuZXIodGhpcy5yZXN5bmMpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRUaW1lICgpIHtcbiAgICByZXR1cm4gdGhpcy5zeW5jLmdldFN5bmNUaW1lKHRoaXMuc2NoZWR1bGVyLmN1cnJlbnRUaW1lKTtcbiAgfVxuXG4gIGFkdmFuY2VUaW1lKGF1ZGlvVGltZSkge1xuICAgIGNvbnN0IG5leHRTeW5jVGltZSA9IHN1cGVyLmFkdmFuY2VUaW1lKHRoaXMubmV4dFN5bmNUaW1lKTtcbiAgICBjb25zdCBuZXh0QXVkaW9UaW1lID0gdGhpcy5zeW5jLmdldEF1ZGlvVGltZShuZXh0U3luY1RpbWUpO1xuXG4gICAgdGhpcy5uZXh0U3luY1RpbWUgPSBuZXh0U3luY1RpbWU7XG5cbiAgICByZXR1cm4gbmV4dEF1ZGlvVGltZTtcbiAgfVxuXG4gIHJlc2V0VGltZShzeW5jVGltZSkge1xuICAgIGlmIChzeW5jVGltZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcblxuICAgIHRoaXMubmV4dFN5bmNUaW1lID0gc3luY1RpbWU7XG5cbiAgICBjb25zdCBhdWRpb1RpbWUgPSB0aGlzLnN5bmMuZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKTtcbiAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgYXVkaW9UaW1lKTtcbiAgfVxuXG4gIHJlc3luYygpIHtcbiAgICBpZiAodGhpcy5uZXh0U3luY1RpbWUgIT09IEluZmluaXR5KSB7XG4gICAgICBjb25zdCBuZXh0QXVkaW9UaW1lID0gdGhpcy5zeW5jLmdldEF1ZGlvVGltZSh0aGlzLm5leHRTeW5jVGltZSk7XG4gICAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgbmV4dEF1ZGlvVGltZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWFzdGVyLnJlc2V0RW5naW5lVGltZSh0aGlzLCBJbmZpbml0eSk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzeW5jLXNjaGVkdWxlcic7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnc3luYy1zY2hlZHVsZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoZSBgc3luYy1zY2hlZHVsZXJgIHByb3ZpZGVzIGEgc2NoZWR1bGVyIHN5bmNocm9uaXNlZCBhbW9uZyBhbGwgY2xpZW50IHVzaW5nIHRoZVxuICogW2BzeW5jYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlN5bmN9IHNlcnZpY2UuXG4gKlxuICogV2hpbGUgdGhpcyBzZXJ2aWNlIGhhcyBubyBkaXJlY3Qgc2VydmVyIGNvdW50ZXJwYXJ0LCBpdHMgZGVwZW5kZW5jeSBvbiB0aGVcbiAqIFtgc3luY2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TeW5jfSBzZXJ2aWNlIHdoaWNoIHJlcXVpcmVzIHRoZVxuICogZXhpc3RlbmNlIG9mIGEgc2VydmVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucGVyaW9kXSAtIFBlcmlvZCBvZiB0aGUgc2NoZWR1bGVyIChkZWZhdXRzIHRvXG4gKiAgY3VycmVudCB2YWx1ZSkuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubG9va2FoZWFkXSAtIExvb2thaGVhZCBvZiB0aGUgc2NoZWR1bGVyIChkZWZhdXRzXG4gKiAgdG8gY3VycmVudCB2YWx1ZSkuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQHNlZSBbYHdhdmVzQXVkaW8uU2NoZWR1bGVyYF17QGxpbmsgaHR0cDovL3dhdmVzanMuZ2l0aHViLmlvL2F1ZGlvLyNhdWRpby1zY2hlZHVsZXJ9XG4gKiBAc2VlIFtgcGxhdGZvcm1gIHNlcnZpY2Vde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAqIEBzZWUgW2BzeW5jYCBzZXJ2aWNlXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU3luY31cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnN5bmNTY2hlZHVsZXIgPSB0aGlzLnJlcXVpcmUoJ3NjaGVkdWxlcicpO1xuICpcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWRcbiAqIGNvbnN0IG5leHRTeW5jVGltZSA9IHRoaXMuc3luY1NjaGVkdWxlci5jdXJyZW50ICsgMjtcbiAqIHRoaXMuc3luY1NjaGVkdWxlci5hZGQodGltZUVuZ2luZSwgbmV4dFN5bmNUaW1lKTtcbiAqL1xuY2xhc3MgU3luY1NjaGVkdWxlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICAvLyBpbml0aWFsaXplIHN5bmMgb3B0aW9uXG4gICAgdGhpcy5fc3luYyA9IG51bGw7XG4gICAgdGhpcy5fc3luY2VkUXVldWUgPSBudWxsO1xuXG4gICAgLy8gaW5pdCBhdWRpbyB0aW1lIGJhc2VkIHNjaGVkdWxlciwgc3luYyBzZXJ2aWNlLCBhbmQgcXVldWVcbiAgICAvLyB0aGlzLl9wbGF0Zm9ybSA9IHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7IGZlYXR1cmVzOiAnd2ViLWF1ZGlvJyB9KTtcbiAgICB0aGlzLl9zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG4gICAgdGhpcy5fc3luY2VkUXVldWUgPSBudWxsO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLl9zeW5jZWRRdWV1ZSA9IG5ldyBTeW5jVGltZVNjaGVkdWxpbmdRdWV1ZSh0aGlzLl9zeW5jLCBhdWRpb1NjaGVkdWxlcik7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgYXVkaW8gdGltZSBvZiB0aGUgc2NoZWR1bGVyLlxuICAgKiBAaW5zdGFuY2VcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBhdWRpb1RpbWUoKSB7XG4gICAgcmV0dXJuIGF1ZGlvU2NoZWR1bGVyLmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgc3luYyB0aW1lIG9mIHRoZSBzY2hlZHVsZXIuXG4gICAqIEBpbnN0YW5jZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHN5bmNUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jZWRRdWV1ZS5jdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXJyZW50IHN5bmMgdGltZSBvZiB0aGUgc2NoZWR1bGVyIChhbGlhcyBgdGhpcy5zeW5jVGltZWApLlxuICAgKiBAaW5zdGFuY2VcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBjdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luY2VkUXVldWUuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogRGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBzY2hlZHVsZXIncyBsb2dpY2FsIGF1ZGlvIHRpbWUgYW5kIHRoZSBgY3VycmVudFRpbWVgXG4gICAqIG9mIHRoZSBhdWRpbyBjb250ZXh0LlxuICAgKiBAaW5zdGFuY2VcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBkZWx0YVRpbWUoKSB7XG4gICAgcmV0dXJuIGF1ZGlvU2NoZWR1bGVyLmN1cnJlbnRUaW1lIC0gYXVkaW8uYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBzeW5jIHRpbWUgY29ycmVzcG9uZGluZyB0byBnaXZlbiBhdWRpbyB0aW1lLlxuICAgKlxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGF1ZGlvVGltZSAtIGF1ZGlvIHRpbWUuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBzeW5jIHRpbWUgY29ycmVzcG9uZGluZyB0byBnaXZlbiBhdWRpbyB0aW1lLlxuICAgKi9cbiAgZ2V0U3luY1RpbWVBdEF1ZGlvVGltZShhdWRpb1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZShhdWRpb1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhdWRpbyB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gZ2l2ZW4gc3luYyB0aW1lLlxuICAgKlxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHN5bmNUaW1lIC0gc3luYyB0aW1lLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gYXVkaW8gdGltZSBjb3JyZXNwb25kaW5nIHRvIGdpdmVuIHN5bmMgdGltZS5cbiAgICovXG4gIGdldEF1ZGlvVGltZUF0U3luY1RpbWUoc3luY1RpbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRBdWRpb1RpbWUoc3luY1RpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGwgYSBmdW5jdGlvbiBhdCBhIGdpdmVuIHRpbWUuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1biAtIEZ1bmN0aW9uIHRvIGJlIGRlZmVycmVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIFRoZSB0aW1lIGF0IHdoaWNoIHRoZSBmdW5jdGlvbiBzaG91bGQgYmUgZXhlY3V0ZWQuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2xvb2thaGVhZD1mYWxzZV0gLSBEZWZpbmVzIHdoZXRoZXIgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZFxuICAgKiAgYW50aWNpcGF0ZWQgKGUuZy4gZm9yIGF1ZGlvIGV2ZW50cykgb3IgcHJlY2lzZWx5IGF0IHRoZSBnaXZlbiB0aW1lIChkZWZhdWx0KS5cbiAgICovXG4gIGRlZmVyKGZ1biwgdGltZSwgbG9va2FoZWFkID0gZmFsc2UpIHtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSB0aGlzLl9zeW5jZWRRdWV1ZTtcbiAgICBjb25zdCBzY2hlZHVsZXJTZXJ2aWNlID0gdGhpcztcbiAgICBsZXQgZW5naW5lO1xuXG4gICAgaWYobG9va2FoZWFkKSB7XG4gICAgICBzY2hlZHVsZXIuZGVmZXIoZnVuLCB0aW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW5naW5lID0ge1xuICAgICAgICBhZHZhbmNlVGltZTogZnVuY3Rpb24odGltZSkge1xuICAgICAgICAgIGNvbnN0IGRlbHRhID0gc2NoZWR1bGVyU2VydmljZS5kZWx0YVRpbWU7XG5cbiAgICAgICAgICBpZihkZWx0YSA+IDApXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1biwgMTAwMCAqIGRlbHRhLCB0aW1lKTsgLy8gYnJpZGdlIHNjaGVkdWxlciBsb29rYWhlYWQgd2l0aCB0aW1lb3V0XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZnVuKHRpbWUpO1xuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgc2NoZWR1bGVyLmFkZChlbmdpbmUsIHRpbWUpOyAvLyBhZGQgd2l0aG91dCBjaGVja3NcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgdGltZSBlbmdpbmUgdG8gdGhlIHF1ZXVlLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlbmdpbmUgLSBFbmdpbmUgdG8gc2NoZWR1bGUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gVGhlIHRpbWUgYXQgd2hpY2ggdGhlIGZ1bmN0aW9uIHNob3VsZCBiZSBleGVjdXRlZC5cbiAgICovXG4gIGFkZChlbmdpbmUsIHRpbWUpIHtcbiAgICB0aGlzLl9zeW5jZWRRdWV1ZS5hZGQoZW5naW5lLCB0aW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIGdpdmVuIGVuZ2luZSBmcm9tIHRoZSBxdWV1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZW5naW5lIC0gRW5naW5lIHRvIHJlbW92ZSBmcm9tIHRoZSBzY2hlZHVsZXIuXG4gICAqL1xuICByZW1vdmUoZW5naW5lKSB7XG4gICAgdGhpcy5fc3luY2VkUXVldWUucmVtb3ZlKGVuZ2luZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBzY2hlZHVsZWQgZnVuY3Rpb25zIGFuZCB0aW1lIGVuZ2luZXMgZnJvbSB0aGUgc2NoZWR1bGVyLlxuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5fc3luY2VkUXVldWUuY2xlYXIoKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTeW5jU2NoZWR1bGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgU3luY1NjaGVkdWxlcjtcbiJdfQ==