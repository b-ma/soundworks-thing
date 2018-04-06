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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:error-reporter';

/**
 * Interface for the client `'error-reporter'` service.
 *
 * This service allows to log javascript errors that could occur during the
 * application life cycle. Errors are caught and sent to the server in order
 * to be persisted in a file.
 * By default, the log files are located in the `logs/clients` directory inside
 * the application directory.
 *
 * *The service is automatically launched whenever the application detects the
 * use of a networked activity. It should never be required manually inside
 * an application.*
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.ErrorReporter}*__
 *
 * @memberof module:soundworks/client
 */

var ErrorReporter = function (_Service) {
  (0, _inherits3.default)(ErrorReporter, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function ErrorReporter() {
    (0, _classCallCheck3.default)(this, ErrorReporter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ErrorReporter.__proto__ || (0, _getPrototypeOf2.default)(ErrorReporter)).call(this, SERVICE_ID, true));

    _this._onError = _this._onError.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(ErrorReporter, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(ErrorReporter.prototype.__proto__ || (0, _getPrototypeOf2.default)(ErrorReporter.prototype), 'start', this).call(this);

      // process.on('uncaughtException', this._onError);
      this.ready();
    }

    /** @private */

  }, {
    key: '_onError',
    value: function _onError(e) {
      var stack = void 0;
      var file = e.filename;
      var line = e.lineno;
      var col = e.colno;
      var msg = e.message;

      this.send('error', file, line, col, msg);
    }
  }]);
  return ErrorReporter;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, ErrorReporter);

exports.default = ErrorReporter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVycm9yUmVwb3J0ZXIuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkVycm9yUmVwb3J0ZXIiLCJfb25FcnJvciIsImJpbmQiLCJyZWFkeSIsImUiLCJzdGFjayIsImZpbGUiLCJmaWxlbmFtZSIsImxpbmUiLCJsaW5lbm8iLCJjb2wiLCJjb2xubyIsIm1zZyIsIm1lc3NhZ2UiLCJzZW5kIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU1BLGFBQWEsd0JBQW5COztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpQk1DLGE7OztBQUNKO0FBQ0EsMkJBQWM7QUFBQTs7QUFBQSxvSkFDTkQsVUFETSxFQUNNLElBRE47O0FBR1osVUFBS0UsUUFBTCxHQUFnQixNQUFLQSxRQUFMLENBQWNDLElBQWQsT0FBaEI7QUFIWTtBQUliOztBQUVEOzs7Ozs0QkFDUTtBQUNOOztBQUVBO0FBQ0EsV0FBS0MsS0FBTDtBQUNEOztBQUVEOzs7OzZCQUNTQyxDLEVBQUc7QUFDVixVQUFJQyxjQUFKO0FBQ0EsVUFBSUMsT0FBT0YsRUFBRUcsUUFBYjtBQUNBLFVBQU1DLE9BQU9KLEVBQUVLLE1BQWY7QUFDQSxVQUFNQyxNQUFNTixFQUFFTyxLQUFkO0FBQ0EsVUFBTUMsTUFBTVIsRUFBRVMsT0FBZDs7QUFFQSxXQUFLQyxJQUFMLENBQVUsT0FBVixFQUFtQlIsSUFBbkIsRUFBeUJFLElBQXpCLEVBQStCRSxHQUEvQixFQUFvQ0UsR0FBcEM7QUFDRDs7Ozs7QUFHSCx5QkFBZUcsUUFBZixDQUF3QmhCLFVBQXhCLEVBQW9DQyxhQUFwQzs7a0JBRWVBLGEiLCJmaWxlIjoiRXJyb3JSZXBvcnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmVycm9yLXJlcG9ydGVyJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdlcnJvci1yZXBvcnRlcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBsb2cgamF2YXNjcmlwdCBlcnJvcnMgdGhhdCBjb3VsZCBvY2N1ciBkdXJpbmcgdGhlXG4gKiBhcHBsaWNhdGlvbiBsaWZlIGN5Y2xlLiBFcnJvcnMgYXJlIGNhdWdodCBhbmQgc2VudCB0byB0aGUgc2VydmVyIGluIG9yZGVyXG4gKiB0byBiZSBwZXJzaXN0ZWQgaW4gYSBmaWxlLlxuICogQnkgZGVmYXVsdCwgdGhlIGxvZyBmaWxlcyBhcmUgbG9jYXRlZCBpbiB0aGUgYGxvZ3MvY2xpZW50c2AgZGlyZWN0b3J5IGluc2lkZVxuICogdGhlIGFwcGxpY2F0aW9uIGRpcmVjdG9yeS5cbiAqXG4gKiAqVGhlIHNlcnZpY2UgaXMgYXV0b21hdGljYWxseSBsYXVuY2hlZCB3aGVuZXZlciB0aGUgYXBwbGljYXRpb24gZGV0ZWN0cyB0aGVcbiAqIHVzZSBvZiBhIG5ldHdvcmtlZCBhY3Rpdml0eS4gSXQgc2hvdWxkIG5ldmVyIGJlIHJlcXVpcmVkIG1hbnVhbGx5IGluc2lkZVxuICogYW4gYXBwbGljYXRpb24uKlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5FcnJvclJlcG9ydGVyfSpfX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqL1xuY2xhc3MgRXJyb3JSZXBvcnRlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgdGhpcy5fb25FcnJvciA9IHRoaXMuX29uRXJyb3IuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgLy8gcHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCB0aGlzLl9vbkVycm9yKTtcbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uRXJyb3IoZSkge1xuICAgIGxldCBzdGFjaztcbiAgICBsZXQgZmlsZSA9IGUuZmlsZW5hbWU7XG4gICAgY29uc3QgbGluZSA9IGUubGluZW5vO1xuICAgIGNvbnN0IGNvbCA9IGUuY29sbm87XG4gICAgY29uc3QgbXNnID0gZS5tZXNzYWdlO1xuXG4gICAgdGhpcy5zZW5kKCdlcnJvcicsIGZpbGUsIGxpbmUsIGNvbCwgbXNnKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBFcnJvclJlcG9ydGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgRXJyb3JSZXBvcnRlcjtcbiJdfQ==