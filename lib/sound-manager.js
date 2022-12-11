import AssetLoader from "./assets/asset-loader";
import loadSound from "./assets/load-sound";

window.AudioContext = window.AudioContext || window.webkitAudioContext;

/**
 * Plays audio, tracks looping sounds, and manages volume.
 * This implementation uses the Web Audio API.
 * @constructor
 * @param {Object} manifest A hash where the key is the name of a sound, and the value is the URL of a sound file.
 */
function SoundManager(manifest) {
  /**
   * A flag signifying if sounds have been muted through {@link SoundManager#mute}.
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
  this.assets = new AssetLoader(
    manifest,
    loadSound.bind(undefined, this.context)
  );
}
SoundManager.prototype.installSafariWorkaround = function () {
  // safari on iOS mutes sounds until they're played in response to user input
  // play a dummy sound on first touch
  var firstTouchHandler = function () {
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
 * @param {string} name The name of the sound to play.
 * @param {Object} [loop=undefined] A hash containing loopStart and loopEnd options. To stop a looped sound use {@link SoundManager#stop}.
 */
SoundManager.prototype.play = function (name, loop) {
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
    return;
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
 * @param {string} name The name of the sound to stop looping.
 */
SoundManager.prototype.stop = function (name) {
  if (!this.looping[name]) {
    return;
  }
  this.looping[name].stop(0);
  delete this.looping[name];
};
/**
 * Silence all sounds. Sounds keep playing, but at zero volume. Call {@link SoundManager#unmute} to restore the previous volume level.
 */
SoundManager.prototype.mute = function () {
  this.gainNode.gain.value = 0;
  this.muted = true;
};
/**
 * Restore volume to whatever value it was before {@link SoundManager#mute} was called.
 */
SoundManager.prototype.unmute = function () {
  this.gainNode.gain.value = this.volume;
  this.muted = false;
};
/**
 * Set the volume of all sounds.
 * @param {number} gain The desired volume level. A number between 0.0 and 1.0, with 0.0 being silent, and 1.0 being maximum volume.
 */
SoundManager.prototype.setVolume = function (gain) {
  this.volume = gain;
  this.gainNode.gain.value = gain;
  this.muted = false;
};
/**
 * Test if the volume is currently muted.
 * @return {boolean} True if the volume is currently muted.
 */
SoundManager.prototype.isMuted = function () {
  return this.muted;
};

function FakeSoundManager() {}
FakeSoundManager.prototype.play = function () {};
FakeSoundManager.prototype.stop = function () {};
FakeSoundManager.prototype.mute = function () {};
FakeSoundManager.prototype.unmute = function () {};
FakeSoundManager.prototype.setVolume = function () {};
FakeSoundManager.prototype.isMuted = function () {
  return true;
};

let sound;
if (window.AudioContext) {
  sound = SoundManager;
} else {
  console.warn("This browser doesn't support the Web Audio API.");
  sound = FakeSoundManager;
}
export default sound;
