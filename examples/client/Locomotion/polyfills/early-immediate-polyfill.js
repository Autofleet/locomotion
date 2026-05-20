/**
 * Early polyfill loaded before any other JS in the bundle.
 *
 * On React Native 0.76 + Hermes, the LogBox "Fusebox warnings migration" path
 * can fire during bootstrap (e.g. via a NativeEventEmitter warning emitted
 * from the very first module that constructs one) BEFORE InitializeCore has
 * lazily defined `setImmediate` / `clearImmediate` via `polyfillGlobal`.
 *
 * When that happens, Hermes throws "Property 'setImmediate' doesn't exist"
 * from inside LogBox / StatusBar / InteractionManager, bricking startup with
 * a red-screen on Android and a white screen on iOS.
 *
 * We define a minimal setTimeout-backed implementation here, registered as
 * the first item in the Metro polyfills array, so by the time InitializeCore
 * runs and replaces these with the lazy getters, nothing has crashed. The
 * later polyfill replaces these definitions because polyfillGlobal uses
 * defineLazyObjectProperty with the same name (RN's normal behaviour).
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
