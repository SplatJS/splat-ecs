"use strict";
/** @module splat-ecs/lib/import-from-tiled */

var clone = require("./clone");
var path = require("path");

/**
 * <p>Import an orthogonal tilemap from the Tiled map editor.</p>
 * <p>This will create entities in the current scene representing all the tiles & objects in the tilemap. Each tile gets a <code>tile</code> component tag so you can find them later. Each tile also gets a <code>grid</code> component with the x/y/z grid coordinates in tile space.</p>
 * <p>All of the properties that are in the tilemap are set as components in each tile entity, and the property values are treated as JSON. More specific properties override less specific properties. The order of precedence for tile properties is:</p>
 * <ol>
 * <li>tile layer</li>
 * <li>tile in tileset</li>
 * <li>tileset</li>
 * </ol>
 * <p>The order of precendence for object properties is:</p>
 * <ol>
 * <li>object</li>
 * <li>object layer</li>
 * <li>tile in tileset</li>
 * <li>tileset</li>
 * </ol>
 * <p>A special "container" entity is also created with a <code>container</code> component tag that has the dimensions of the map in its <code>size</code> component.</p>
 * @function importTilemap
 * @param {Object} file JSON file exported from Tiled. This should be required in a scene enter
 * script and passed to the function.
 * @param {external:EntityPool} entities EntityPool from game.entities
 * @param {ImageLoader} images ImageLoader from game.images
 * @see {@link http://www.mapeditor.org/ Tiled Map Editor}
 */
module.exports = function importTilemap(file, entities, images) { // eslint-disable-line no-unused-vars

  var imageComponents = tilesetsToImageComponents(file.tilesets, images);

  for (var z = 0; z < file.layers.length; z++) {
    var layer = file.layers[z];
    if (layer.type == "tilelayer") {
      makeTiles(file, z, entities, imageComponents);
    } else if (layer.type == "objectgroup") {
      makeObjects(file, z, entities, imageComponents);
    }
  }

  // create a "container" entity so we can find the bounds of the map, and maybe constrain the player to it
  var container = entities.create();
  entities.setComponent(container, "name", "container");
  entities.setComponent(container, "container", true);
  entities.addComponent(container, "position");
  var size = entities.addComponent(container, "size");
  size.width = file.width * file.tilewidth;
  size.height = file.height * file.tileheight;
};

function tilesetsToImageComponents(tilesets, images) {
  var imageComponents = [];
  for (var i = 0; i < tilesets.length; i++) {
    if (tilesets[i].image) {
      tilesetToImage(tilesets[i], imageComponents);
    } else {
      collectionOfImagesToImage(tilesets[i], imageComponents, images);
    }
  }
  return imageComponents;
}

function tilesetToImage(tileset, imageComponents) {
  var i = tileset.firstgid;
  var j = 0;
  for (var y = tileset.margin; y < tileset.imageheight - tileset.margin; y += tileset.tileheight + tileset.spacing) {
    for (var x = tileset.margin; x < tileset.imagewidth - tileset.margin; x += tileset.tilewidth + tileset.spacing) {
      var tileProps = (tileset.tileproperties || {})[j];
      var props = merge(clone(tileset.properties || {}), tileProps);
      imageComponents[i] = {
        image: {
          name: path.basename(tileset.image),
          sourceX: x,
          sourceY: y,
          sourceWidth: tileset.tilewidth,
          sourceHeight: tileset.tileheight,
          destinationWidth: tileset.tilewidth,
          destinationHeight: tileset.tileheight
        },
        properties: props
      };
      i++;
      j++;
    }
  }
}

function collectionOfImagesToImage(tileset, imageComponents, images) {
  var keys = Object.keys(tileset.tiles).map(function(id) { return parseInt(id); });
  for (var k = 0; k < keys.length; k++) {
    var key = keys[k];
    var tileProps = (tileset.tileproperties || {})[key];
    var props = merge(clone(tileset.properties || {}), tileProps);
    var name = path.basename(tileset.tiles[key].image);
    var image = images.get(name);
    imageComponents[tileset.firstgid + key] = {
      image: {
        name: name,
        sourceX: 0,
        sourceY: 0,
        sourceWidth: image.width,
        sourceHeight: image.height,
        destinationWidth: image.width,
        destinationHeight: image.height
      },
      properties: props
    };
  }
}

