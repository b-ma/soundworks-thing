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

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * API of a compliant view for the `checkin` service.
 *
 * @memberof module:soundworks/client
 * @interface AbstractCheckinView
 * @extends module:soundworks/client.AbstractView
 * @abstract
 */
/**
 * Register the function that should be executed when the user is ready to
 * continue.
 *
 * @name setReadyCallback
 * @memberof module:soundworks/client.AbstractCheckinView
 * @function
 * @abstract
 * @instance
 *
 * @param {readyCallback} callback - Callback to execute when the user
 *  is ready to continue.
 */
/**
 * Update the label retrieved by the server.
 *
 * @name updateLabel
 * @memberof module:soundworks/client.AbstractCheckinView
 * @function
 * @abstract
 * @instance
 *
 * @param {String} label - Label to be displayed in the view.
 */
/**
 * Method executed when an error is received from the server (when no place is
 * is available in the experience).
 *
 * @name updateErrorStatus
 * @memberof module:soundworks/client.AbstractCheckinView
 * @function
 * @abstract
 * @instance
 *
 * @param {Boolean} value
 */

/**
 * Callback to execute when the user is ready to continue.
 *
 * @callback
 * @name readyCallback
 * @memberof module:soundworks/client.AbstractCheckinView
 */

var SERVICE_ID = 'service:checkin';

/**
 * Interface for the client `'checkin'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/client.Locator}
 * and [`'placer'`]{@link module:soundworks/client.Placer} services.
 *
 * The `'checkin'` service is the most simple among these services as the server
 * simply assigns a ticket to the client among the available ones. The ticket can
 * optionally be associated with coordinates or labels according to the server
 * `setup` configuration.
 *
 * The service requires the ['platform']{@link module:soundworks/client.Platform}
 * service, as it is considered that an index should be given only to clients who
 * actively entered the application.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Checkin}*__
 *
 * @see {@link module:soundworks/client.Locator}
 * @see {@link module:soundworks/client.Placer}
 *
 * @param {Object} options
 * @param {Boolean} [options.showDialog=false] - Define if the service should
 *  display a view informing the client of its position.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.checkin = this.require('checkin', { showDialog: true });
 */

var Checkin = function (_Service) {
  (0, _inherits3.default)(Checkin, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function Checkin() {
    (0, _classCallCheck3.default)(this, Checkin);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Checkin.__proto__ || (0, _getPrototypeOf2.default)(Checkin)).call(this, SERVICE_ID, true));

    var defaults = {
      order: 'ascending'
    };

    _this.configure(defaults);

    /**
     * Index given by the server.
     * @type {Number}
     */
    _this.index = -1;

    /**
     * Optionnal label given by the server.
     * @type {String}
     */
    _this.label = null;

    /**
     * Optionnal coordinates given by the server.
     * @type {String}
     */
    _this.coordinates = null;

    // bind callbacks to the current instance
    _this._onPositionResponse = _this._onPositionResponse.bind(_this);
    _this._onUnavailableResponse = _this._onUnavailableResponse.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Checkin, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(Checkin.prototype.__proto__ || (0, _getPrototypeOf2.default)(Checkin.prototype), 'start', this).call(this);

      this.setup = this._sharedConfigService;

      // send request to the server
      this.send('request', this.options.order);

      // setup listeners for the server's response
      this.receive('position', this._onPositionResponse);
      this.receive('unavailable', this._onUnavailableResponse);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)(Checkin.prototype.__proto__ || (0, _getPrototypeOf2.default)(Checkin.prototype), 'stop', this).call(this);
      // Remove listeners for the server's response
      this.removeListener('position', this._onPositionResponse);
      this.removeListener('unavailable', this._onUnavailableResponse);
    }

    /** @private */

  }, {
    key: '_onPositionResponse',
    value: function _onPositionResponse(index, label, coordinates) {
      _client2.default.index = this.index = index;
      _client2.default.label = this.label = label;
      this.coordinates = coordinates;

      if (coordinates !== null && !_client2.default.coordinates) _client2.default.coordinates = coordinates;

      this.ready();
    }

    /** @private */

  }, {
    key: '_onUnavailableResponse',
    value: function _onUnavailableResponse() {
      this.view.updateErrorStatus(true);
    }
  }]);
  return Checkin;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Checkin);

