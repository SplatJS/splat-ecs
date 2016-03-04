![Splat ECS](./images/splat-ecs-logo.png)

A 2d HTML5 Canvas game engine

Splat ECS is a 2d game engine made for creating multi-platform games entirely in JavaScript. Splat ECS is built around the [Entity Component System](https://github.com/ericlathrop/entity-component-system) pattern, which is flexible and promotes composition of behaviors.

# Features

* Rectangles!
* Keyboard, mouse, and touch input
* Sounds and music (Web Audio API and HTML5 Audio)
* Sprite animation
* Asset loading, and built-in loading screen
* Games work well on phones, tablets, and desktop browsers.
* A\* Pathfinding
* Particles

# Supported (tested) Platforms

* Chrome (desktop & mobile)
* Firefox
* Internet Explorer (desktop & mobile)
* Safari (desktop & mobile)
* Mac using [Electron](https://github.com/atom/electron)
* Linux x64 using [Electron](https://github.com/atom/electron)
* iOS using [Ejecta](http://impactjs.com/ejecta)
* Chrome Web Store

Splat ECS works in PhoneGap/Cordova, but it seems like the apps it produces lack hardware acceleration, making games unplayable.
Splat ECS may or may not work on other platforms, please let us know what you find out.

# Create a new Game (recommended)

[Fork the starter project](https://github.com/SplatJS/splat-ecs-starter-project)

# Install through [NPM](https://www.npmjs.org)

```
$ npm install --save splat-ecs
```
Then require Splat ECS into your game:
```
var Splat = require("splat-ecs");
```
Then use [browserify](http://browserify.org/) to bundle your game as a single JavaScript file for the browser.

# Games using Splat ECS

* [Splat ECS starter project](https://github.com/SplatJS/splat-ecs-starter-project)
* [Cluster Junk](https://github.com/TwoScoopGames/Cluster-Junk)
* [Treatment and Control](https://github.com/TwoScoopGames/Treatment-and-Control)
* [Uprooted](https://github.com/TwoScoopGames/ld32)
* [The Day the World Changed](https://github.com/TwoScoopGames/ggj15)
* [Zen Madness](https://github.com/aquisenberry/ggj_meditate)

Send a pull request to add your game to the list!