function merge(dest, src) {
  if (src === undefined) {
    return dest;
  }
  var keys = Object.keys(src);
  for (var i = 0; i < keys.length; i++) {
    dest[keys[i]] = src[keys[i]];
  }
  return dest;
}

function makeTiles(file, z, entities, imageComponents) {
  var layer = file.layers[z];
  for (var i = 0; i < layer.data.length; i++) {
    var tile = layer.data[i];
    if (tile === 0) {
      continue;
    }
    var image = clone(imageComponents[tile].image);
    var gridX = i % file.width;
    var gridY = Math.floor(i / file.width);
    var x = gridX * file.tilewidth;
    var y = gridY * file.tileheight - image.sourceHeight;
    var entity = makeTile({ x: x, y: y, z: z }, { x: gridX, y: gridY, z: z }, image, entities);
    setComponentsFromProperties(entity, imageComponents[tile].properties, entities);
    setComponentsFromProperties(entity, layer.properties, entities);
  }
}

function makeTile(position, grid, image, entities) {
  var tile = entities.create();
  entities.setComponent(tile, "name", "tile");
  entities.setComponent(tile, "tile", true);

  var pos = entities.addComponent(tile, "position");
  pos.x = position.x;
  pos.y = position.y;
  pos.z = position.z;

  var g = entities.addComponent(tile, "grid");
  g.x = grid.x;
  g.y = grid.y;
  g.z = grid.z;

  addImage(entities, tile, image);

  var size = entities.addComponent(tile, "size");
  size.width = image.sourceWidth;
  size.height = image.sourceHeight;

  return tile;
}

function addImage(entities, id, image) {
  var img = entities.addComponent(id, "image");
  img.name = image.name;
  img.sourceX = image.sourceX;
  img.sourceY = image.sourceY;
  img.sourceWidth = image.sourceWidth;
  img.sourceHeight = image.sourceHeight;
  img.destinationWidth = image.destinationWidth;
  img.destinationHeight = image.destinationHeight;
}

function makeObjects(file, z, entities, imageComponents) {
  var layer = file.layers[z];
  for (var i = 0; i < layer.objects.length; i++) {
    var object = layer.objects[i];
    makeObject(layer, object, z, entities, imageComponents);
  }
}

function makeObject(layer, object, z, entities, imageComponents) {
  var entity = entities.create();
  entities.setComponent(entity, "name", object.name);
  entities.setComponent(entity, "type", object.type);

  var position = entities.addComponent(entity, "position");
  position.x = object.x;
  position.y = object.y;
  position.z = z;

  var size = entities.addComponent(entity, "size");
  size.width = object.width;
  size.height = object.height;

  if (object.gid !== undefined) {
    addImage(entities, entity, imageComponents[object.gid].image);
    setComponentsFromProperties(entity, imageComponents[object.gid].properties, entities);
  }
  setComponentsFromProperties(entity, layer.properties, entities);
  setComponentsFromProperties(entity, object.properties, entities);
}

function setComponentsFromProperties(entity, properties, entities) {
  if (!properties) {
    return;
  }
  Object.keys(properties).forEach(function(key) {
    var value = parsePropertyValue(properties[key]);
    if (typeof value !== "object") {
      entities.setComponent(entity, key, value);
    } else {
      var component = entities.addComponent(entity, key);
      Object.keys(value).forEach(function(valKey) {
        component[valKey] = value[valKey];
      });
    }
  });
}

function parsePropertyValue(val) {
  try {
    return JSON.parse(val);
  } catch (e) {
    if (e instanceof SyntaxError) {
      return val;
    } else {
      throw e;
    }
  }
}
