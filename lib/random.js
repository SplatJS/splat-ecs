"use strict";

/** @module splat-ecs/lib/random */

module.exports = {
    /**
     * Get a pseudo-random number between the minimum (inclusive) and maximum (exclusive) parameters.
     * @function inRange
     * @param {number} min Inclusive minimum value for the random number
     * @param {number} max Exclusive maximum value for the random number
     * @returns {number} A number between <code>min</code> and <code>max</code>
     * @see [Bracket Notation: Inclusion and Exclusion]{@link https://en.wikipedia.org/wiki/Bracket_%28mathematics%29#Intervals}
     * @example
var random = require("splat-ecs/lib/random");
random.inRange(0, 1) // Returns 0.345822917402371
random.inRange(10, 100) // Returns 42.4823819274931274
     */
	"inRange": function(min, max) {
		return min + Math.random() * (max - min);
	},

    /**
     * Get a random element in an array
     * @function from
     * @param {array} array Array of elements to choose from
     * @returns {Object} A random element from the given array
     * @example
var random = require("splat-ecs/lib/random");
var fruit = ["Apple", "Banana", "Orange", "Peach"];
random.from(fruit); // Could return "Orange"
random.from(fruit); // Could return "Apple"
random.from(fruit); // Could return "Peach"
random.from(fruit); // Could return "Banana"
     */
	"from": function(array) {
		return array[Math.floor(Math.random() * array.length)];
	}
};
