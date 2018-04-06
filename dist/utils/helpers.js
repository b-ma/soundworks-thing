"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOpt = getOpt;
function getOpt(opt, def) {
  var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -Infinity;
  var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Infinity;

  var val = opt;

  if (val === undefined) val = def;

  return Math.max(min, Math.min(max, val));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNldHVwLmpzIl0sIm5hbWVzIjpbImdldE9wdCIsIm9wdCIsImRlZiIsIm1pbiIsIkluZmluaXR5IiwibWF4IiwidmFsIiwidW5kZWZpbmVkIiwiTWF0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFBZ0JBLE0sR0FBQUEsTTtBQUFULFNBQVNBLE1BQVQsQ0FBZ0JDLEdBQWhCLEVBQXFCQyxHQUFyQixFQUEyRDtBQUFBLE1BQWpDQyxHQUFpQyx1RUFBM0IsQ0FBQ0MsUUFBMEI7QUFBQSxNQUFoQkMsR0FBZ0IsdUVBQVZELFFBQVU7O0FBQ2hFLE1BQUlFLE1BQU1MLEdBQVY7O0FBRUEsTUFBSUssUUFBUUMsU0FBWixFQUNFRCxNQUFNSixHQUFOOztBQUVGLFNBQU9NLEtBQUtILEdBQUwsQ0FBU0YsR0FBVCxFQUFjSyxLQUFLTCxHQUFMLENBQVNFLEdBQVQsRUFBY0MsR0FBZCxDQUFkLENBQVA7QUFDRCIsImZpbGUiOiJzZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBnZXRPcHQob3B0LCBkZWYsIG1pbiA9IC1JbmZpbml0eSwgbWF4ID0gSW5maW5pdHkpIHtcbiAgdmFyIHZhbCA9IG9wdDtcblxuICBpZiAodmFsID09PSB1bmRlZmluZWQpXG4gICAgdmFsID0gZGVmO1xuXG4gIHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKG1heCwgdmFsKSk7XG59O1xuIl19