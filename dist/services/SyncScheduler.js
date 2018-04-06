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
    _this2._platform = _this2.require('platform', { features: 'web-audio' });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIl0sIm5hbWVzIjpbImF1ZGlvIiwiYXVkaW9TY2hlZHVsZXIiLCJnZXRTY2hlZHVsZXIiLCJTeW5jVGltZVNjaGVkdWxpbmdRdWV1ZSIsInN5bmMiLCJzY2hlZHVsZXIiLCJhZGQiLCJJbmZpbml0eSIsIm5leHRTeW5jVGltZSIsInJlc3luYyIsImJpbmQiLCJhZGRMaXN0ZW5lciIsImF1ZGlvVGltZSIsIm5leHRBdWRpb1RpbWUiLCJnZXRBdWRpb1RpbWUiLCJzeW5jVGltZSIsInVuZGVmaW5lZCIsImdldFN5bmNUaW1lIiwibWFzdGVyIiwicmVzZXRFbmdpbmVUaW1lIiwiY3VycmVudFRpbWUiLCJTY2hlZHVsaW5nUXVldWUiLCJTRVJWSUNFX0lEIiwiU3luY1NjaGVkdWxlciIsIl9zeW5jIiwiX3N5bmNlZFF1ZXVlIiwiX3BsYXRmb3JtIiwicmVxdWlyZSIsImZlYXR1cmVzIiwicmVhZHkiLCJmdW4iLCJ0aW1lIiwibG9va2FoZWFkIiwic2NoZWR1bGVyU2VydmljZSIsImVuZ2luZSIsImRlZmVyIiwiYWR2YW5jZVRpbWUiLCJkZWx0YSIsImRlbHRhVGltZSIsInNldFRpbWVvdXQiLCJyZW1vdmUiLCJjbGVhciIsImF1ZGlvQ29udGV4dCIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLEs7Ozs7OztBQUNaLElBQU1DLGlCQUFpQkQsTUFBTUUsWUFBTixFQUF2Qjs7SUFFTUMsdUI7OztBQUNKLG1DQUFZQyxJQUFaLEVBQWtCQyxTQUFsQixFQUE2QjtBQUFBOztBQUFBOztBQUczQixVQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxVQUFLQyxTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLFVBQUtBLFNBQUwsQ0FBZUMsR0FBZixRQUF5QkMsUUFBekI7QUFDQSxVQUFLQyxZQUFMLEdBQW9CRCxRQUFwQjs7QUFFQTtBQUNBLFVBQUtFLE1BQUwsR0FB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QUFYLEVBQWdCLE9BQU9PLEtBQXZCLEVBQThCTixJQUE5QixFQURGLENBQ3VDO0FBRHZDLGlCQUdFRCxJQUFJQyxJQUFKO0FBQ0g7QUFSTSxTQUFUOztBQVdBMUIsa0JBQVVDLEdBQVYsQ0FBYzRCLE1BQWQsRUFBc0JILElBQXRCLEVBWkssQ0FZd0I7QUFDOUI7QUFDRjs7QUFFRDs7Ozs7Ozs7O3dCQU1JRyxNLEVBQVFILEksRUFBTTtBQUNoQixXQUFLTixZQUFMLENBQWtCbkIsR0FBbEIsQ0FBc0I0QixNQUF0QixFQUE4QkgsSUFBOUI7QUFDRDs7QUFFRDs7Ozs7Ozs7MkJBS09HLE0sRUFBUTtBQUNiLFdBQUtULFlBQUwsQ0FBa0JlLE1BQWxCLENBQXlCTixNQUF6QjtBQUNEOztBQUVEOzs7Ozs7NEJBR1E7QUFDTixXQUFLVCxZQUFMLENBQWtCZ0IsS0FBbEI7QUFDRDs7O3dCQTNHZTtBQUNkLGFBQU94QyxlQUFlbUIsV0FBdEI7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS2U7QUFDYixhQUFPLEtBQUtLLFlBQUwsQ0FBa0JMLFdBQXpCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtrQjtBQUNoQixhQUFPLEtBQUtLLFlBQUwsQ0FBa0JMLFdBQXpCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozt3QkFNZ0I7QUFDZCxhQUFPbkIsZUFBZW1CLFdBQWYsR0FBNkJwQixNQUFNMEMsWUFBTixDQUFtQnRCLFdBQXZEO0FBQ0Q7Ozs7O0FBZ0ZILHlCQUFldUIsUUFBZixDQUF3QnJCLFVBQXhCLEVBQW9DQyxhQUFwQzs7a0JBRWVBLGEiLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0ICogYXMgYXVkaW8gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuY29uc3QgYXVkaW9TY2hlZHVsZXIgPSBhdWRpby5nZXRTY2hlZHVsZXIoKTtcblxuY2xhc3MgU3luY1RpbWVTY2hlZHVsaW5nUXVldWUgZXh0ZW5kcyBhdWRpby5TY2hlZHVsaW5nUXVldWUge1xuICBjb25zdHJ1Y3RvcihzeW5jLCBzY2hlZHVsZXIpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zeW5jID0gc3luYztcbiAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICB0aGlzLnNjaGVkdWxlci5hZGQodGhpcywgSW5maW5pdHkpO1xuICAgIHRoaXMubmV4dFN5bmNUaW1lID0gSW5maW5pdHk7XG5cbiAgICAvLyBjYWxsIHRoaXMucmVzeW5jIGluIHN5bmMgY2FsbGJhY2tcbiAgICB0aGlzLnJlc3luYyA9IHRoaXMucmVzeW5jLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zeW5jLmFkZExpc3RlbmVyKHRoaXMucmVzeW5jKTtcbiAgfVxuXG4gIGdldCBjdXJyZW50VGltZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3luYy5nZXRTeW5jVGltZSh0aGlzLnNjaGVkdWxlci5jdXJyZW50VGltZSk7XG4gIH1cblxuICBhZHZhbmNlVGltZShhdWRpb1RpbWUpIHtcbiAgICBjb25zdCBuZXh0U3luY1RpbWUgPSBzdXBlci5hZHZhbmNlVGltZSh0aGlzLm5leHRTeW5jVGltZSk7XG4gICAgY29uc3QgbmV4dEF1ZGlvVGltZSA9IHRoaXMuc3luYy5nZXRBdWRpb1RpbWUobmV4dFN5bmNUaW1lKTtcblxuICAgIHRoaXMubmV4dFN5bmNUaW1lID0gbmV4dFN5bmNUaW1lO1xuXG4gICAgcmV0dXJuIG5leHRBdWRpb1RpbWU7XG4gIH1cblxuICByZXNldFRpbWUoc3luY1RpbWUpIHtcbiAgICBpZiAoc3luY1RpbWUgPT09IHVuZGVmaW5lZClcbiAgICAgIHN5bmNUaW1lID0gdGhpcy5zeW5jLmdldFN5bmNUaW1lKCk7XG5cbiAgICB0aGlzLm5leHRTeW5jVGltZSA9IHN5bmNUaW1lO1xuXG4gICAgY29uc3QgYXVkaW9UaW1lID0gdGhpcy5zeW5jLmdldEF1ZGlvVGltZShzeW5jVGltZSk7XG4gICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIGF1ZGlvVGltZSk7XG4gIH1cblxuICByZXN5bmMoKSB7XG4gICAgaWYgKHRoaXMubmV4dFN5bmNUaW1lICE9PSBJbmZpbml0eSkge1xuICAgICAgY29uc3QgbmV4dEF1ZGlvVGltZSA9IHRoaXMuc3luYy5nZXRBdWRpb1RpbWUodGhpcy5uZXh0U3luY1RpbWUpO1xuICAgICAgdGhpcy5tYXN0ZXIucmVzZXRFbmdpbmVUaW1lKHRoaXMsIG5leHRBdWRpb1RpbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1hc3Rlci5yZXNldEVuZ2luZVRpbWUodGhpcywgSW5maW5pdHkpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c3luYy1zY2hlZHVsZXInO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ3N5bmMtc2NoZWR1bGVyJ2Agc2VydmljZS5cbiAqXG4gKiBUaGUgYHN5bmMtc2NoZWR1bGVyYCBwcm92aWRlcyBhIHNjaGVkdWxlciBzeW5jaHJvbmlzZWQgYW1vbmcgYWxsIGNsaWVudCB1c2luZyB0aGVcbiAqIFtgc3luY2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TeW5jfSBzZXJ2aWNlLlxuICpcbiAqIFdoaWxlIHRoaXMgc2VydmljZSBoYXMgbm8gZGlyZWN0IHNlcnZlciBjb3VudGVycGFydCwgaXRzIGRlcGVuZGVuY3kgb24gdGhlXG4gKiBbYHN5bmNgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU3luY30gc2VydmljZSB3aGljaCByZXF1aXJlcyB0aGVcbiAqIGV4aXN0ZW5jZSBvZiBhIHNlcnZlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnBlcmlvZF0gLSBQZXJpb2Qgb2YgdGhlIHNjaGVkdWxlciAoZGVmYXV0cyB0b1xuICogIGN1cnJlbnQgdmFsdWUpLlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmxvb2thaGVhZF0gLSBMb29rYWhlYWQgb2YgdGhlIHNjaGVkdWxlciAoZGVmYXV0c1xuICogIHRvIGN1cnJlbnQgdmFsdWUpLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBzZWUgW2B3YXZlc0F1ZGlvLlNjaGVkdWxlcmBde0BsaW5rIGh0dHA6Ly93YXZlc2pzLmdpdGh1Yi5pby9hdWRpby8jYXVkaW8tc2NoZWR1bGVyfVxuICogQHNlZSBbYHBsYXRmb3JtYCBzZXJ2aWNlXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19XG4gKiBAc2VlIFtgc3luY2Agc2VydmljZV17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlN5bmN9XG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zeW5jU2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdzY2hlZHVsZXInKTtcbiAqXG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkXG4gKiBjb25zdCBuZXh0U3luY1RpbWUgPSB0aGlzLnN5bmNTY2hlZHVsZXIuY3VycmVudCArIDI7XG4gKiB0aGlzLnN5bmNTY2hlZHVsZXIuYWRkKHRpbWVFbmdpbmUsIG5leHRTeW5jVGltZSk7XG4gKi9cbmNsYXNzIFN5bmNTY2hlZHVsZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBzeW5jIG9wdGlvblxuICAgIHRoaXMuX3N5bmMgPSBudWxsO1xuICAgIHRoaXMuX3N5bmNlZFF1ZXVlID0gbnVsbDtcblxuICAgIC8vIGluaXQgYXVkaW8gdGltZSBiYXNlZCBzY2hlZHVsZXIsIHN5bmMgc2VydmljZSwgYW5kIHF1ZXVlXG4gICAgdGhpcy5fcGxhdGZvcm0gPSB0aGlzLnJlcXVpcmUoJ3BsYXRmb3JtJywgeyBmZWF0dXJlczogJ3dlYi1hdWRpbycgfSk7XG4gICAgdGhpcy5fc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuICAgIHRoaXMuX3N5bmNlZFF1ZXVlID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5fc3luY2VkUXVldWUgPSBuZXcgU3luY1RpbWVTY2hlZHVsaW5nUXVldWUodGhpcy5fc3luYywgYXVkaW9TY2hlZHVsZXIpO1xuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXJyZW50IGF1ZGlvIHRpbWUgb2YgdGhlIHNjaGVkdWxlci5cbiAgICogQGluc3RhbmNlXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgYXVkaW9UaW1lKCkge1xuICAgIHJldHVybiBhdWRpb1NjaGVkdWxlci5jdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdXJyZW50IHN5bmMgdGltZSBvZiB0aGUgc2NoZWR1bGVyLlxuICAgKiBAaW5zdGFuY2VcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBzeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luY2VkUXVldWUuY3VycmVudFRpbWU7XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCBzeW5jIHRpbWUgb2YgdGhlIHNjaGVkdWxlciAoYWxpYXMgYHRoaXMuc3luY1RpbWVgKS5cbiAgICogQGluc3RhbmNlXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgY3VycmVudFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmNlZFF1ZXVlLmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIERpZmZlcmVuY2UgYmV0d2VlbiB0aGUgc2NoZWR1bGVyJ3MgbG9naWNhbCBhdWRpbyB0aW1lIGFuZCB0aGUgYGN1cnJlbnRUaW1lYFxuICAgKiBvZiB0aGUgYXVkaW8gY29udGV4dC5cbiAgICogQGluc3RhbmNlXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgZGVsdGFUaW1lKCkge1xuICAgIHJldHVybiBhdWRpb1NjaGVkdWxlci5jdXJyZW50VGltZSAtIGF1ZGlvLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgc3luYyB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gZ2l2ZW4gYXVkaW8gdGltZS5cbiAgICpcbiAgICogQHBhcmFtICB7TnVtYmVyfSBhdWRpb1RpbWUgLSBhdWRpbyB0aW1lLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gc3luYyB0aW1lIGNvcnJlc3BvbmRpbmcgdG8gZ2l2ZW4gYXVkaW8gdGltZS5cbiAgICovXG4gIGdldFN5bmNUaW1lQXRBdWRpb1RpbWUoYXVkaW9UaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUoYXVkaW9UaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYXVkaW8gdGltZSBjb3JyZXNwb25kaW5nIHRvIGdpdmVuIHN5bmMgdGltZS5cbiAgICpcbiAgICogQHBhcmFtICB7TnVtYmVyfSBzeW5jVGltZSAtIHN5bmMgdGltZS5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIGF1ZGlvIHRpbWUgY29ycmVzcG9uZGluZyB0byBnaXZlbiBzeW5jIHRpbWUuXG4gICAqL1xuICBnZXRBdWRpb1RpbWVBdFN5bmNUaW1lKHN5bmNUaW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0QXVkaW9UaW1lKHN5bmNUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsIGEgZnVuY3Rpb24gYXQgYSBnaXZlbiB0aW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW4gLSBGdW5jdGlvbiB0byBiZSBkZWZlcnJlZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBUaGUgdGltZSBhdCB3aGljaCB0aGUgZnVuY3Rpb24gc2hvdWxkIGJlIGV4ZWN1dGVkLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtsb29rYWhlYWQ9ZmFsc2VdIC0gRGVmaW5lcyB3aGV0aGVyIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWRcbiAgICogIGFudGljaXBhdGVkIChlLmcuIGZvciBhdWRpbyBldmVudHMpIG9yIHByZWNpc2VseSBhdCB0aGUgZ2l2ZW4gdGltZSAoZGVmYXVsdCkuXG4gICAqL1xuICBkZWZlcihmdW4sIHRpbWUsIGxvb2thaGVhZCA9IGZhbHNlKSB7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gdGhpcy5fc3luY2VkUXVldWU7XG4gICAgY29uc3Qgc2NoZWR1bGVyU2VydmljZSA9IHRoaXM7XG4gICAgbGV0IGVuZ2luZTtcblxuICAgIGlmKGxvb2thaGVhZCkge1xuICAgICAgc2NoZWR1bGVyLmRlZmVyKGZ1biwgdGltZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVuZ2luZSA9IHtcbiAgICAgICAgYWR2YW5jZVRpbWU6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICAgICAgICBjb25zdCBkZWx0YSA9IHNjaGVkdWxlclNlcnZpY2UuZGVsdGFUaW1lO1xuXG4gICAgICAgICAgaWYoZGVsdGEgPiAwKVxuICAgICAgICAgICAgc2V0VGltZW91dChmdW4sIDEwMDAgKiBkZWx0YSwgdGltZSk7IC8vIGJyaWRnZSBzY2hlZHVsZXIgbG9va2FoZWFkIHdpdGggdGltZW91dFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZ1bih0aW1lKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIHNjaGVkdWxlci5hZGQoZW5naW5lLCB0aW1lKTsgLy8gYWRkIHdpdGhvdXQgY2hlY2tzXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHRpbWUgZW5naW5lIHRvIHRoZSBxdWV1ZS5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZW5naW5lIC0gRW5naW5lIHRvIHNjaGVkdWxlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIFRoZSB0aW1lIGF0IHdoaWNoIHRoZSBmdW5jdGlvbiBzaG91bGQgYmUgZXhlY3V0ZWQuXG4gICAqL1xuICBhZGQoZW5naW5lLCB0aW1lKSB7XG4gICAgdGhpcy5fc3luY2VkUXVldWUuYWRkKGVuZ2luZSwgdGltZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBnaXZlbiBlbmdpbmUgZnJvbSB0aGUgcXVldWUuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVuZ2luZSAtIEVuZ2luZSB0byByZW1vdmUgZnJvbSB0aGUgc2NoZWR1bGVyLlxuICAgKi9cbiAgcmVtb3ZlKGVuZ2luZSkge1xuICAgIHRoaXMuX3N5bmNlZFF1ZXVlLnJlbW92ZShlbmdpbmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgc2NoZWR1bGVkIGZ1bmN0aW9ucyBhbmQgdGltZSBlbmdpbmVzIGZyb20gdGhlIHNjaGVkdWxlci5cbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX3N5bmNlZFF1ZXVlLmNsZWFyKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU3luY1NjaGVkdWxlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bmNTY2hlZHVsZXI7XG4iXX0=