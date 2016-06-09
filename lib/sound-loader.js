"use strict";

var AssetLoader = require("./assets/asset-loader");
var loadSound = require("./assets/load-sound");

window.AudioContext = window.AudioContext || window.webkitAudioContext;

/**
 * Loads sound files and lets you know when they're all available. An instance of SoundLoader is available as {@link Splat.Game#sounds}.
 * This implementation uses the Web Audio API, and if that is not available it automatically falls back to the HTML5 &lt;audio&gt; tag.
 * @constructor
 */
function SoundLoader(manifest) {
  /**
   * A flag signifying if sounds have been muted through {@link SoundLoader#mute}.
   * @member {boolean}
   * @private
   */
  this.muted = false;
  /**
   * A key-value object that stores named looping sounds.
   * @member {object}
   * @private
   */
  this.looping = {};

  /**
   * The Web Audio API AudioContext
   * @member {external:AudioContext}
   * @private
   */
  this.context = new window.AudioContext();

  this.gainNode = this.context.createGain();
  this.gainNode.connect(this.context.destination);
  this.volume = this.gainNode.gain.value;
  this.installSafariWorkaround();
  this.assets = new AssetLoader(manifest, loadSound.bind(undefined, this.context));
}
SoundLoader.prototype.installSafariWorkaround = function() {
  // safari on iOS mutes sounds until they're played in response to user input
  // play a dummy sound on first touch
  var firstTouchHandler = function() {
    window.removeEventListener("click", firstTouchHandler);
    window.removeEventListener("keydown", firstTouchHandler);
    window.removeEventListener("touchstart", firstTouchHandler);

    var source = this.context.createOscillator();
    source.connect(this.gainNode);
    source.start(0);
    source.stop(0);

    if (this.firstPlay) {
      this.play(this.firstPlay, this.firstPlayLoop);
    } else {
      this.firstPlay = "workaround";
    }
  }.bind(this);
  window.addEventListener("click", firstTouchHandler);
  window.addEventListener("keydown", firstTouchHandler);
  window.addEventListener("touchstart", firstTouchHandler);
};
/**
 * Play a sound.
 * @param {string} name The name given to the sound during {@link SoundLoader#load}
 * @param {Object} [loop=undefined] A hash containing loopStart and loopEnd options. To stop a looped sound use {@link SoundLoader#stop}.
 */
SoundLoader.prototype.play = function(name, loop) {
  if (loop && this.looping[name]) {
    return;
  }
  if (!this.firstPlay) {
    // let the iOS user input workaround handle it
    this.firstPlay = name;
    this.firstPlayLoop = loop;
    return;
  }
  var snd = this.assets.get(name);
  if (snd === undefined) {
    console.error("Unknown sound: " + name);
  }
  var source = this.context.createBufferSource();
  source.buffer = snd;
  source.connect(this.gainNode);
  if (loop) {
    source.loop = true;
    source.loopStart = loop.loopStart || 0;
    source.loopEnd = loop.loopEnd || 0;
    this.looping[name] = source;
  }
  source.start(0);
};
/**
 * Stop playing a sound. This currently only stops playing a sound that was looped earlier, and doesn't stop a sound mid-play. Patches welcome.
 * @param {string} name The name given to the sound during {@link SoundLoader#load}
 */
SoundLoader.prototype.stop = function(name) {
  if (!this.looping[name]) {
    return;
  }
  this.looping[name].stop(0);
  delete this.looping[name];
};
/**
 * Silence all sounds. Sounds keep playing, but at zero volume. Call {@link SoundLoader#unmute} to restore the previous volume level.
 */
SoundLoader.prototype.mute = function() {
  this.gainNode.gain.value = 0;
  this.muted = true;
};
/**
 * Restore volume to whatever value it was before {@link SoundLoader#mute} was called.
 */
SoundLoader.prototype.unmute = function() {
  this.gainNode.gain.value = this.volume;
  this.muted = false;
};
/**
 * Set the volume of all sounds.
 * @param {number} gain The desired volume level. A number between 0.0 and 1.0, with 0.0 being silent, and 1.0 being maximum volume.
 */
SoundLoader.prototype.setVolume = function(gain) {
  this.volume = gain;
  this.gainNode.gain.value = gain;
  this.muted = false;
};
/**
 * Test if the volume is currently muted.
 * @return {boolean} True if the volume is currently muted.
 */
SoundLoader.prototype.isMuted = function() {
  return this.muted;
};


function FakeSoundLoader() {}
FakeSoundLoader.prototype.play = function() {};
FakeSoundLoader.prototype.stop = function() {};
FakeSoundLoader.prototype.mute = function() {};
FakeSoundLoader.prototype.unmute = function() {};
FakeSoundLoader.prototype.setVolume = function() {};
FakeSoundLoader.prototype.isMuted = function() {
  return true;
};

if (window.AudioContext) {
  module.exports = SoundLoader;
} else {
  console.warn("This browser doesn't support the Web Audio API.");
  module.exports = FakeSoundLoader;
}
