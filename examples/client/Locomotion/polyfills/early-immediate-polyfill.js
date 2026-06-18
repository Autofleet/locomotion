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
