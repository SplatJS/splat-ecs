"use strict";

var clone = require("./clone");
var path = require("path");

/** <p>Import an orthogonal tilemap from
 * <a href="http://www.mapeditor.org/" target="_blank">Tiled: Map Editor</a> and draw on the screen.</p>
 * <h5>To Do</h5>
 * <ul>
 * <li><b>Image Layer</b></li>
 * <li><b>Ellipse and Polygon Objects</b></li>
 * </ul>
 * @module Import From Tiled
 */

/** @function importTilemap
 * @param {Object} file JSON file exported from Tiled. This should be required in a scene enter
 * script and passed to the function.
 * @param {EntityPool} entities EntityPool from game.entities
 */
function importTilemap(file, entities) { // eslint-disable-line no-unused-vars

	var images = tilesetsToImages(file.tilesets);

	for (var z = 0; z < file.layers.length; z++) {
		var layer = file.layers[z];
		if (layer.type == "tilelayer") {
			makeTiles(file, z, entities, images);
		} else if (layer.type == "objectgroup") {
			makeObjects(file, z, entities, images);
		}
	}

	/** @member {Entity} Container Entity
	 * Created automatically allowing you to use
	 * <code>game.entities.find("container");</code> to get a constrainPosition ID</p>
	 */
	var container = entities.create();
	entities.set(container, "name", "container");
	entities.set(container, "container", true);
	entities.set(container, "position", { "x": 0, "y": 0 });
	entities.set(container, "size", { "width": file.width * file.tilewidth, "height": file.height * file.tileheight });
}

function tilesetsToImages(tilesets) {
	var images = [];
	for (var i = 0; i < tilesets.length; i++) {
		tilesetToImage(tilesets[i], images);
	}
	return images;
}

function tilesetToImage(tileset, images) {
	var i = tileset.firstgid;
	var j = 0;
	for (var y = tileset.margin; y < tileset.imageheight - tileset.margin; y += tileset.tileheight + tileset.spacing) {
		for (var x = tileset.margin; x < tileset.imagewidth - tileset.margin; x += tileset.tilewidth + tileset.spacing) {
			var tileProps = (tileset.tileproperties || {})[j];
			var props = merge(clone(tileset.properties), tileProps);
			images[i] = {
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

function makeTiles(file, z, entities, images) {
	var layer = file.layers[z];
	for (var i = 0; i < layer.data.length; i++) {
		var tile = layer.data[i];
		if (tile === 0) {
			continue;
		}
		var image = clone(images[tile].image);
		var x = (i % file.width) * file.tilewidth;
		var y = Math.floor(i / file.width) * file.tileheight;
		var entity = makeTile({ x: x, y: y, z: z }, image, entities);
		setComponentsFromProperties(entity, layer.properties, entities);
	}
}

function makeTile(position, image, entities) {
	var tile = entities.create();
	entities.set(tile, "name", "tile");
	entities.set(tile, "tile", true);
	entities.set(tile, "position", position);
	entities.set(tile, "image", image);
	entities.set(tile, "size", { "width": image.sourceWidth, "height": image.sourceHeight });
	return tile;
}

function makeObjects(file, z, entities, images) {
	var layer = file.layers[z];
	for (var i = 0; i < layer.objects.length; i++) {
		var object = layer.objects[i];
		makeObject(layer, object, z, entities, images);
	}
}

function makeObject(layer, object, z, entities, images) {
	var entity = entities.create();
	entities.set(entity, "name", object.name);
	entities.set(entity, "type", object.type);
	entities.set(entity, "position", { "x": object.x, "y": object.y, "z": z });
	entities.set(entity, "size", { "width": object.width, "height": object.height });
	if (typeof object.gid !== "undefined") {
		entities.set(entity, "image", clone(images[object.gid].image));
		setComponentsFromProperties(entity, images[object.gid].properties, entities);
	}
	setComponentsFromProperties(entity, layer.properties, entities);
	setComponentsFromProperties(entity, object.properties, entities);
}

function setComponentsFromProperties(entity, properties, entities) {
	if (!properties) {
		return;
	}
	Object.keys(properties).forEach(function(key) {
		entities.set(entity, key, parsePropertyValue(properties[key]));
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

module.exports = importTilemap;