exports.default = Checkin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJDaGVja2luIiwiZGVmYXVsdHMiLCJvcmRlciIsImNvbmZpZ3VyZSIsImluZGV4IiwibGFiZWwiLCJjb29yZGluYXRlcyIsIl9vblBvc2l0aW9uUmVzcG9uc2UiLCJiaW5kIiwiX29uVW5hdmFpbGFibGVSZXNwb25zZSIsInNldHVwIiwiX3NoYXJlZENvbmZpZ1NlcnZpY2UiLCJzZW5kIiwib3B0aW9ucyIsInJlY2VpdmUiLCJyZW1vdmVMaXN0ZW5lciIsInJlYWR5IiwidmlldyIsInVwZGF0ZUVycm9yU3RhdHVzIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7O0FBUUE7Ozs7Ozs7Ozs7Ozs7QUFhQTs7Ozs7Ozs7Ozs7QUFXQTs7Ozs7Ozs7Ozs7OztBQWFBOzs7Ozs7OztBQVNBLElBQU1BLGFBQWEsaUJBQW5COztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBOEJNQyxPOzs7QUFDSjtBQUNBLHFCQUFjO0FBQUE7O0FBQUEsd0lBQ05ELFVBRE0sRUFDTSxJQUROOztBQUdaLFFBQU1FLFdBQVc7QUFDZkMsYUFBTztBQURRLEtBQWpCOztBQUlBLFVBQUtDLFNBQUwsQ0FBZUYsUUFBZjs7QUFFQTs7OztBQUlBLFVBQUtHLEtBQUwsR0FBYSxDQUFDLENBQWQ7O0FBRUE7Ozs7QUFJQSxVQUFLQyxLQUFMLEdBQWEsSUFBYjs7QUFFQTs7OztBQUlBLFVBQUtDLFdBQUwsR0FBbUIsSUFBbkI7O0FBRUE7QUFDQSxVQUFLQyxtQkFBTCxHQUEyQixNQUFLQSxtQkFBTCxDQUF5QkMsSUFBekIsT0FBM0I7QUFDQSxVQUFLQyxzQkFBTCxHQUE4QixNQUFLQSxzQkFBTCxDQUE0QkQsSUFBNUIsT0FBOUI7QUE3Qlk7QUE4QmI7O0FBRUQ7Ozs7OzRCQUNRO0FBQ047O0FBRUEsV0FBS0UsS0FBTCxHQUFhLEtBQUtDLG9CQUFsQjs7QUFFQTtBQUNBLFdBQUtDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLEtBQUtDLE9BQUwsQ0FBYVgsS0FBbEM7O0FBRUE7QUFDQSxXQUFLWSxPQUFMLENBQWEsVUFBYixFQUF5QixLQUFLUCxtQkFBOUI7QUFDQSxXQUFLTyxPQUFMLENBQWEsYUFBYixFQUE0QixLQUFLTCxzQkFBakM7QUFDRDs7QUFFRDs7OzsyQkFDTztBQUNMO0FBQ0E7QUFDQSxXQUFLTSxjQUFMLENBQW9CLFVBQXBCLEVBQWdDLEtBQUtSLG1CQUFyQztBQUNBLFdBQUtRLGNBQUwsQ0FBb0IsYUFBcEIsRUFBbUMsS0FBS04sc0JBQXhDO0FBQ0Q7O0FBRUQ7Ozs7d0NBQ29CTCxLLEVBQU9DLEssRUFBT0MsVyxFQUFhO0FBQzdDLHVCQUFPRixLQUFQLEdBQWUsS0FBS0EsS0FBTCxHQUFhQSxLQUE1QjtBQUNBLHVCQUFPQyxLQUFQLEdBQWUsS0FBS0EsS0FBTCxHQUFhQSxLQUE1QjtBQUNBLFdBQUtDLFdBQUwsR0FBbUJBLFdBQW5COztBQUVBLFVBQUlBLGdCQUFnQixJQUFoQixJQUF3QixDQUFDLGlCQUFPQSxXQUFwQyxFQUNFLGlCQUFPQSxXQUFQLEdBQXFCQSxXQUFyQjs7QUFFRixXQUFLVSxLQUFMO0FBQ0Q7O0FBRUQ7Ozs7NkNBQ3lCO0FBQ3ZCLFdBQUtDLElBQUwsQ0FBVUMsaUJBQVYsQ0FBNEIsSUFBNUI7QUFDRDs7Ozs7QUFHSCx5QkFBZUMsUUFBZixDQUF3QnBCLFVBQXhCLEVBQW9DQyxPQUFwQzs7a0JBRWVBLE8iLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8qKlxuICogQVBJIG9mIGEgY29tcGxpYW50IHZpZXcgZm9yIHRoZSBgY2hlY2tpbmAgc2VydmljZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAaW50ZXJmYWNlIEFic3RyYWN0Q2hlY2tpblZpZXdcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFZpZXdcbiAqIEBhYnN0cmFjdFxuICovXG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBleGVjdXRlZCB3aGVuIHRoZSB1c2VyIGlzIHJlYWR5IHRvXG4gKiBjb250aW51ZS5cbiAqXG4gKiBAbmFtZSBzZXRSZWFkeUNhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Q2hlY2tpblZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge3JlYWR5Q2FsbGJhY2t9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHRoZSB1c2VyXG4gKiAgaXMgcmVhZHkgdG8gY29udGludWUuXG4gKi9cbi8qKlxuICogVXBkYXRlIHRoZSBsYWJlbCByZXRyaWV2ZWQgYnkgdGhlIHNlcnZlci5cbiAqXG4gKiBAbmFtZSB1cGRhdGVMYWJlbFxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdENoZWNraW5WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gTGFiZWwgdG8gYmUgZGlzcGxheWVkIGluIHRoZSB2aWV3LlxuICovXG4vKipcbiAqIE1ldGhvZCBleGVjdXRlZCB3aGVuIGFuIGVycm9yIGlzIHJlY2VpdmVkIGZyb20gdGhlIHNlcnZlciAod2hlbiBubyBwbGFjZSBpc1xuICogaXMgYXZhaWxhYmxlIGluIHRoZSBleHBlcmllbmNlKS5cbiAqXG4gKiBAbmFtZSB1cGRhdGVFcnJvclN0YXR1c1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdENoZWNraW5WaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSB2YWx1ZVxuICovXG5cbi8qKlxuICogQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHRoZSB1c2VyIGlzIHJlYWR5IHRvIGNvbnRpbnVlLlxuICpcbiAqIEBjYWxsYmFja1xuICogQG5hbWUgcmVhZHlDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdENoZWNraW5WaWV3XG4gKi9cblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6Y2hlY2tpbic7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnY2hlY2tpbidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIG9uZSBvZiB0aGUgcHJvdmlkZWQgc2VydmljZXMgYWltZWQgYXQgaWRlbnRpZnlpbmcgY2xpZW50cyBpbnNpZGVcbiAqIHRoZSBleHBlcmllbmNlIGFsb25nIHdpdGggdGhlIFtgJ2xvY2F0b3InYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9XG4gKiBhbmQgW2AncGxhY2VyJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9IHNlcnZpY2VzLlxuICpcbiAqIFRoZSBgJ2NoZWNraW4nYCBzZXJ2aWNlIGlzIHRoZSBtb3N0IHNpbXBsZSBhbW9uZyB0aGVzZSBzZXJ2aWNlcyBhcyB0aGUgc2VydmVyXG4gKiBzaW1wbHkgYXNzaWducyBhIHRpY2tldCB0byB0aGUgY2xpZW50IGFtb25nIHRoZSBhdmFpbGFibGUgb25lcy4gVGhlIHRpY2tldCBjYW5cbiAqIG9wdGlvbmFsbHkgYmUgYXNzb2NpYXRlZCB3aXRoIGNvb3JkaW5hdGVzIG9yIGxhYmVscyBhY2NvcmRpbmcgdG8gdGhlIHNlcnZlclxuICogYHNldHVwYCBjb25maWd1cmF0aW9uLlxuICpcbiAqIFRoZSBzZXJ2aWNlIHJlcXVpcmVzIHRoZSBbJ3BsYXRmb3JtJ117QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfVxuICogc2VydmljZSwgYXMgaXQgaXMgY29uc2lkZXJlZCB0aGF0IGFuIGluZGV4IHNob3VsZCBiZSBnaXZlbiBvbmx5IHRvIGNsaWVudHMgd2hvXG4gKiBhY3RpdmVseSBlbnRlcmVkIHRoZSBhcHBsaWNhdGlvbi5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2hlY2tpbn0qX19cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvd0RpYWxvZz1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHNlcnZpY2Ugc2hvdWxkXG4gKiAgZGlzcGxheSBhIHZpZXcgaW5mb3JtaW5nIHRoZSBjbGllbnQgb2YgaXRzIHBvc2l0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuY2hlY2tpbiA9IHRoaXMucmVxdWlyZSgnY2hlY2tpbicsIHsgc2hvd0RpYWxvZzogdHJ1ZSB9KTtcbiAqL1xuY2xhc3MgQ2hlY2tpbiBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBvcmRlcjogJ2FzY2VuZGluZycsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIC8qKlxuICAgICAqIEluZGV4IGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gLTE7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25uYWwgbGFiZWwgZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ubmFsIGNvb3JkaW5hdGVzIGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gbnVsbDtcblxuICAgIC8vIGJpbmQgY2FsbGJhY2tzIHRvIHRoZSBjdXJyZW50IGluc3RhbmNlXG4gICAgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlID0gdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlID0gdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuc2V0dXAgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlO1xuXG4gICAgLy8gc2VuZCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCB0aGlzLm9wdGlvbnMub3JkZXIpO1xuXG4gICAgLy8gc2V0dXAgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlY2VpdmUoJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvblJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3VuYXZhaWxhYmxlJywgdGhpcy5fb25VbmF2YWlsYWJsZVJlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgICAvLyBSZW1vdmUgbGlzdGVuZXJzIGZvciB0aGUgc2VydmVyJ3MgcmVzcG9uc2VcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdwb3NpdGlvbicsIHRoaXMuX29uUG9zaXRpb25SZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigndW5hdmFpbGFibGUnLCB0aGlzLl9vblVuYXZhaWxhYmxlUmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblBvc2l0aW9uUmVzcG9uc2UoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykge1xuICAgIGNsaWVudC5pbmRleCA9IHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICBjbGllbnQubGFiZWwgPSB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgaWYgKGNvb3JkaW5hdGVzICE9PSBudWxsICYmICFjbGllbnQuY29vcmRpbmF0ZXMpXG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25VbmF2YWlsYWJsZVJlc3BvbnNlKCkge1xuICAgIHRoaXMudmlldy51cGRhdGVFcnJvclN0YXR1cyh0cnVlKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBDaGVja2luKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2hlY2tpbjtcbiJdfQ==