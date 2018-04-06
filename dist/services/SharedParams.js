'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

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

var _EventEmitter2 = require('../../utils/EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* --------------------------------------------------------- */
/* CONTROL UNITS
/* --------------------------------------------------------- */

/** @private */
var _Param = function (_EventEmitter) {
  (0, _inherits3.default)(_Param, _EventEmitter);

  function _Param(parent, type, name, label) {
    (0, _classCallCheck3.default)(this, _Param);

    var _this = (0, _possibleConstructorReturn3.default)(this, (_Param.__proto__ || (0, _getPrototypeOf2.default)(_Param)).call(this));

    _this.parent = parent;
    _this.type = type;
    _this.name = name;
    _this.label = label;
    _this.value = undefined;
    return _this;
  }

  (0, _createClass3.default)(_Param, [{
    key: 'set',
    value: function set(val) {
      this.value = value;
    }
  }, {
    key: '_propagate',
    value: function _propagate() {
      var sendToServer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.emit('update', this.value); // call event listeners

      if (sendToServer) this.parent.send('update', this.name, this.value); // send to server

      this.parent.emit('update', this.name, this.value); // call parent listeners
    }
  }, {
    key: 'update',
    value: function update(val) {
      var sendToServer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this.set(val);
      this._propagate(sendToServer);
    }
  }]);
  return _Param;
}(_EventEmitter3.default);

/** @private */


var _BooleanParam = function (_Param2) {
  (0, _inherits3.default)(_BooleanParam, _Param2);

  function _BooleanParam(parent, name, label, init) {
    (0, _classCallCheck3.default)(this, _BooleanParam);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (_BooleanParam.__proto__ || (0, _getPrototypeOf2.default)(_BooleanParam)).call(this, parent, 'boolean', name, label));

    _this2.set(init);
    return _this2;
  }

  (0, _createClass3.default)(_BooleanParam, [{
    key: 'set',
    value: function set(val) {
      this.value = val;
    }
  }]);
  return _BooleanParam;
}(_Param);

/** @private */


var _EnumParam = function (_Param3) {
  (0, _inherits3.default)(_EnumParam, _Param3);

  function _EnumParam(parent, name, label, options, init) {
    (0, _classCallCheck3.default)(this, _EnumParam);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (_EnumParam.__proto__ || (0, _getPrototypeOf2.default)(_EnumParam)).call(this, parent, 'enum', name, label));

    _this3.options = options;
    _this3.set(init);
    return _this3;
  }

  (0, _createClass3.default)(_EnumParam, [{
    key: 'set',
    value: function set(val) {
      var index = this.options.indexOf(val);

      if (index >= 0) {
        this.index = index;
        this.value = val;
      }
    }
  }]);
  return _EnumParam;
}(_Param);

/** @private */


var _NumberParam = function (_Param4) {
  (0, _inherits3.default)(_NumberParam, _Param4);

  function _NumberParam(parent, name, label, min, max, step, init) {
    (0, _classCallCheck3.default)(this, _NumberParam);

    var _this4 = (0, _possibleConstructorReturn3.default)(this, (_NumberParam.__proto__ || (0, _getPrototypeOf2.default)(_NumberParam)).call(this, parent, 'number', name, label));

    _this4.min = min;
    _this4.max = max;
    _this4.step = step;
    _this4.set(init);
    return _this4;
  }

  (0, _createClass3.default)(_NumberParam, [{
    key: 'set',
    value: function set(val) {
      this.value = Math.min(this.max, Math.max(this.min, val));
    }
  }]);
  return _NumberParam;
}(_Param);

/** @private */


var _TextParam = function (_Param5) {
  (0, _inherits3.default)(_TextParam, _Param5);

  function _TextParam(parent, name, label, init) {
    (0, _classCallCheck3.default)(this, _TextParam);

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (_TextParam.__proto__ || (0, _getPrototypeOf2.default)(_TextParam)).call(this, parent, 'text', name, label));

    _this5.set(init);
    return _this5;
  }

  (0, _createClass3.default)(_TextParam, [{
    key: 'set',
    value: function set(val) {
      this.value = val;
    }
  }]);
  return _TextParam;
}(_Param);

