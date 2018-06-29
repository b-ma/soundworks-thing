'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Activity = require('./core/Activity');

Object.defineProperty(exports, 'Activity', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Activity).default;
  }
});

var _client = require('./core/client');

Object.defineProperty(exports, 'client', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_client).default;
  }
});

var _Experience = require('./core/Experience');

Object.defineProperty(exports, 'Experience', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Experience).default;
  }
});

var _Process = require('./core/Process');

Object.defineProperty(exports, 'Process', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Process).default;
  }
});

var _Service = require('./core/Service');

Object.defineProperty(exports, 'Service', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Service).default;
  }
});

var _serviceManager = require('./core/serviceManager');

Object.defineProperty(exports, 'serviceManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_serviceManager).default;
  }
});

var _Checkin = require('./services/Checkin');

Object.defineProperty(exports, 'Checkin', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Checkin).default;
  }
});

var _ErrorReporter = require('./services/ErrorReporter');

Object.defineProperty(exports, 'ErrorReporter', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ErrorReporter).default;
  }
});

var _Sync = require('./services/Sync');

Object.defineProperty(exports, 'Sync', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Sync).default;
  }
});

var _SharedParams = require('./services/SharedParams');

Object.defineProperty(exports, 'SharedParams', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SharedParams).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Client-side entry point of the *soundworks* framework.
 *
 * @module soundworks/client
 * @example
 * import * as soundworks from 'soundworks/client';
 */

// version (cf. bin/javascripts)
var version = exports.version = '%version%';

// core
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiLCJ2ZXJzaW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs2Q0FZU0EsTzs7Ozs7Ozs7OzJDQUNBQSxPOzs7Ozs7Ozs7K0NBQ0FBLE87Ozs7Ozs7Ozs0Q0FDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7bURBQ0FBLE87Ozs7Ozs7Ozs0Q0FHQUEsTzs7Ozs7Ozs7O2tEQUNBQSxPOzs7Ozs7Ozs7eUNBQ0FBLE87Ozs7Ozs7OztpREFDQUEsTzs7Ozs7O0FBdkJUOzs7Ozs7OztBQVFBO0FBQ08sSUFBTUMsNEJBQVUsV0FBaEI7O0FBRVAiLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENsaWVudC1zaWRlIGVudHJ5IHBvaW50IG9mIHRoZSAqc291bmR3b3JrcyogZnJhbWV3b3JrLlxuICpcbiAqIEBtb2R1bGUgc291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbiAqL1xuXG4vLyB2ZXJzaW9uIChjZi4gYmluL2phdmFzY3JpcHRzKVxuZXhwb3J0IGNvbnN0IHZlcnNpb24gPSAnJXZlcnNpb24lJztcblxuLy8gY29yZVxuZXhwb3J0IHsgZGVmYXVsdCBhcyBBY3Rpdml0eSB9IGZyb20gJy4vY29yZS9BY3Rpdml0eSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGNsaWVudCB9IGZyb20gJy4vY29yZS9jbGllbnQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFeHBlcmllbmNlIH0gZnJvbSAnLi9jb3JlL0V4cGVyaWVuY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBQcm9jZXNzIH0gZnJvbSAnLi9jb3JlL1Byb2Nlc3MnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBTZXJ2aWNlIH0gZnJvbSAnLi9jb3JlL1NlcnZpY2UnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzZXJ2aWNlTWFuYWdlciB9IGZyb20gJy4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8vIHNlcnZpY2VzXG5leHBvcnQgeyBkZWZhdWx0IGFzIENoZWNraW4gfSBmcm9tICcuL3NlcnZpY2VzL0NoZWNraW4nO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBFcnJvclJlcG9ydGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9FcnJvclJlcG9ydGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3luYyB9IGZyb20gJy4vc2VydmljZXMvU3luYyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNoYXJlZFBhcmFtcyB9IGZyb20gJy4vc2VydmljZXMvU2hhcmVkUGFyYW1zJztcbi8vIGV4cG9ydCB7IGRlZmF1bHQgYXMgU3luY1NjaGVkdWxlciB9IGZyb20gJy4vc2VydmljZXMvU3luY1NjaGVkdWxlcic7XG5cbiJdfQ==