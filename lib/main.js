import buffer from "./buffer";
import ads from "./ads";
import AStar from "./astar";
import BinaryHeap from "./binary-heap";
import Game from "./game";
import iap from "./iap";
import Input from "./input";
import leaderboards from "./leaderboards";
import math from "./math";
import openUrl from "./openUrl";
import NinePatch from "./ninepatch";
import Particles from "./particles";
import saveData from "./save-data";
import Scene from "./scene";

/**
 * @namespace Splat
 */
export default {
  makeBuffer: buffer.makeBuffer,
  flipBufferHorizontally: buffer.flipBufferHorizontally,
  flipBufferVertically: buffer.flipBufferVertically,

  ads,
  AStar,
  BinaryHeap,
  Game,
  iap,
  Input,
  leaderboards,
  math,
  openUrl,
  NinePatch,
  Particles,
  saveData,
  Scene,
};
