'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _socket2 = require('socket.io-client');

var _socket3 = _interopRequireDefault(_socket2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('soundworks:socket');

var socket = {
  /**
   * Store the instance of Socket.io Manager.
   */
  socket: null,

  /**
   * Is set to `true` when a `Activity` that requires network is instanciated.
   * Is checked by the `client` to initialize the connection or not.
   */
  required: false,

  /**
   * Initialize a namespaced connection with given options.
   *
   * @param {String} namespace - Correspond to the `client.type` {@link client}.
   * @param {Object} options - Options of the socket.
   * @param {String} options.url - The url where the socket should connect.
   * @param {Array<String>} options.transports - The transports to use for the socket (cf. socket.io).
   * @param {Array<String>} options.path - Defines where socket should find the `socket.io` file.
   */
  init: function init(namespace, options) {
    this.socket = (0, _socket3.default)(options.url + '/' + namespace, {
      transports: options.transports,
      path: options.path
    });

    this.socket.on('error', function () {
      var _console;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_console = console).error.apply(_console, ['error'].concat(args));
    });

    log('initialized\n          - url: ' + options.url + '/' + namespace + '\n          - transports: ' + options.transports + '\n          - path: ' + options.path + '\n    ');

    this._stateListeners = new _set2.default();
    this._state = null;

    this._listenSocketState();
  },


  /**
   * Listen to the different states of the socket.
   *
   * @param {Function} callback - The function to be called when the state
   *  of the socket changes, the given function is called with the name of the
   *  event as argument.
   * @see {http://socket.io/docs/client-api/#socket}
   */
  addStateListener: function addStateListener(callback) {
    this._stateListeners.add(callback);

    if (this._state !== null) callback(this._state);
  },
  _listenSocketState: function _listenSocketState() {
    var _this = this;

    // see: http://socket.io/docs/client-api/#socket
    ['connect', 'reconnect', 'disconnect', 'connect_error', 'reconnect_attempt', 'reconnecting', 'reconnect_error', 'reconnect_failed'].forEach(function (eventName) {
      _this.socket.on(eventName, function () {
        _this._state = eventName;
        _this._stateListeners.forEach(function (listener) {
          return listener(_this._state);
        });
        log('state - ' + _this._state);
      });
    });
  },


  /**
   * Sends a WebSocket message to the server side socket.
   *
   * @param {String} channel - The channel of the message.
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send: function send(channel) {
    var _socket;

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    (_socket = this.socket).emit.apply(_socket, [channel].concat((0, _toConsumableArray3.default)(args)));
    log.apply(undefined, ['send - channel: "' + channel + '"'].concat((0, _toConsumableArray3.default)(args)));
  },
  sendVolatile: function sendVolatile(channel) {
    var _socket$volatile;

    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    (_socket$volatile = this.socket.volatile).emit.apply(_socket$volatile, [channel].concat((0, _toConsumableArray3.default)(args)));
    log.apply(undefined, ['sendVolatile - channel: "' + channel + '"'].concat((0, _toConsumableArray3.default)(args)));
  },


  /**
   * Listen a WebSocket message from the server.
   *
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive: function receive(channel, callback) {
    this.socket.removeListener(channel, callback);
    this.socket.on(channel, callback);
    log('receive listener - channel: "' + channel + '"');
  },


  /**
   * Stop listening to a message from the server.
   *
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener: function removeListener(channel, callback) {
    this.socket.removeListener(channel, callback);
    log('remove listener - channel: "' + channel + '"');
  }
};

exports.default = socket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzb2NrZXQiLCJyZXF1aXJlZCIsImluaXQiLCJuYW1lc3BhY2UiLCJvcHRpb25zIiwidXJsIiwidHJhbnNwb3J0cyIsInBhdGgiLCJvbiIsImFyZ3MiLCJlcnJvciIsIl9zdGF0ZUxpc3RlbmVycyIsIl9zdGF0ZSIsIl9saXN0ZW5Tb2NrZXRTdGF0ZSIsImFkZFN0YXRlTGlzdGVuZXIiLCJjYWxsYmFjayIsImFkZCIsImZvckVhY2giLCJldmVudE5hbWUiLCJsaXN0ZW5lciIsInNlbmQiLCJjaGFubmVsIiwiZW1pdCIsInNlbmRWb2xhdGlsZSIsInZvbGF0aWxlIiwicmVjZWl2ZSIsInJlbW92ZUxpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE1BQU0scUJBQU0sbUJBQU4sQ0FBWjs7QUFFQSxJQUFNQyxTQUFTO0FBQ2I7OztBQUdBQSxVQUFRLElBSks7O0FBTWI7Ozs7QUFJQUMsWUFBVSxLQVZHOztBQVliOzs7Ozs7Ozs7QUFTQUMsTUFyQmEsZ0JBcUJSQyxTQXJCUSxFQXFCR0MsT0FyQkgsRUFxQlk7QUFDdkIsU0FBS0osTUFBTCxHQUFjLHNCQUFPSSxRQUFRQyxHQUFmLFNBQXNCRixTQUF0QixFQUFtQztBQUMvQ0csa0JBQVlGLFFBQVFFLFVBRDJCO0FBRS9DQyxZQUFNSCxRQUFRRztBQUZpQyxLQUFuQyxDQUFkOztBQUtBLFNBQUtQLE1BQUwsQ0FBWVEsRUFBWixDQUFlLE9BQWYsRUFBd0IsWUFBYTtBQUFBOztBQUFBLHdDQUFUQyxJQUFTO0FBQVRBLFlBQVM7QUFBQTs7QUFDbkMsMkJBQVFDLEtBQVIsa0JBQWMsT0FBZCxTQUEwQkQsSUFBMUI7QUFDRCxLQUZEOztBQUlBViwyQ0FDZUssUUFBUUMsR0FEdkIsU0FDOEJGLFNBRDlCLGtDQUVzQkMsUUFBUUUsVUFGOUIsNEJBR2dCRixRQUFRRyxJQUh4Qjs7QUFNQSxTQUFLSSxlQUFMLEdBQXVCLG1CQUF2QjtBQUNBLFNBQUtDLE1BQUwsR0FBYyxJQUFkOztBQUVBLFNBQUtDLGtCQUFMO0FBQ0QsR0F6Q1k7OztBQTJDYjs7Ozs7Ozs7QUFRQUMsa0JBbkRhLDRCQW1ESUMsUUFuREosRUFtRGM7QUFDekIsU0FBS0osZUFBTCxDQUFxQkssR0FBckIsQ0FBeUJELFFBQXpCOztBQUVBLFFBQUksS0FBS0gsTUFBTCxLQUFnQixJQUFwQixFQUNFRyxTQUFTLEtBQUtILE1BQWQ7QUFDSCxHQXhEWTtBQTBEYkMsb0JBMURhLGdDQTBEUTtBQUFBOztBQUNuQjtBQUNBLEtBQUUsU0FBRixFQUNFLFdBREYsRUFFRSxZQUZGLEVBR0UsZUFIRixFQUlFLG1CQUpGLEVBS0UsY0FMRixFQU1FLGlCQU5GLEVBT0Usa0JBUEYsRUFRRUksT0FSRixDQVFVLFVBQUNDLFNBQUQsRUFBZTtBQUN2QixZQUFLbEIsTUFBTCxDQUFZUSxFQUFaLENBQWVVLFNBQWYsRUFBMEIsWUFBTTtBQUM5QixjQUFLTixNQUFMLEdBQWNNLFNBQWQ7QUFDQSxjQUFLUCxlQUFMLENBQXFCTSxPQUFyQixDQUE2QixVQUFDRSxRQUFEO0FBQUEsaUJBQWNBLFNBQVMsTUFBS1AsTUFBZCxDQUFkO0FBQUEsU0FBN0I7QUFDQWIseUJBQWUsTUFBS2EsTUFBcEI7QUFDRCxPQUpEO0FBS0QsS0FkRDtBQWVELEdBM0VZOzs7QUE2RWI7Ozs7OztBQU1BUSxNQW5GYSxnQkFtRlJDLE9BbkZRLEVBbUZVO0FBQUE7O0FBQUEsdUNBQU5aLElBQU07QUFBTkEsVUFBTTtBQUFBOztBQUNyQixvQkFBS1QsTUFBTCxFQUFZc0IsSUFBWixpQkFBaUJELE9BQWpCLDBDQUE2QlosSUFBN0I7QUFDQVYsZ0RBQXdCc0IsT0FBeEIsZ0RBQXVDWixJQUF2QztBQUNELEdBdEZZO0FBd0ZiYyxjQXhGYSx3QkF3RkFGLE9BeEZBLEVBd0ZrQjtBQUFBOztBQUFBLHVDQUFOWixJQUFNO0FBQU5BLFVBQU07QUFBQTs7QUFDN0IsNkJBQUtULE1BQUwsQ0FBWXdCLFFBQVosRUFBcUJGLElBQXJCLDBCQUEwQkQsT0FBMUIsMENBQXNDWixJQUF0QztBQUNBVix3REFBZ0NzQixPQUFoQyxnREFBK0NaLElBQS9DO0FBQ0QsR0EzRlk7OztBQTZGYjs7Ozs7O0FBTUFnQixTQW5HYSxtQkFtR0xKLE9BbkdLLEVBbUdJTixRQW5HSixFQW1HYztBQUN6QixTQUFLZixNQUFMLENBQVkwQixjQUFaLENBQTJCTCxPQUEzQixFQUFvQ04sUUFBcEM7QUFDQSxTQUFLZixNQUFMLENBQVlRLEVBQVosQ0FBZWEsT0FBZixFQUF3Qk4sUUFBeEI7QUFDQWhCLDBDQUFvQ3NCLE9BQXBDO0FBQ0QsR0F2R1k7OztBQXlHYjs7Ozs7O0FBTUFLLGdCQS9HYSwwQkErR0VMLE9BL0dGLEVBK0dXTixRQS9HWCxFQStHcUI7QUFDaEMsU0FBS2YsTUFBTCxDQUFZMEIsY0FBWixDQUEyQkwsT0FBM0IsRUFBb0NOLFFBQXBDO0FBQ0FoQix5Q0FBbUNzQixPQUFuQztBQUNEO0FBbEhZLENBQWY7O2tCQXFIZXJCLE0iLCJmaWxlIjoic29ja2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBzaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnNvY2tldCcpO1xuXG5jb25zdCBzb2NrZXQgPSB7XG4gIC8qKlxuICAgKiBTdG9yZSB0aGUgaW5zdGFuY2Ugb2YgU29ja2V0LmlvIE1hbmFnZXIuXG4gICAqL1xuICBzb2NrZXQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIElzIHNldCB0byBgdHJ1ZWAgd2hlbiBhIGBBY3Rpdml0eWAgdGhhdCByZXF1aXJlcyBuZXR3b3JrIGlzIGluc3RhbmNpYXRlZC5cbiAgICogSXMgY2hlY2tlZCBieSB0aGUgYGNsaWVudGAgdG8gaW5pdGlhbGl6ZSB0aGUgY29ubmVjdGlvbiBvciBub3QuXG4gICAqL1xuICByZXF1aXJlZDogZmFsc2UsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYSBuYW1lc3BhY2VkIGNvbm5lY3Rpb24gd2l0aCBnaXZlbiBvcHRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlIC0gQ29ycmVzcG9uZCB0byB0aGUgYGNsaWVudC50eXBlYCB7QGxpbmsgY2xpZW50fS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIG9mIHRoZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnVybCAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGQgY29ubmVjdC5cbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLnRyYW5zcG9ydHMgLSBUaGUgdHJhbnNwb3J0cyB0byB1c2UgZm9yIHRoZSBzb2NrZXQgKGNmLiBzb2NrZXQuaW8pLlxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IG9wdGlvbnMucGF0aCAtIERlZmluZXMgd2hlcmUgc29ja2V0IHNob3VsZCBmaW5kIHRoZSBgc29ja2V0LmlvYCBmaWxlLlxuICAgKi9cbiAgaW5pdChuYW1lc3BhY2UsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnNvY2tldCA9IHNpbyhgJHtvcHRpb25zLnVybH0vJHtuYW1lc3BhY2V9YCwge1xuICAgICAgdHJhbnNwb3J0czogb3B0aW9ucy50cmFuc3BvcnRzLFxuICAgICAgcGF0aDogb3B0aW9ucy5wYXRoLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zb2NrZXQub24oJ2Vycm9yJywgKC4uLmFyZ3MpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yJywgLi4uYXJncyk7XG4gICAgfSk7XG5cbiAgICBsb2coYGluaXRpYWxpemVkXG4gICAgICAgICAgLSB1cmw6ICR7b3B0aW9ucy51cmx9LyR7bmFtZXNwYWNlfVxuICAgICAgICAgIC0gdHJhbnNwb3J0czogJHtvcHRpb25zLnRyYW5zcG9ydHN9XG4gICAgICAgICAgLSBwYXRoOiAke29wdGlvbnMucGF0aH1cbiAgICBgKTtcblxuICAgIHRoaXMuX3N0YXRlTGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcblxuICAgIHRoaXMuX2xpc3RlblNvY2tldFN0YXRlKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiB0byB0aGUgZGlmZmVyZW50IHN0YXRlcyBvZiB0aGUgc29ja2V0LlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgc3RhdGVcbiAgICogIG9mIHRoZSBzb2NrZXQgY2hhbmdlcywgdGhlIGdpdmVuIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIHRoZSBuYW1lIG9mIHRoZVxuICAgKiAgZXZlbnQgYXMgYXJndW1lbnQuXG4gICAqIEBzZWUge2h0dHA6Ly9zb2NrZXQuaW8vZG9jcy9jbGllbnQtYXBpLyNzb2NrZXR9XG4gICAqL1xuICBhZGRTdGF0ZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fc3RhdGVMaXN0ZW5lcnMuYWRkKGNhbGxiYWNrKTtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSAhPT0gbnVsbClcbiAgICAgIGNhbGxiYWNrKHRoaXMuX3N0YXRlKTtcbiAgfSxcblxuICBfbGlzdGVuU29ja2V0U3RhdGUoKSB7XG4gICAgLy8gc2VlOiBodHRwOi8vc29ja2V0LmlvL2RvY3MvY2xpZW50LWFwaS8jc29ja2V0XG4gICAgWyAnY29ubmVjdCcsXG4gICAgICAncmVjb25uZWN0JyxcbiAgICAgICdkaXNjb25uZWN0JyxcbiAgICAgICdjb25uZWN0X2Vycm9yJyxcbiAgICAgICdyZWNvbm5lY3RfYXR0ZW1wdCcsXG4gICAgICAncmVjb25uZWN0aW5nJyxcbiAgICAgICdyZWNvbm5lY3RfZXJyb3InLFxuICAgICAgJ3JlY29ubmVjdF9mYWlsZWQnXG4gICAgXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIHRoaXMuc29ja2V0Lm9uKGV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IGV2ZW50TmFtZTtcbiAgICAgICAgdGhpcy5fc3RhdGVMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IGxpc3RlbmVyKHRoaXMuX3N0YXRlKSk7XG4gICAgICAgIGxvZyhgc3RhdGUgLSAke3RoaXMuX3N0YXRlfWApO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgICBsb2coYHNlbmQgLSBjaGFubmVsOiBcIiR7Y2hhbm5lbH1cImAsIC4uLmFyZ3MpO1xuICB9LFxuXG4gIHNlbmRWb2xhdGlsZShjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgdGhpcy5zb2NrZXQudm9sYXRpbGUuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgICBsb2coYHNlbmRWb2xhdGlsZSAtIGNoYW5uZWw6IFwiJHtjaGFubmVsfVwiYCwgLi4uYXJncyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHRoaXMuc29ja2V0LnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgICB0aGlzLnNvY2tldC5vbihjaGFubmVsLCBjYWxsYmFjayk7XG4gICAgbG9nKGByZWNlaXZlIGxpc3RlbmVyIC0gY2hhbm5lbDogXCIke2NoYW5uZWx9XCJgKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgdG8gYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBjYW5jZWwuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHRoaXMuc29ja2V0LnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgICBsb2coYHJlbW92ZSBsaXN0ZW5lciAtIGNoYW5uZWw6IFwiJHtjaGFubmVsfVwiYCk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzb2NrZXQ7XG4iXX0=