/** @private */


var _TriggerParam = function (_Param6) {
  (0, _inherits3.default)(_TriggerParam, _Param6);

  function _TriggerParam(parent, name, label) {
    (0, _classCallCheck3.default)(this, _TriggerParam);
    return (0, _possibleConstructorReturn3.default)(this, (_TriggerParam.__proto__ || (0, _getPrototypeOf2.default)(_TriggerParam)).call(this, parent, 'trigger', name, label));
  }

  (0, _createClass3.default)(_TriggerParam, [{
    key: 'set',
    value: function set(val) {/* nothing to set here */}
  }]);
  return _TriggerParam;
}(_Param);

var SERVICE_ID = 'service:shared-params';

/**
 * Interface for the client `'shared-params'` service.
 *
 * The `shared-params` service is used to maintain and update global parameters
 * used among all connected clients. Each defined parameter can be of the
 * following data types:
 * - boolean
 * - enum
 * - number
 * - text
 * - trigger
 *
 * The parameters are configured in the server side counterpart of the service.
 *
 * To create a control surface from the parameters definitions, a dedicated scene
 * [`BasicSharedController`]{@link module:soundworks/client.BasicSharedController}
 * is available.
 *
 * __*The service must be used along with its
 * [server-side counterpart]{@link module:soundworks/server.SharedParams}*__
 *
 * _<span class="warning">__WARNING__</span> This class should never be
 * instanciated manually_
 *
 * @memberof module:soundworks/client
 *
 * @example
 * // inside the experience constructor
 * this.sharedParams = this.require('shared-params');
 * // when the experience starts, listen for parameter updates
 * this.sharedParams.addParamListener('synth:gain', (value) => {
 *   this.synth.setGain(value);
 * });
 *
 * @see [`BasicSharedController` scene]{@link module:soundworks/client.BasicSharedController}
 */

