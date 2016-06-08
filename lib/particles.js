"use strict";
/** @module splat-ecs/lib/particles */

var random = require("splat-ecs/lib/random");

module.exports = {
  /**
  * Create between {@link module:splat-ecs/lib/particles.Config#qtyMin qtyMin} and {@link module:splat-ecs/lib/particles.Config#qtyMax qtyMax} particles, and randomize their properties according to <code>config</code>.
  * @param {object} game The <code>game</code> object that you get in systems and scripts.
  * @param {module:splat-ecs/lib/particles.Config} config The settings to use to create the particles.
  */
  "create": function(game, config) {
    var particleCount = Math.floor(random.inRange(config.qtyMin, config.qtyMax));
    for (var i = 0; i < particleCount; i++) {
      var particle = game.instantiatePrefab(config.prefab);
      // check if origin is an entity
      var origin = config.origin;
      if (typeof config.origin === "number") {
        origin = choosePointInEntity(game, origin);
      }

      var randomSize = random.inRange(config.sizeMin, config.sizeMax);
      scaleEntityRect(game, particle, randomSize);

      centerEntityOnPoint(game, particle, origin);

      var velocity = random.inRange(config.velocityMin, config.velocityMax);

      var angle = pickAngle(config, i, particleCount);
      game.entities.set(particle, "velocity", pointOnCircle(angle, velocity));

      if (config.accelerationX || config.accelerationY) {
        game.entities.set(particle, "acceleration", {
          "x": config.accelerationX,
          "y": config.accelerationY
        });
      }
      game.entities.set(particle, "lifeSpan", {
        "current": 0,
        "max": random.inRange(config.lifeSpanMin, config.lifeSpanMax)
      });
    }
  },

  /**
   * The settings for a type of particle.
   * @constructor
   * @param {string} prefab The name of a prefab to instantiate for the particle, as defined in <code>prefabs.json</code>.
   */
  "Config": function(prefab) {
    /**
     * The name of a prefab to instantiate for the particle, as defined in <code>prefabs.json</code>.
     * @member {string}
     */
    this.prefab = prefab;
    /**
     * The origin point in which to create particles.
     *
     * If the origin is a number it represents an entity and a random point inside the entity will be used.
     * If origin is a point like <code>{"x": 50, "y": 50}</code> particles will spawn at that position.
     * @member {object | number}
     */
    this.origin = { "x": 0, "y": 0 };
    /**
     * How to distribute particles along the {@link module:splat-ecs/lib/particles.Config#arcWidth arcWidth}.
     *
     * Possible values:
     * <dl>
     * <dt><code>"even"</code></dt>
     * <dd>Distribute the particles evenly along the arc.</dd>
     * <dt><code>"random"</code></dt>
     * <dd>Scatter the particles on random points of the arc.</dd>
     * </dl>
     * @member {string}
     */
    this.spreadType = "random";
    /**
     * The direction (an angle in radians) that the particles should move.
     * @member {number}
     */
    this.angle = 0;
    /**
     * The width of an arc (represented by an angle in radians) to spread the particles. The arc is centered around {@link module:splat-ecs/lib/particles.Config#angle angle}.
     * @member {number}
     */
    this.arcWidth = Math.PI / 2;
    /**
     * The minimum number of particles to create.
     * @member {number}
     */
    this.qtyMin = 1;
    /**
     * The maximum number of particles to create.
     * @member {number}
     */
    this.qtyMax = 1;
    /**
     * The minimum percentage to scale each particle.
     * <ul>
     * <li>A scale of 0.5 means the particle will spawn at 50% (half) of the original size.</li>
     * <li>A scale of 1 means the particle will spawn at the original size.</li>
     * <li>A scale of 2 means the particle will spawn at 200% (double) the original size.</li>
     * </ul>
     * @member {number}
     */
    this.sizeMin = 1;
    /**
     * The maximum percentage to scale each particle.
     * <ul>
     * <li>A scale of 0.5 means the particle will spawn at 50% (half) of the original size.</li>
     * <li>A scale of 1 means the particle will spawn at the original size.</li>
     * <li>A scale of 2 means the particle will spawn at 200% (double) the original size.</li>
     * </ul>
     * @member {number}
     */
    this.sizeMax = 1;
    /**
     * The minimum velocity to apply to each particle.
     * @member {number}
     */
    this.velocityMin = 0.5;
    /**
     * The maximum velocity to apply to each particle.
     * @member {number}
     */
    this.velocityMax = 0.5;
    /**
     * The acceleration on the x-axis to apply to each particle.
     * @member {number}
     */
    this.accelerationX = 0;
    /**
     * The acceleration on the y-axis to apply to each particle.
     * @member {number}
     */
    this.accelerationY = 0;
    /**
     * The minimum life span to apply to each particle.
     * @member {number}
     */
    this.lifeSpanMin = 0;
    /**
     * The maximum life span to apply to each particle.
     * @member {number}
     */
    this.lifeSpanMax = 500;
  }
};

function pickAngle(config, particleNumber, particleCount) {
  var startAngle = config.angle - (config.arcWidth / 2);
  if (config.spreadType === "even") {
    return (particleNumber * (config.arcWidth / (particleCount - 1))) + startAngle;
  } else {
    var endAngle = startAngle + config.arcWidth;
    return random.inRange(startAngle, endAngle);
  }
}

function scaleEntityRect(game, entity, scaleFactor) {
  var size = game.entities.get(entity, "size");
  size.width = size.width * scaleFactor;
  size.height = size.height * scaleFactor;
}

function pointOnCircle(angle, radius) {
  return {
    "x": (radius * Math.cos(angle)),
    "y": (radius * Math.sin(angle))
  };
}

/**
 * Center an entity on a given point.
 * @private
 * @param {object} game Required for game.entities.get().
 * @param {integer} entity The id of entity to center.
 * @param {object} point A point object <code>{"x": 50, "y": 50}</code> on which to center the entity.
 */
function centerEntityOnPoint(game, entity, point) {
  var size = game.entities.get(entity, "size");
  if (!game.entities.get(entity, "position")) {
    game.entities.set(entity, "position", { "x": 0, "y": 0 });
  }
  var position = game.entities.get(entity, "position");
  position.x = point.x - (size.width / 2);
  position.y = point.y - (size.height / 2);
}

/**
 * Choose a random point inside the bounding rectangle of an entity.
 * @private
 * @param {object} game Required for game.entities.get().
 * @param {integer} entity The id of entity to pick a point within.
 * @returns {object} an point object <code>{"x": 50, "y": 50}</code>.
 */
function choosePointInEntity(game, entity) {
  var position = game.entities.get(entity, "position");
  var size = game.entities.get(entity, "size");
  if (size === undefined) {
    return {
      "x": position.x,
      "y": position.y
    };
  }
  return {
    "x": random.inRange(position.x, (position.x + size.width)),
    "y": random.inRange(position.y, (position.y + size.height))
  };
}
