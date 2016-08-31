![Splat ECS](./images/splat-ecs-logo.png)

A 2d HTML5 Canvas game engine

Splat ECS is a 2d game engine made for creating multi-platform games entirely in JavaScript. Splat ECS is built around the [Entity Component System](https://github.com/ericlathrop/entity-component-system) pattern, which is flexible and promotes composition of behaviors.

# Features

* Rectangles!
* Keyboard, mouse, touch, & gamepad input
* Sounds and music (Web Audio API and HTML5 Audio)
* Sprite animation
* Asset loading, and built-in loading screen
* Games work well on phones, tablets, and desktop browsers.
* A\* Pathfinding
* Particles
* SCREENSHAKE
* Tiled map editor support
* Easing

# Supported (tested) Platforms

* Chrome (desktop & mobile)
* Firefox
* Internet Explorer (desktop & mobile)
* Safari (desktop & mobile)
* Mac using [Electron](https://github.com/atom/electron)
* Linux x64 using [Electron](https://github.com/atom/electron)
* Chrome Web Store (currently broken [see issue #69](https://github.com/SplatJS/splat-ecs/issues/69))
* Android using [Cordova](https://cordova.apache.org/)

Splat now works in Cordova, and due to updates to recent phone browsers we have seen good framerates on Android in google Chome. We have not tested Cordova builds on iOS yet, please let us know what you find out.

# Requirements
* Browser (like Firefox or Chrome)
* Text editor
* Terminal
* [Node.js](https://nodejs.org/en/)

# New to Splat?
If you are new to Splat, it is highly recommended that you try out the [tutorial project](http://splatjs.com/tutorials/splatformer).

# Create a new Game
1. [Clone or download a zip of the starter project](https://github.com/SplatJS/splat-ecs-starter-project)

2. (skip this step if you are cloning the repo) The zip file should be called splat-ecs-starter-project-master.zip. Unzip this file and you will be left with a folder named splat-ecs-starter-project.

3. In your terminal navigate into the splat-ecs-starter-project folder.

 `cd /Path/To/splat-ecs-starter-project`

4. Next we will run npm install to install Splat ECS and all of it's modules:

 `npm install`
5. This will install all of the game and engine dependencies from NPM — it can take a couple of minutes. If you see any warning (denoted by npm WARN) this is okay, this just means that a package Splat-ECS uses is out of date it should not effect your game and newer versions of Splat-ECS Starter Project will take care of this issue. You will know npm install is finished when the terminal returns to your command prompt (you will see your username).

6. To run a Splat ECS game all you need to do is navigate to the project folder in your terminal and type `npm start`
This will run webpack, which builds your game and also runs eslint which checks your JavaScript code for errors.

7. You should try running your game to make sure it is working before you continue. When the last line in your terminal reads 'webpack: bundle is now VALID.' this means webpack is done and now you can open a browser and go to `localhost:4000`.

The Splat ECS sample game is just white screen with a black-outlined square you can control with WASD, or arrow keys. Test that this is working and note that if the keys are not working you may need to click inside the browser window to give the game your 'focus'.

# Games using Splat (ECS)
* [Cluster Junk](https://github.com/TwoScoopGames/Cluster-Junk)
* [Cali Bunga](https://riseshinegames.itch.io/cali-bunga)
* [Flip Flap Pong](https://riseshinegames.itch.io/flip-flap-pong)

* [Polymorphic](http://riseandshinegames.github.io/Polymorphic/build/)
* [Electropolis](https://two-scoop-games.itch.io/electropolis)
* [Morning Ritual](http://twoscoopgames.com/morningritual/game/)
* [Drunken Boss Fight](http://aquisenberry.itch.io/jam-build)
* [Zen Madness](http://aquisenberry.github.io/ggj_meditate/build/)
* [Treatment and Control](http://twoscoopgames.com/ggj15/)
* [The Day the World Changed](https://github.com/TwoScoopGames/ggj15)
* [Uprooted](http://twoscoopgames.com/ld32/)

See more Splat games at [http://splatjs.com/](http://splatjs.com/)

Send a pull request to add your game to the list!