var SharedParams = function (_Service) {
  (0, _inherits3.default)(SharedParams, _Service);

  function SharedParams() {
    (0, _classCallCheck3.default)(this, SharedParams);

    var _this7 = (0, _possibleConstructorReturn3.default)(this, (SharedParams.__proto__ || (0, _getPrototypeOf2.default)(SharedParams)).call(this, SERVICE_ID, true));

    var defaults = {};
    _this7.configure(defaults);

    /**
     * Dictionary of all the parameters and commands.
     * @type {Object}
     * @name params
     * @instance
     * @memberof module:soundworks/client.SharedParams
     *
     * @private
     */
    _this7.params = {};

    _this7._onInitResponse = _this7._onInitResponse.bind(_this7);
    _this7._onUpdateResponse = _this7._onUpdateResponse.bind(_this7);
    return _this7;
  }

  /** @private */


  (0, _createClass3.default)(SharedParams, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(SharedParams.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedParams.prototype), 'start', this).call(this);

      this.send('request');

      this.receive('init', this._onInitResponse);
      this.receive('update', this._onUpdateResponse);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)(SharedParams.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedParams.prototype), 'stop', this).call(this);
      // don't remove 'update' listener, as the control is runnig as a background process
      this.removeListener('init', this._onInitResponse);
    }

    /** @private */

  }, {
    key: '_onInitResponse',
    value: function _onInitResponse(config) {
      var _this8 = this;

      config.forEach(function (entry) {
        var param = _this8._createParam(entry);
        _this8.params[param.name] = param;
      });

      this.ready();
    }

    /** @private */

  }, {
    key: '_onUpdateResponse',
    value: function _onUpdateResponse(name, val) {
      // update, but don't send back to server
      this.update(name, val, false);
    }

    /** @private */

  }, {
    key: '_createParam',
    value: function _createParam(init) {
      var param = null;

      switch (init.type) {
        case 'boolean':
          param = new _BooleanParam(this, init.name, init.label, init.value);
          break;

        case 'enum':
          param = new _EnumParam(this, init.name, init.label, init.options, init.value);
          break;

        case 'number':
          param = new _NumberParam(this, init.name, init.label, init.min, init.max, init.step, init.value);
          break;

        case 'text':
          param = new _TextParam(this, init.name, init.label, init.value);
          break;

        case 'trigger':
          param = new _TriggerParam(this, init.name, init.label);
          break;
      }

      return param;
    }

    /**
     * @callback module:soundworks/client.SharedParams~paramCallback
     * @param {Mixed} value - Updated value of the shared parameter.
     */

    /**
     * Add a listener to listen a specific parameter changes. The listener is
     * executed immediately when added with the parameter current value.
     *
     * @param {String} name - Name of the parameter.
     * @param {module:soundworks/client.SharedParams~paramCallback} listener -
     *  Listener to add.
     */

  }, {
    key: 'addParamListener',
    value: function addParamListener(name, listener) {
      var param = this.params[name];

      if (param) {
        param.addListener('update', listener);

        if (param.type !== 'trigger') listener(param.value);
      } else {
        console.log('unknown param "' + name + '"');
      }
    }

    /**
     * Remove a listener from listening a specific parameter changes.
     *
     * @param {String} name - Name of the parameter.
     * @param {module:soundworks/client.SharedParams~paramCallback} listener -
     *  Listener to remove.
     */

  }, {
    key: 'removeParamListener',
    value: function removeParamListener(name, listener) {
      var param = this.params[name];

      if (param) param.removeListener('update', listener);else console.log('unknown param "' + name + '"');
    }

    /**
     * Get the value of a given parameter.
     *
     * @param {String} name - Name of the parameter.
     * @returns {Mixed} - Current value of the parameter.
     */

  }, {
    key: 'getValue',
    value: function getValue(name) {
      return this.params[name].value;
    }

    /**
     * Update the value of a parameter (used when `options.hasGUI=true`)
     *
     * @param {String} name - Name of the parameter.
     * @param {Mixed} val - New value of the parameter.
     * @param {Boolean} [sendToServer=true] - Flag whether the value should be
     *  propagated to the server.
     */

  }, {
    key: 'update',
    value: function update(name, val) {
      var sendToServer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var param = this.params[name];

      if (param) param.update(val, sendToServer);else console.log('unknown shared parameter "' + name + '"');
    }
  }]);
  return SharedParams;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SharedParams);

