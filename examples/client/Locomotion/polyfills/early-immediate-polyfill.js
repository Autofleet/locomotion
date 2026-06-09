/**
 * Defines setImmediate/clearImmediate before RN's lazy polyfill, to guard the
 * Hermes bootstrap race where an early LogBox warning hits setImmediate before
 * InitializeCore defines it (white/red screen on launch). See react-native#49739.
 */
(function () {
  if (typeof global.setImmediate !== 'function') {
    global.setImmediate = function (fn) {
      var rest = Array.prototype.slice.call(arguments, 1);
      return setTimeout(function () {
        fn.apply(undefined, rest);
      }, 0);
    };
  }
  if (typeof global.clearImmediate !== 'function') {
    global.clearImmediate = function (id) {
      clearTimeout(id);
    };
  }
})();
