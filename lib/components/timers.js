/**
 * A named group of timers. Each key is the name of a timer, and the value is a {@link Components.timer}.
 * @typedef {Object} timers
 * @memberof Components
 */
/**
 * Measure time or run code after a duration.
 * @typedef {Object} timer
 * @memberof Components
 * @property {bool} loop - <code>true</code> if the timer should repeat after it reaches <code>max</code>.
 * @property {float} max - The maximum amount of time to accumulate. If <code>time</code> reaches <code>max</code>, then <code>time</code> will be set to <code>0</code> and <code>running</code> will be set to <code>false</code>.
 * @property {bool} running - Determines if the timer is accumulating time.
 * @property {string} script - The <code>require</code> path to a script to run when the timer is reset. The path is relative to your game's <code>src</code> folder. For example <code>./scripts/next-scene</code> might execute the code in <code>/src/scripts/next-scene.js</code>.
 * @property {float} time - The amount of time, in milliseconds, the timer has accumulated.
 */

export default {
  factory: function () {
    return {};
  },
  reset: function (timers) {
    var names = Object.keys(timers);
    for (var i = 0; i < names.length; i++) {
      delete timers[name[i]];
    }
  },
};