exports.default = SharedParams;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIl0sIm5hbWVzIjpbIl9QYXJhbSIsInBhcmVudCIsInR5cGUiLCJuYW1lIiwibGFiZWwiLCJ2YWx1ZSIsInVuZGVmaW5lZCIsInZhbCIsInNlbmRUb1NlcnZlciIsImVtaXQiLCJzZW5kIiwic2V0IiwiX3Byb3BhZ2F0ZSIsIl9Cb29sZWFuUGFyYW0iLCJpbml0IiwiX0VudW1QYXJhbSIsIm9wdGlvbnMiLCJpbmRleCIsImluZGV4T2YiLCJfTnVtYmVyUGFyYW0iLCJtaW4iLCJtYXgiLCJzdGVwIiwiTWF0aCIsIl9UZXh0UGFyYW0iLCJfVHJpZ2dlclBhcmFtIiwiU0VSVklDRV9JRCIsIlNoYXJlZFBhcmFtcyIsImRlZmF1bHRzIiwiY29uZmlndXJlIiwicGFyYW1zIiwiX29uSW5pdFJlc3BvbnNlIiwiYmluZCIsIl9vblVwZGF0ZVJlc3BvbnNlIiwicmVjZWl2ZSIsInJlbW92ZUxpc3RlbmVyIiwiY29uZmlnIiwiZm9yRWFjaCIsImVudHJ5IiwicGFyYW0iLCJfY3JlYXRlUGFyYW0iLCJyZWFkeSIsInVwZGF0ZSIsImxpc3RlbmVyIiwiYWRkTGlzdGVuZXIiLCJjb25zb2xlIiwibG9nIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0E7QUFDQTs7O0FBR0E7SUFDTUEsTTs7O0FBQ0osa0JBQVlDLE1BQVosRUFBb0JDLElBQXBCLEVBQTBCQyxJQUExQixFQUFnQ0MsS0FBaEMsRUFBdUM7QUFBQTs7QUFBQTs7QUFFckMsVUFBS0gsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsVUFBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsVUFBS0MsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsVUFBS0MsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsVUFBS0MsS0FBTCxHQUFhQyxTQUFiO0FBTnFDO0FBT3RDOzs7O3dCQUVHQyxHLEVBQUs7QUFDUCxXQUFLRixLQUFMLEdBQWFB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LENBQVkzQixJQUFaLENBQWQ7O0FBRUEsVUFBSW9DLEtBQUosRUFBVztBQUNUQSxjQUFNSyxXQUFOLENBQWtCLFFBQWxCLEVBQTRCRCxRQUE1Qjs7QUFFQSxZQUFJSixNQUFNckMsSUFBTixLQUFlLFNBQW5CLEVBQ0V5QyxTQUFTSixNQUFNbEMsS0FBZjtBQUNILE9BTEQsTUFLTztBQUNMd0MsZ0JBQVFDLEdBQVIsQ0FBWSxvQkFBb0IzQyxJQUFwQixHQUEyQixHQUF2QztBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7d0NBT29CQSxJLEVBQU13QyxRLEVBQVU7QUFDbEMsVUFBTUosUUFBUSxLQUFLVCxNQUFMLENBQVkzQixJQUFaLENBQWQ7O0FBRUEsVUFBSW9DLEtBQUosRUFDRUEsTUFBTUosY0FBTixDQUFxQixRQUFyQixFQUErQlEsUUFBL0IsRUFERixLQUdFRSxRQUFRQyxHQUFSLENBQVksb0JBQW9CM0MsSUFBcEIsR0FBMkIsR0FBdkM7QUFDSDs7QUFFRDs7Ozs7Ozs7OzZCQU1TQSxJLEVBQU07QUFDYixhQUFPLEtBQUsyQixNQUFMLENBQVkzQixJQUFaLEVBQWtCRSxLQUF6QjtBQUNEOztBQUVEOzs7Ozs7Ozs7OzsyQkFRT0YsSSxFQUFNSSxHLEVBQTBCO0FBQUEsVUFBckJDLFlBQXFCLHVFQUFOLElBQU07O0FBQ3JDLFVBQU0rQixRQUFRLEtBQUtULE1BQUwsQ0FBWTNCLElBQVosQ0FBZDs7QUFFQSxVQUFJb0MsS0FBSixFQUNFQSxNQUFNRyxNQUFOLENBQWFuQyxHQUFiLEVBQWtCQyxZQUFsQixFQURGLEtBR0VxQyxRQUFRQyxHQUFSLENBQVksK0JBQStCM0MsSUFBL0IsR0FBc0MsR0FBbEQ7QUFDSDs7Ozs7QUFHSCx5QkFBZTRDLFFBQWYsQ0FBd0JyQixVQUF4QixFQUFvQ0MsWUFBcEM7O2tCQUVlQSxZIiwiZmlsZSI6InNldHVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICcuLi8uLi91dGlscy9FdmVudEVtaXR0ZXInO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8qIENPTlRST0wgVU5JVFNcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9QYXJhbSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgdHlwZSwgbmFtZSwgbGFiZWwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHNldCh2YWwpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBfcHJvcGFnYXRlKHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIHRoaXMudmFsdWUpOyAvLyBjYWxsIGV2ZW50IGxpc3RlbmVyc1xuXG4gICAgaWYgKHNlbmRUb1NlcnZlcilcbiAgICAgIHRoaXMucGFyZW50LnNlbmQoJ3VwZGF0ZScsIHRoaXMubmFtZSwgdGhpcy52YWx1ZSk7IC8vIHNlbmQgdG8gc2VydmVyXG5cbiAgICB0aGlzLnBhcmVudC5lbWl0KCd1cGRhdGUnLCB0aGlzLm5hbWUsIHRoaXMudmFsdWUpOyAvLyBjYWxsIHBhcmVudCBsaXN0ZW5lcnNcbiAgfVxuXG4gIHVwZGF0ZSh2YWwsIHNlbmRUb1NlcnZlciA9IHRydWUpIHtcbiAgICB0aGlzLnNldCh2YWwpO1xuICAgIHRoaXMuX3Byb3BhZ2F0ZShzZW5kVG9TZXJ2ZXIpO1xuICB9XG59XG5cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfQm9vbGVhblBhcmFtIGV4dGVuZHMgX1BhcmFtIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBuYW1lLCBsYWJlbCwgaW5pdCkge1xuICAgIHN1cGVyKHBhcmVudCwgJ2Jvb2xlYW4nLCBuYW1lLCBsYWJlbCk7XG4gICAgdGhpcy5zZXQoaW5pdCk7XG4gIH1cblxuICBzZXQodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgfVxufVxuXG4vKiogQHByaXZhdGUgKi9cbmNsYXNzIF9FbnVtUGFyYW0gZXh0ZW5kcyBfUGFyYW0ge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIG5hbWUsIGxhYmVsLCBvcHRpb25zLCBpbml0KSB7XG4gICAgc3VwZXIocGFyZW50LCAnZW51bScsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIGxldCBpbmRleCA9IHRoaXMub3B0aW9ucy5pbmRleE9mKHZhbCk7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfTnVtYmVyUGFyYW0gZXh0ZW5kcyBfUGFyYW0ge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQsIG5hbWUsIGxhYmVsLCBtaW4sIG1heCwgc3RlcCwgaW5pdCkge1xuICAgIHN1cGVyKHBhcmVudCwgJ251bWJlcicsIG5hbWUsIGxhYmVsKTtcbiAgICB0aGlzLm1pbiA9IG1pbjtcbiAgICB0aGlzLm1heCA9IG1heDtcbiAgICB0aGlzLnN0ZXAgPSBzdGVwO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSBNYXRoLm1pbih0aGlzLm1heCwgTWF0aC5tYXgodGhpcy5taW4sIHZhbCkpO1xuICB9XG59XG5cbi8qKiBAcHJpdmF0ZSAqL1xuY2xhc3MgX1RleHRQYXJhbSBleHRlbmRzIF9QYXJhbSB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCwgbmFtZSwgbGFiZWwsIGluaXQpIHtcbiAgICBzdXBlcihwYXJlbnQsICd0ZXh0JywgbmFtZSwgbGFiZWwpO1xuICAgIHRoaXMuc2V0KGluaXQpO1xuICB9XG5cbiAgc2V0KHZhbCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gIH1cbn1cblxuLyoqIEBwcml2YXRlICovXG5jbGFzcyBfVHJpZ2dlclBhcmFtIGV4dGVuZHMgX1BhcmFtIHtcbiAgY29uc3RydWN0b3IocGFyZW50LCBuYW1lLCBsYWJlbCkge1xuICAgIHN1cGVyKHBhcmVudCwgJ3RyaWdnZXInLCBuYW1lLCBsYWJlbCk7XG4gIH1cblxuICBzZXQodmFsKSB7IC8qIG5vdGhpbmcgdG8gc2V0IGhlcmUgKi8gfVxufVxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLXBhcmFtcyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnc2hhcmVkLXBhcmFtcydgIHNlcnZpY2UuXG4gKlxuICogVGhlIGBzaGFyZWQtcGFyYW1zYCBzZXJ2aWNlIGlzIHVzZWQgdG8gbWFpbnRhaW4gYW5kIHVwZGF0ZSBnbG9iYWwgcGFyYW1ldGVyc1xuICogdXNlZCBhbW9uZyBhbGwgY29ubmVjdGVkIGNsaWVudHMuIEVhY2ggZGVmaW5lZCBwYXJhbWV0ZXIgY2FuIGJlIG9mIHRoZVxuICogZm9sbG93aW5nIGRhdGEgdHlwZXM6XG4gKiAtIGJvb2xlYW5cbiAqIC0gZW51bVxuICogLSBudW1iZXJcbiAqIC0gdGV4dFxuICogLSB0cmlnZ2VyXG4gKlxuICogVGhlIHBhcmFtZXRlcnMgYXJlIGNvbmZpZ3VyZWQgaW4gdGhlIHNlcnZlciBzaWRlIGNvdW50ZXJwYXJ0IG9mIHRoZSBzZXJ2aWNlLlxuICpcbiAqIFRvIGNyZWF0ZSBhIGNvbnRyb2wgc3VyZmFjZSBmcm9tIHRoZSBwYXJhbWV0ZXJzIGRlZmluaXRpb25zLCBhIGRlZGljYXRlZCBzY2VuZVxuICogW2BCYXNpY1NoYXJlZENvbnRyb2xsZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQmFzaWNTaGFyZWRDb250cm9sbGVyfVxuICogaXMgYXZhaWxhYmxlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCBhbG9uZyB3aXRoIGl0c1xuICogW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuU2hhcmVkUGFyYW1zfSpfX1xuICpcbiAqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmVcbiAqIGluc3RhbmNpYXRlZCBtYW51YWxseV9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2Ugc3RhcnRzLCBsaXN0ZW4gZm9yIHBhcmFtZXRlciB1cGRhdGVzXG4gKiB0aGlzLnNoYXJlZFBhcmFtcy5hZGRQYXJhbUxpc3RlbmVyKCdzeW50aDpnYWluJywgKHZhbHVlKSA9PiB7XG4gKiAgIHRoaXMuc3ludGguc2V0R2Fpbih2YWx1ZSk7XG4gKiB9KTtcbiAqXG4gKiBAc2VlIFtgQmFzaWNTaGFyZWRDb250cm9sbGVyYCBzY2VuZV17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkJhc2ljU2hhcmVkQ29udHJvbGxlcn1cbiAqL1xuY2xhc3MgU2hhcmVkUGFyYW1zIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICAvKipcbiAgICAgKiBEaWN0aW9uYXJ5IG9mIGFsbCB0aGUgcGFyYW1ldGVycyBhbmQgY29tbWFuZHMuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbmFtZSBwYXJhbXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZFBhcmFtc1xuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnBhcmFtcyA9IHt9O1xuXG4gICAgdGhpcy5fb25Jbml0UmVzcG9uc2UgPSB0aGlzLl9vbkluaXRSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uVXBkYXRlUmVzcG9uc2UgPSB0aGlzLl9vblVwZGF0ZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdpbml0JywgdGhpcy5fb25Jbml0UmVzcG9uc2UpO1xuICAgIHRoaXMucmVjZWl2ZSgndXBkYXRlJywgdGhpcy5fb25VcGRhdGVSZXNwb25zZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gICAgLy8gZG9uJ3QgcmVtb3ZlICd1cGRhdGUnIGxpc3RlbmVyLCBhcyB0aGUgY29udHJvbCBpcyBydW5uaWcgYXMgYSBiYWNrZ3JvdW5kIHByb2Nlc3NcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdpbml0JywgdGhpcy5fb25Jbml0UmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkluaXRSZXNwb25zZShjb25maWcpIHtcbiAgICBjb25maWcuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtID0gdGhpcy5fY3JlYXRlUGFyYW0oZW50cnkpO1xuICAgICAgdGhpcy5wYXJhbXNbcGFyYW0ubmFtZV0gPSBwYXJhbTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25VcGRhdGVSZXNwb25zZShuYW1lLCB2YWwpIHtcbiAgICAvLyB1cGRhdGUsIGJ1dCBkb24ndCBzZW5kIGJhY2sgdG8gc2VydmVyXG4gICAgdGhpcy51cGRhdGUobmFtZSwgdmFsLCBmYWxzZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2NyZWF0ZVBhcmFtKGluaXQpIHtcbiAgICBsZXQgcGFyYW0gPSBudWxsO1xuXG4gICAgc3dpdGNoIChpbml0LnR5cGUpIHtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBwYXJhbSA9IG5ldyBfQm9vbGVhblBhcmFtKHRoaXMsIGluaXQubmFtZSwgaW5pdC5sYWJlbCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdlbnVtJzpcbiAgICAgICAgcGFyYW0gPSBuZXcgX0VudW1QYXJhbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQub3B0aW9ucywgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICBwYXJhbSA9IG5ldyBfTnVtYmVyUGFyYW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsLCBpbml0Lm1pbiwgaW5pdC5tYXgsIGluaXQuc3RlcCwgaW5pdC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgcGFyYW0gPSBuZXcgX1RleHRQYXJhbSh0aGlzLCBpbml0Lm5hbWUsIGluaXQubGFiZWwsIGluaXQudmFsdWUpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAndHJpZ2dlcic6XG4gICAgICAgIHBhcmFtID0gbmV3IF9UcmlnZ2VyUGFyYW0odGhpcywgaW5pdC5uYW1lLCBpbml0LmxhYmVsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtO1xuICB9XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkUGFyYW1zfnBhcmFtQ2FsbGJhY2tcbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBVcGRhdGVkIHZhbHVlIG9mIHRoZSBzaGFyZWQgcGFyYW1ldGVyLlxuICAgKi9cblxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gbGlzdGVuIGEgc3BlY2lmaWMgcGFyYW1ldGVyIGNoYW5nZXMuIFRoZSBsaXN0ZW5lciBpc1xuICAgKiBleGVjdXRlZCBpbW1lZGlhdGVseSB3aGVuIGFkZGVkIHdpdGggdGhlIHBhcmFtZXRlciBjdXJyZW50IHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkUGFyYW1zfnBhcmFtQ2FsbGJhY2t9IGxpc3RlbmVyIC1cbiAgICogIExpc3RlbmVyIHRvIGFkZC5cbiAgICovXG4gIGFkZFBhcmFtTGlzdGVuZXIobmFtZSwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMucGFyYW1zW25hbWVdO1xuXG4gICAgaWYgKHBhcmFtKSB7XG4gICAgICBwYXJhbS5hZGRMaXN0ZW5lcigndXBkYXRlJywgbGlzdGVuZXIpO1xuXG4gICAgICBpZiAocGFyYW0udHlwZSAhPT0gJ3RyaWdnZXInKVxuICAgICAgICBsaXN0ZW5lcihwYXJhbS52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd1bmtub3duIHBhcmFtIFwiJyArIG5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSBsaXN0ZW5pbmcgYSBzcGVjaWZpYyBwYXJhbWV0ZXIgY2hhbmdlcy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZFBhcmFtc35wYXJhbUNhbGxiYWNrfSBsaXN0ZW5lciAtXG4gICAqICBMaXN0ZW5lciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVQYXJhbUxpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKSB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcmFtc1tuYW1lXTtcblxuICAgIGlmIChwYXJhbSlcbiAgICAgIHBhcmFtLnJlbW92ZUxpc3RlbmVyKCd1cGRhdGUnLCBsaXN0ZW5lcik7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gcGFyYW0gXCInICsgbmFtZSArICdcIicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdmFsdWUgb2YgYSBnaXZlbiBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IC0gQ3VycmVudCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgZ2V0VmFsdWUobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtc1tuYW1lXS52YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIHZhbHVlIG9mIGEgcGFyYW1ldGVyICh1c2VkIHdoZW4gYG9wdGlvbnMuaGFzR1VJPXRydWVgKVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsIC0gTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3NlbmRUb1NlcnZlcj10cnVlXSAtIEZsYWcgd2hldGhlciB0aGUgdmFsdWUgc2hvdWxkIGJlXG4gICAqICBwcm9wYWdhdGVkIHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICB1cGRhdGUobmFtZSwgdmFsLCBzZW5kVG9TZXJ2ZXIgPSB0cnVlKSB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcmFtc1tuYW1lXTtcblxuICAgIGlmIChwYXJhbSlcbiAgICAgIHBhcmFtLnVwZGF0ZSh2YWwsIHNlbmRUb1NlcnZlcik7XG4gICAgZWxzZVxuICAgICAgY29uc29sZS5sb2coJ3Vua25vd24gc2hhcmVkIHBhcmFtZXRlciBcIicgKyBuYW1lICsgJ1wiJyk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2hhcmVkUGFyYW1zKTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVkUGFyYW1zO1xuIl19