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

/** @function ImportTilemap
 * @param {Object} file JSON file exported from Tiled. This should be required in a scene enter
 * script and passed to the function.
 * @param {EntityPool} entities EntityPool from game.entities
 */
function ImportTilemap(file, entities) { // eslint-disable-line no-unused-vars

	var tile, image, image_index, tile_pos, cols, tileset, tileset_index = 0;
	var layer, object, entity;

	for (var i = 0; i < file.layers.length; i++) {
		layer = file.layers[i];

		// Render Tile Layers
		if (layer.type == "tilelayer") {
			for (j = 0; j < layer.data.length; j++) {

				// Select tileset index based on firstgid and image index
				// Set image index minus firstgid for positioning math
				for (var k = 0; k < file.tilesets.length; k++) {
					if (layer.data[j] >= file.tilesets[k].firstgid) {
						tileset_index = k;
					}
				}
				cols = file.tilesets[tileset_index].imagewidth / file.tilesets[tileset_index].tilewidth;
				image_index = layer.data[j] - file.tilesets[tileset_index].firstgid;
				tileset = file.tilesets[tileset_index];

				if (image_index >= 0) {

					// Create tile and get properties
					tile = entities.create();
					entities.set(tile, "name", "tile");
					entities.set(tile, "tile", true);
					entities.set(tile, "image", { "name": "" });
					entities.set(tile, "position", { "x": 0, "y": 0 });
					image = entities.get(tile, "image");
					tile_pos = entities.get(tile, "position");

					// Position based on index
					tile_pos.x = (j % file.width) * file.tilewidth;
					tile_pos.y = Math.floor(j / file.width) * file.tileheight;

					// Character position z: 1 so anything without background true will layer over player
					tile_pos.z = (layer.properties.Background == "True") ? -1 : 2;

					// Select which "tile" of the tileset image to render
					image.name = tileset.image;
					image.sourceWidth = tileset.tilewidth;
					image.sourceHeight = tileset.tileheight;
					image.destinationWidth = tileset.tilewidth;
					image.destinationHeight = tileset.tileheight;
					image.sourceX = (image_index % cols) * tileset.tilewidth + ((image_index % cols) * tileset.spacing) + tileset.margin;
					if(tileset.tileheight == tileset.imageheight) {
						image.sourceY = 0;
					} else {
						image.sourceY = Math.floor(image_index / cols) * tileset.tileheight + (Math.floor(image_index / cols) * tileset.spacing) + tileset.margin;
					}

				}
			}
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
		// Loop object layer for collisions and spawn point
		if (layer.type == "objectgroup") {
			for (var j = 0; j < layer.objects.length; j++) {
				object = layer.objects[j];
				entity = entities.create();
				entities.set(entity, "size", { "width": object.width, "height": object.height });
				entities.set(entity, "position", { "x": object.x, "y": object.y });
				entities.set(entity, "collisions", []);
				Object.keys(object.properties).forEach(function(key) {
					if (!isNaN(object.properties[key])) {
						object.properties[key] = parseInt(object.properties[key], 10);
					}
					if (new String(object.properties[key]).toLowerCase() == "true" || object.properties[key] == "1") {
						object.properties[key] = true;
					}
					if (new String(object.properties[key]).toLowerCase() == "false" || object.properties[key] == "0") {
						object.properties[key] = false;
					}
				});

				// Spawn points
				if (object.properties.spawn) {
					entities.set(entity, "spawn", true);
				}

				entities.set(entity, "tiledProperties", object.properties);

			}
		}
	}

	/**
	 * @member {Entity} Container Entity
	 * Created automatically allowing you to use
	 * <code>game.entities.find("container");</code> to get a constrainPosition ID</p>
	 */
	var map_size = {
		"width": file.width * file.tilewidth,
		"height": file.height * file.tileheight
	};
	var container = entities.create();
	entities.set(container, "name", "container");
	entities.set(container, "container", true);
	entities.set(container, "position", { "x": 0, "y": 0 });
	entities.set(container, "size", map_size);

}

module.exports = ImportTilemap;
