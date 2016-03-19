"use strict";

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

	var layer = {};

	for (var i = 0; i < file.layers.length; i++) {
		layer = file.layers[i];
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

function processTiles(file, layer, z_pos, entities) {
	// Render Tile Layers
	for (var j = 0; j < layer.data.length; j++) {
		processTile(file, layer.data[j], j, z_pos, entities);
	}
}

function processObjects(file, layer, z_pos, entities) {
	// Loop object layer for collisions and spawn point
	for (var j = 0; j < layer.objects.length; j++) {
		processObject(file, layer.objects[j], z_pos, entities);
	}
}

function getTileset(file, current) {
	// Select tileset index based on firstgid and image index
	// Set image index minus firstgid for positioning math
	var tileset = {"index": 0};
	for (var k = 0; k < file.tilesets.length; k++) {
		if (current >= file.tilesets[k].firstgid) {
			tileset.index = k;
		}
	}
	tileset.data = file.tilesets[tileset.index];
	tileset.imageIndex = current - file.tilesets[tileset.index].firstgid;
	tileset.cols = tileset.data.imagewidth / tileset.data.tilewidth;
	return tileset;
}

function processTile(file, current, index, z_pos, entities) {
	
	var tileset = getTileset(file, current);

	if (tileset !== false && tileset.imageIndex >= 0) {

		// Create tile and get properties
		var tile = entities.create();
		entities.set(tile, "name", "tile");
		entities.set(tile, "tile", true);
		entities.set(tile, "size", { "width": tileset.data.tileheight, "height": tileset.data.tilewidth });

		// Position based on index
		// Character position z: 1 so anything without background true will layer over player
		var tilePos = {
			"x": (index % file.width) * file.tilewidth,
			"y": Math.floor(index / file.width) * file.tileheight,
			"z": z_pos
		};
		entities.set(tile, "position", tilePos);

		// Select which "tile" of the tileset image to render
		entities.set(tile, "image", createImage(tileset.data, tileset.imageIndex, tileset.cols));

	}
}

function createImage(tileset, imageIndex, cols) {
	var image = {};
	image.name = tileset.image;
	image.sourceWidth = tileset.tilewidth;
	image.sourceHeight = tileset.tileheight;
	image.destinationWidth = tileset.tilewidth;
	image.destinationHeight = tileset.tileheight;
	image.sourceX = (imageIndex % cols) * tileset.tilewidth + ((imageIndex % cols) * tileset.spacing) + tileset.margin;
	if(tileset.tileheight == tileset.imageheight) {
		image.sourceY = 0;
	} else {
		image.sourceY = Math.floor(imageIndex / cols) * tileset.tileheight + (Math.floor(imageIndex / cols) * tileset.spacing) + tileset.margin;
	}
	return image;
}

/**
 * @member {Entity} Object Entities
 * <p>Create Entity with size and position components</p>
 * <p><b>Collidable</b>: True or False <br />Add collision component to entity.
 * Currently collisions are handled as a simulation system in the project.</p>
 * <p><b>Spawn</b>: True or False <br />Creates an entity with a "spawn" boolean
 * component allowing you to use <code>game.entities.find("spawn");</code> to find the spawn point for this map.</p>
 * <br />All other properties end up in a "tiledProperties" component to be handled on a per-game basis.
 */
function processObject(file, object, z_pos, entities) {
	var tiledProperties = {};
	var entity = entities.create();
	entities.set(entity, "size", { "width": object.width, "height": object.height });
	entities.set(entity, "position", { "x": object.x, "y": object.y, "z": z_pos });
	entities.set(entity, "collisions", []);
	entities.set(entity, "type", object.type);
	entities.set(entity, "name", object.name);
	Object.keys(object.properties).forEach(function(key) {
		if (!isNaN(object.properties[key])) {
			tiledProperties[key] = parseInt(object.properties[key], 10);
		} else if (new String(object.properties[key]).toLowerCase() == "true") {
			tiledProperties[key] = true;
		} else if (new String(object.properties[key]).toLowerCase() == "false") {
			tiledProperties[key] = false;
		} else {
			tiledProperties[key] = object.properties[key];
		}
	});

	if (typeof object.gid !== "undefined") {
		var tileset = getTileset(file, object.gid);
		entities.set(entity, "image", createImage(tileset.data, tileset.imageIndex, tileset.cols));
	}

	// Spawn points
	if (object.properties.Spawn) {
		entities.set(entity, "spawn", true);
	}

	entities.set(entity, "tiledProperties", tiledProperties);

}

module.exports = importTilemap;
