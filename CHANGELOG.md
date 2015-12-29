# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.0.0] - 2015-12-28
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
