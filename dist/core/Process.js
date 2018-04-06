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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _EventEmitter2 = require('../utils/EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _Signal = require('../utils/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A process defines the simpliest unit of the framework.
 * It is defined by a signal `active` and 2 methods: `start` and `stop`.
 *
 * @memberof module:soundworks/client
 */
var Process = function (_EventEmitter) {
  (0, _inherits3.default)(Process, _EventEmitter);

  function Process(id) {
    (0, _classCallCheck3.default)(this, Process);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Process.__proto__ || (0, _getPrototypeOf2.default)(Process)).call(this));

    if (id === undefined) throw new Error('Undefined id for process ' + _this.constructor.name);

    /**
     * Name of the process.
     * @name id
     * @type {String}
     * @instanceof Process
     */
    _this.id = id;

    /**
     * Signals defining the process state.
     * @name signal
     * @type {Object}
     * @instanceof Process
     */
    _this.signals = {};
    _this.signals.active = new _Signal2.default();
    return _this;
  }

  /**
   * Start the process.
   */


  (0, _createClass3.default)(Process, [{
    key: 'start',
    value: function start() {
      this.signals.active.set(true);
    }

    /**
     * Stop the process.
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.signals.active.set(false);
    }
  }]);
  return Process;
}(_EventEmitter3.default);

exports.default = Process;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIl0sIm5hbWVzIjpbIlByb2Nlc3MiLCJpZCIsInVuZGVmaW5lZCIsIkVycm9yIiwiY29uc3RydWN0b3IiLCJuYW1lIiwic2lnbmFscyIsImFjdGl2ZSIsInNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7O0lBTU1BLE87OztBQUNKLG1CQUFZQyxFQUFaLEVBQWdCO0FBQUE7O0FBQUE7O0FBR2QsUUFBSUEsT0FBT0MsU0FBWCxFQUNFLE1BQU0sSUFBSUMsS0FBSiwrQkFBc0MsTUFBS0MsV0FBTCxDQUFpQkMsSUFBdkQsQ0FBTjs7QUFFRjs7Ozs7O0FBTUEsVUFBS0osRUFBTCxHQUFVQSxFQUFWOztBQUVBOzs7Ozs7QUFNQSxVQUFLSyxPQUFMLEdBQWUsRUFBZjtBQUNBLFVBQUtBLE9BQUwsQ0FBYUMsTUFBYixHQUFzQixzQkFBdEI7QUFyQmM7QUFzQmY7O0FBRUQ7Ozs7Ozs7NEJBR1E7QUFDTixXQUFLRCxPQUFMLENBQWFDLE1BQWIsQ0FBb0JDLEdBQXBCLENBQXdCLElBQXhCO0FBQ0Q7O0FBRUQ7Ozs7OzsyQkFHTztBQUNMLFdBQUtGLE9BQUwsQ0FBYUMsTUFBYixDQUFvQkMsR0FBcEIsQ0FBd0IsS0FBeEI7QUFDRDs7Ozs7a0JBR1lSLE8iLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJy4uL3V0aWxzL0V2ZW50RW1pdHRlcic7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4uL3V0aWxzL1NpZ25hbCc7XG5cbi8qKlxuICogQSBwcm9jZXNzIGRlZmluZXMgdGhlIHNpbXBsaWVzdCB1bml0IG9mIHRoZSBmcmFtZXdvcmsuXG4gKiBJdCBpcyBkZWZpbmVkIGJ5IGEgc2lnbmFsIGBhY3RpdmVgIGFuZCAyIG1ldGhvZHM6IGBzdGFydGAgYW5kIGBzdG9wYC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKi9cbmNsYXNzIFByb2Nlc3MgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcihpZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoaWQgPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5kZWZpbmVkIGlkIGZvciBwcm9jZXNzICR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfWApO1xuXG4gICAgLyoqXG4gICAgICogTmFtZSBvZiB0aGUgcHJvY2Vzcy5cbiAgICAgKiBAbmFtZSBpZFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGluc3RhbmNlb2YgUHJvY2Vzc1xuICAgICAqL1xuICAgIHRoaXMuaWQgPSBpZDtcblxuICAgIC8qKlxuICAgICAqIFNpZ25hbHMgZGVmaW5pbmcgdGhlIHByb2Nlc3Mgc3RhdGUuXG4gICAgICogQG5hbWUgc2lnbmFsXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAaW5zdGFuY2VvZiBQcm9jZXNzXG4gICAgICovXG4gICAgdGhpcy5zaWduYWxzID0ge307XG4gICAgdGhpcy5zaWduYWxzLmFjdGl2ZSA9IG5ldyBTaWduYWwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgcHJvY2Vzcy5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuc2lnbmFscy5hY3RpdmUuc2V0KHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgdGhlIHByb2Nlc3MuXG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuc2lnbmFscy5hY3RpdmUuc2V0KGZhbHNlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcm9jZXNzO1xuIl19