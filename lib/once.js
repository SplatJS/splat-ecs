"use strict";

module.exports = function(fn) {
	var called = false;
	return function() {
		if (!called) {
			called = true;
			return fn.apply(this, arguments);
		}
	};
};
