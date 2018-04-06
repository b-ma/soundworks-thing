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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIl0sIm5hbWVzIjpbImRlZmF1bHQiLCJ2ZXJzaW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs2Q0FZU0EsTzs7Ozs7Ozs7OzJDQUNBQSxPOzs7Ozs7Ozs7K0NBQ0FBLE87Ozs7Ozs7Ozs0Q0FDQUEsTzs7Ozs7Ozs7OzRDQUNBQSxPOzs7Ozs7Ozs7bURBQ0FBLE87Ozs7Ozs7Ozs0Q0FHQUEsTzs7Ozs7Ozs7O2tEQUNBQSxPOzs7Ozs7Ozs7eUNBQ0FBLE87Ozs7OztBQXRCVDs7Ozs7Ozs7QUFRQTtBQUNPLElBQU1DLDRCQUFVLFdBQWhCOztBQUVQIiwiZmlsZSI6InNldHVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDbGllbnQtc2lkZSBlbnRyeSBwb2ludCBvZiB0aGUgKnNvdW5kd29ya3MqIGZyYW1ld29yay5cbiAqXG4gKiBAbW9kdWxlIHNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG4gKi9cblxuLy8gdmVyc2lvbiAoY2YuIGJpbi9qYXZhc2NyaXB0cylcbmV4cG9ydCBjb25zdCB2ZXJzaW9uID0gJyV2ZXJzaW9uJSc7XG5cbi8vIGNvcmVcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQWN0aXZpdHkgfSBmcm9tICcuL2NvcmUvQWN0aXZpdHknO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBjbGllbnQgfSBmcm9tICcuL2NvcmUvY2xpZW50JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRXhwZXJpZW5jZSB9IGZyb20gJy4vY29yZS9FeHBlcmllbmNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUHJvY2VzcyB9IGZyb20gJy4vY29yZS9Qcm9jZXNzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2VydmljZSB9IGZyb20gJy4vY29yZS9TZXJ2aWNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc2VydmljZU1hbmFnZXIgfSBmcm9tICcuL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG4vLyBzZXJ2aWNlc1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBDaGVja2luIH0gZnJvbSAnLi9zZXJ2aWNlcy9DaGVja2luJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRXJyb3JSZXBvcnRlciB9IGZyb20gJy4vc2VydmljZXMvRXJyb3JSZXBvcnRlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFN5bmMgfSBmcm9tICcuL3NlcnZpY2VzL1N5bmMnO1xuLy8gZXhwb3J0IHsgZGVmYXVsdCBhcyBTeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9zZXJ2aWNlcy9TeW5jU2NoZWR1bGVyJztcblxuIl19