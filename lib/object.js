"use strict";

function clone(obj) {
	if (obj === undefined) {
		return undefined;
	}
	return JSON.parse(JSON.stringify(obj));
}

function merge(dest, src) {
	return Object.keys(src).reduce(function(dest, key) {
		dest[key] = src[key];
		return dest;
	}, dest);
}

function values(obj) {
	return Object.keys(obj).map(function(key) {
		return obj[key];
	});
}

module.exports = {
	clone: clone,
	merge: merge,
	values: values
};
