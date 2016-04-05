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

	for (var i = 0; i < file.layers.length; i++) {
		var layer = file.layers[i];
		if (layer.type == "tilelayer") {
			processTiles(file, layer, i, entities, images);
		} else if (layer.type == "objectgroup") {
			processObjects(file, layer, i, entities, images);
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
	for (var y = tileset.margin; y < tileset.imageheight - tileset.margin; y += tileset.tileheight + tileset.spacing) {
		for (var x = tileset.margin; x < tileset.imagewidth - tileset.margin; x += tileset.tilewidth + tileset.spacing) {
			images[i] = {
				name: path.basename(tileset.image),
				sourceX: x,
				sourceY: y,
				sourceWidth: tileset.tilewidth,
				sourceHeight: tileset.tileheight,
				destinationWidth: tileset.tilewidth,
				destinationHeight: tileset.tileheight
			};
			i++;
		}
	}
}

function processTiles(file, layer, z, entities, images) {
	for (var i = 0; i < layer.data.length; i++) {
		processTile(file, layer, i, z, entities, images);
	}
}

function processTile(file, layer, index, z, entities, images) {
	var current = layer.data[index];
	if (current === 0) {
		return;
	}

	// Create tile and get properties
	var tile = entities.create();
	entities.set(tile, "name", "tile");
	entities.set(tile, "tile", true);
	entities.set(tile, "position", {
		"x": (index % file.width) * file.tilewidth,
		"y": Math.floor(index / file.width) * file.tileheight,
		"z": z
	});
	var image = clone(images[current]);
	entities.set(tile, "image", image);
	entities.set(tile, "size", { "width": image.sourceWidth, "height": image.sourceHeight });
	setComponentsFromProperties(tile, layer.properties, entities);
}

function processObjects(file, layer, z, entities, images) {
	for (var i = 0; i < layer.objects.length; i++) {
		processObject(file, layer.objects[i], z, entities, images);
	}
}

function processObject(file, object, z, entities, images) {
	var entity = entities.create();
	entities.set(entity, "name", object.name);
	entities.set(entity, "type", object.type);
	entities.set(entity, "position", { "x": object.x, "y": object.y, "z": z });
	entities.set(entity, "size", { "width": object.width, "height": object.height });
	setComponentsFromProperties(entity, object.properties, entities);

	if (typeof object.gid !== "undefined") {
		entities.set(entity, "image", clone(images[object.gid]));
	}
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
