"use strict";

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
	for (var i = 0; i < file.layers.length; i++) {
		var layer = file.layers[i];
		if (layer.type == "tilelayer") {
			processTiles(file, layer, i, entities);
		} else if (layer.type == "objectgroup") {
			processObjects(file, layer, i, entities);
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

function processTiles(file, layer, z, entities) {
	for (var i = 0; i < layer.data.length; i++) {
		processTile(file, layer, i, z, entities);
	}
}

function processTile(file, layer, index, z, entities) {
	var tileset = getTileset(file, layer.data[index]);

	if (tileset !== false && tileset.imageIndex >= 0) {

		// Create tile and get properties
		var tile = entities.create();
		entities.set(tile, "name", "tile");
		entities.set(tile, "tile", true);
		entities.set(tile, "position", {
			"x": (index % file.width) * file.tilewidth,
			"y": Math.floor(index / file.width) * file.tileheight,
			"z": z
		});
        entities.set(tile, "coordinates", { "x": (index % file.width), "y": Math.floor(index / file.width)});
		entities.set(tile, "size", { "width": tileset.data.tileheight, "height": tileset.data.tilewidth });
		entities.set(tile, "image", createImage(tileset.data, tileset.imageIndex, tileset.cols));
        setComponentsFromProperties(tile, tileset.data.properties, entities);
        setComponentsFromProperties(tile, layer.properties, entities);
        setComponentsFromProperties(tile, tileset.data.tileproperties[tileset.imageIndex], entities);
	}
}

function getTileset(file, current) {
	// Select tileset index based on firstgid and image index
	// Set image index minus firstgid for positioning math
	var tileset = { "index": 0 };
	for (var i = 0; i < file.tilesets.length; i++) {
		if (current >= file.tilesets[i].firstgid) {
			tileset.index = i;
		}
	}
	tileset.data = file.tilesets[tileset.index];
	tileset.imageIndex = current - file.tilesets[tileset.index].firstgid;
	tileset.cols = tileset.data.imagewidth / tileset.data.tilewidth;
	return tileset;
}

function createImage(tileset, imageIndex, cols) {
	var image = {};
	image.name = path.basename(tileset.image);
	image.sourceWidth = tileset.tilewidth;
	image.sourceHeight = tileset.tileheight;
	image.destinationWidth = tileset.tilewidth;
	image.destinationHeight = tileset.tileheight;
	image.sourceX = (imageIndex % cols) * tileset.tilewidth + ((imageIndex % cols) * tileset.spacing) + tileset.margin;
	if (tileset.tileheight == tileset.imageheight) {
		image.sourceY = 0;
	} else {
		image.sourceY = Math.floor(imageIndex / cols) * tileset.tileheight + (Math.floor(imageIndex / cols) * tileset.spacing) + tileset.margin;
	}
	return image;
}

function processObjects(file, layer, z, entities) {
	for (var i = 0; i < layer.objects.length; i++) {
		processObject(file, layer, layer.objects[i], z, entities);
	}
}

function processObject(file, layer, object, z, entities) {
	var entity = entities.create();
	entities.set(entity, "name", object.name);
	entities.set(entity, "type", object.type);
	entities.set(entity, "position", { "x": object.x, "y": object.y, "z": z });
	entities.set(entity, "size", { "width": object.width, "height": object.height });

	if (typeof object.gid !== "undefined") {
		var tileset = getTileset(file, object.gid);
		entities.set(entity, "image", createImage(tileset.data, tileset.imageIndex, tileset.cols));
        setComponentsFromProperties(entity, tileset.data.properties, entities);
        setComponentsFromProperties(entity, layer.properties, entities);
        setComponentsFromProperties(tile, tileset.data.tileproperties[tileset.imageIndex], entities);
	}

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
