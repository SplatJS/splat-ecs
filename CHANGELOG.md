# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [5.0.0] - 2016-03-05
### Removed
- `match-center` system, you should use `match-center-x` and `match-center-y` to achieve the same thing.
### Added
- Gamepad support!

## [4.1.1] - 2016-02-29
### Fixed
- Fix `constrainPosition` system
- Fix more places in game.js where `input` needed to be `inputs`.

## [4.1.0] - 2016-02-29
### Fixed
- Fix bug in game.js where `input` needed to be `inputs`.
### Added
- Add `matchCenterX` and `matchCenterY` systems

## [4.0.0] - 2016-02-28
### Changed
- Change `contstrain-to-playable-area` to `constrain-position`, and make the system use an entity for the area.
- Renamed `game.input` to `game.inputs`.
- Moved `zindex` component into the `position` component's `z` property.

## [3.2.0] - 2015-01-30
### Added
- Inputs support mouse buttons

## [3.1.1] - 2015-01-30
### Fixed
- allow `game.switchScene()` during scene enter script

## [3.1.0] - 2015-01-30
### Added
- match-center system

## [3.0.2] - 2015-12-30
### Fixed
- Fix soundloader bug.
- Default rotation.x and rotation.y to the center of the entity.

## [3.0.1] - 2015-12-30
### Fixed
- Remove deleted entities from collision lists.

## [3.0.0] - 2015-12-30
### Added
- Add `instantiatePrefab` function to instantiate new entities from prefabs
### Changed
- `Game` constructor now loads all the json files by itself. Now it only needs 2 arguments.
### Fixed
- animation frame splitting now copies all animation properties, and doesn't lose any

## [2.0.0] - 2015-12-28
### Removed
- remove magical "splatjs:" way of loading systems.

## [1.0.0] - 2015-12-28
### Changed
- automatically size the canvas based on a selectable algorithm.
### Added
- matchCanvasSize system to make an entity the same size as the canvas
- matchAspectRatio system to make an entity match the aspect ratio of another entity

## [0.7.0] - 2015-12-21
### Added
- add `Input.buttonPressed()` and `Input.buttonReleased()`

## [0.6.2] - 2015-12-21
### Added
- add warnings about bad image component values and provide defaults for unset values
### Fixed
- fix bug where animations wouldn't work

## [0.6.1] - 2015-12-20
### Fixed
- mouse coordinates scale correctly when no css is applied to canvas

## [0.6.0] - 2015-12-20
### Changed
- use box-intersect module for faster collision detection

## [0.5.0] - 2015-12-19
### Added
- window.timeSystems() to log timings of ECS systems
### Changed
- Speed up advanceAnimations system

## [0.4.2] - 2015-12-19
### Fixed
- applyMovement2d never found entities

## [0.4.1] - 2015-12-17
### Fixed
- Readme typo
- Format changelog

## [0.4.0] - 2015-12-17
### Changed
- Upgrade to entity-component-system 2.0.0

## [0.3.2]
- Add method to reset box collider cache

## [0.3.1]
- Un-scale the viewport when it is reset

## [0.3.0]
- Support scaling of viewport through camera
- Draw custom buffer for an entity if it is specified

## [0.2.0]
- Support rotation when drawing images.

## [0.1.1]
- Log more info on no such image error

## [0.1.0]
- Add matchParent system.
- Allow sound loop start and end settings

## [0.0.1]
- Add a way to remove a deleted entity from the collision detection cache.

## [0.0.0]
- Fork from original splatjs project.
