"use strict";

module.exports = {
	"inRange": function(min, max) {
		return min + Math.random() * (max - min);
	},
	"from": function(array) {
		return array[Math.floor(Math.random() * array.length)];
	}
};
