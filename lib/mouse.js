"use strict";

var platform = require("./platform");

// prevent springy scrolling on ios
document.ontouchmove = function(e) {
	e.preventDefault();
};

// prevent right-click on desktop
window.oncontextmenu = function() {
	return false;
};

var relMouseCoords = function(canvas, event) {
	var x = event.pageX - canvas.offsetLeft + document.body.scrollLeft;
	var y = event.pageY - canvas.offsetTop + document.body.scrollTop;

	// scale based on ratio of canvas internal dimentions to css dimensions
	var style = window.getComputedStyle(canvas);
	var cw = parseInt(style.width);
	var ch = parseInt(style.height);

	x *= canvas.width / cw;
	y *= canvas.height / ch;

	return {
		x: Math.floor(x),
		y: Math.floor(y)
	};
};

function relMouseCoordsEjecta(canvas, event) {
	var ratioX = canvas.width / window.innerWidth;
	var ratioY = canvas.height / window.innerHeight;
	var x = event.pageX * ratioX;
	var y = event.pageY * ratioY;
	return { x: x, y: y };
}

if (platform.isEjecta()) {
	relMouseCoords = relMouseCoordsEjecta;
}

/**
 * Mouse and touch input handling. An instance of Mouse is available as {@link Splat.Game#mouse}.
 *
 * The first touch will emulates a mouse press with button 0.
 * This means you can use the mouse ({@link Mouse#isPressed}) APIs and your game will work on touch screens (as long as you only need the left button).
 *
 * A mouse press will emulate a touch if the device does not support touch.
 * This means you can use {@link Mouse#touches}, and your game will still work on a PC with a mouse.
 *
 * @constructor
 * @param {external:canvas} canvas The canvas to listen for events on.
 */
function Mouse(canvas) {
	/**
	 * The x coordinate of the cursor relative to the left side of the canvas.
	 * @member {number}
	 */
	this.x = 0;
	/**
	 * The y coordinate of the cursor relative to the top of the canvas.
	 * @member {number}
	 */
	this.y = 0;
	/**
	 * The current button states.
	 * @member {Array}
	 * @private
	 */
	this.buttons = [true, true, true];

	/**
	 * An array of the current touches on a touch screen device. Each touch has a `x`, `y`, and `id` field.
	 * @member {Array}
	 */
	this.touches = [];

	/**
	 * A function that is called when a mouse button or touch is released.
	 * @callback onmouseupHandler
	 * @param {number} x The x coordinate of the mouse or touch that was released.
	 * @param {number} y The y coordinate of the mouse or touch that was released.
	 */
	/**
	 * A function that will be called when a mouse button is released, or a touch has stopped.
	 * This is useful for opening a URL with {@link Splat.openUrl} to avoid popup blockers.
	 * @member {onmouseupHandler}
	 */
	this.onmouseup = undefined;

	var self = this;
	canvas.addEventListener("mousedown", function(event) {
		var m = relMouseCoords(canvas, event);
		self.x = m.x;
		self.y = m.y;
		self.buttons[event.button] = true;
		updateTouchFromMouse();
	});
	canvas.addEventListener("mouseup", function(event) {
		var m = relMouseCoords(canvas, event);
		self.x = m.x;
		self.y = m.y;
		self.buttons[event.button] = false;
		updateTouchFromMouse();
		if (self.onmouseup) {
			self.onmouseup(self.x, self.y);
		}
	});
	canvas.addEventListener("mousemove", function(event) {
		var m = relMouseCoords(canvas, event);
		self.x = m.x;
		self.y = m.y;
		updateTouchFromMouse();
	});

	function updateTouchFromMouse() {
		if (self.supportsTouch()) {
			return;
		}
		var idx = touchIndexById("mouse");
		if (self.isPressed(0)) {
			if (idx !== undefined) {
				var touch = self.touches[idx];
				touch.x = self.x;
				touch.y = self.y;
			} else {
				self.touches.push({
					id: "mouse",
					x: self.x,
					y: self.y
				});
			}
		} else if (idx !== undefined) {
			self.touches.splice(idx, 1);
		}
	}
	function updateMouseFromTouch(touch) {
		self.x = touch.x;
		self.y = touch.y;
		if (self.buttons[0] === false) {
			self.buttons[0] = true;
		}
	}
	function touchIndexById(id) {
		for (var i = 0; i < self.touches.length; i++) {
			if (self.touches[i].id === id) {
				return i;
			}
		}
		return undefined;
	}
	function eachChangedTouch(event, onChangeFunc) {
		var touches = event.changedTouches;
		for (var i = 0; i < touches.length; i++) {
			onChangeFunc(touches[i]);
		}
	}
	canvas.addEventListener("touchstart", function(event) {
		eachChangedTouch(event, function(touch) {
			var t = relMouseCoords(canvas, touch);
			t.id = touch.identifier;
			if (self.touches.length === 0) {
				t.isMouse = true;
				updateMouseFromTouch(t);
			}
			self.touches.push(t);
		});
	});
	canvas.addEventListener("touchmove", function(event) {
		eachChangedTouch(event, function(touch) {
			var idx = touchIndexById(touch.identifier);
			var t = self.touches[idx];
			var coords = relMouseCoords(canvas, touch);
			t.x = coords.x;
			t.y = coords.y;
			if (t.isMouse) {
				updateMouseFromTouch(t);
			}
		});
	});
	canvas.addEventListener("touchend", function(event) {
		eachChangedTouch(event, function(touch) {
			var idx = touchIndexById(touch.identifier);
			var t = self.touches.splice(idx, 1)[0];
			if (t.isMouse) {
				if (self.touches.length === 0) {
					self.buttons[0] = 0;
				} else {
					self.touches[0].isMouse = true;
					updateMouseFromTouch(self.touches[0]);
				}
			}
			if (self.onmouseup) {
				self.onmouseup(t.x, t.y);
			}
		});
	});
}
/**
 * Test whether the device supports touch events. This is useful to customize messages to say either "click" or "tap".
 * @returns {boolean}
 */
Mouse.prototype.supportsTouch = function() {
	return "ontouchstart" in window || navigator.msMaxTouchPoints;
};
/**
 * Test if a mouse button is currently pressed.
 * @param {number} button The button number to test. Button 0 is typically the left mouse button, as well as the first touch location.
 * @returns {boolean}
 */
Mouse.prototype.isPressed = function(button) {
	return this.buttons[button];
};

module.exports = Mouse;
