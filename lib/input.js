var Keyboard = require("game-keyboard");
var keyMap = require("game-keyboard/key_map").US;
var keyboard = new Keyboard(keyMap);
var Mouse = require("./mouse");

function Input(config, canvas) {
  this.config = config;
  this.gamepads = require("html5-gamepad");
  this.mouse = new Mouse(canvas);
  this.lastButtonState = {};
  this.delayedButtonUpdates = {};
  this.virtualAxes = {};
  this.virtualButtons = {};
}
Input.prototype.axis = function(name) {
  var input = this.config.axes[name];
  if (input === undefined) {
    console.error("No such axis: " + name);
    return 0;
  }
  var val = 0;
  for (var i = 0; i < input.length; i++) {
    var physicalInput = input[i];
    var device = physicalInput.device;
    if (device === "mouse") {
      if (physicalInput.axis === "x") {
        val = this.mouse.x;
      }
      if (physicalInput.axis === "y") {
        val = this.mouse.y;
      }
    }
    if (device === "gamepad" && this.gamepads[0]) {
      val = this.gamepads[0].axis(physicalInput.axis);
    }
    if (device === "virtual") {
      val = physicalInput.state;
    }
    if (val !== 0) {
      break;
    }
  }
  return val;
};
Input.prototype.button = function(name) {
  var input = this.config.buttons[name];
  if (input === undefined) {
    console.error("No such button: " + name);
    return false;
  }
  for (var i = 0; i < input.length; i++) {
    var physicalInput = input[i];
    var device = physicalInput.device;
    if (device === "keyboard") {
      if (keyboard.isPressed(physicalInput.button)) {
        return true;
      }
    }
    if (device === "mouse") {
      if (this.mouse.isPressed(physicalInput.button)) {
        return true;
      }
    }
    if (device === "gamepad" && this.gamepads[0]) {
      if (this.gamepads[0].button(physicalInput.button)) {
        return true;
      }
    }
    if (device === "virtual") {
      if (physicalInput.state) {
        return true;
      }
    }
  }
  return false;
};
Input.prototype.buttonPressed = function(name) {
  var current = this.button(name);
  var last = this.lastButtonState[name];
  if (last === undefined) {
    last = true;
  }
  this.delayedButtonUpdates[name] = current;
  return current && !last;
};
Input.prototype.buttonReleased = function(name) {
  var current = this.button(name);
  var last = this.lastButtonState[name];
  if (last === undefined) {
    last = false;
  }
  this.delayedButtonUpdates[name] = current;
  return !current && last;
};
Input.prototype.setAxis = function(name, instance, state) {
  var virtualName = name + "|" + instance;
  var virtual = this.virtualAxes[virtualName];
  if (virtual) {
    virtual.state = state;
  } else {
    virtual = {
      device: "virtual",
      state: state
    };
    this.virtualAxes[virtualName] = virtual;
    var inputs = this.config.axes[name];
    if (inputs) {
      inputs.push(virtual);
    } else {
      this.config.axes[name] = [virtual];
    }
  }
};
Input.prototype.setButton = function(name, instance, state) {
  var virtualName = name + "|" + instance;
  var virtual = this.virtualButtons[virtualName];
  if (virtual) {
    virtual.state = state;
  } else {
    virtual = {
      device: "virtual",
      state: state
    };
    this.virtualButtons[virtualName] = virtual;
    var inputs = this.config.buttons[name];
    if (inputs) {
      inputs.push(virtual);
    } else {
      this.config.buttons[name] = [virtual];
    }
  }
};
Input.prototype.processUpdates = function() {
  if (typeof window.navigator.getGamepads === "function") {
    window.navigator.getGamepads();
  }
  Object.keys(this.delayedButtonUpdates).forEach(function(name) {
    this.lastButtonState[name] = this.delayedButtonUpdates[name];
    delete this.delayedButtonUpdates[name];
  }.bind(this));
};

module.exports = Input;
