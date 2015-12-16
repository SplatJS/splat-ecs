"use strict";

var gridSize = 64;

function toGrid(i) {
	return Math.floor(i / gridSize);
}
function keys(position, size) {
	var x1 = toGrid(position.x);
	var x2 = toGrid(position.x + size.width);

	var y1 = toGrid(position.y);
	var y2 = toGrid(position.y + size.height);

	var k = [];
	for (var x = x1; x <= x2; x++) {
		for (var y = y1; y <= y2; y++) {
			k.push(x + "," + y);
		}
	}
	return k;
}

function add(hash, entity, key, entities) {
	if (!hash[key]) {
		hash[key] = [entity];
		return;
	}

	var entityCollisions = entities.get(entity, "collisions");
	var entityPosition = entities.get(entity, "position");
	var entitySize = entities.get(entity, "size");

	for (var i = 0; i < hash[key].length; i++) {
		var peer = hash[key][i];

		var peerCollisions = entities.get(peer, "collisions");
		var peerPosition = entities.get(peer, "position");
		var peerSize = entities.get(peer, "size");

		// FIXME: when an entity's collisions are removed, it stays forever in the hash. this needs to get cleaned up somehow.
		if (peerCollisions === undefined) {
			continue;
		}
		if (collides(entityPosition, entitySize, peerPosition, peerSize)) {
			entityCollisions.push(peer);
			peerCollisions.push(entity);
		}
	}
	hash[key].push(entity);
}

function remove(list, item) {
	var pos = list.indexOf(item);
	if (pos === -1) {
		return;
	}
	list.splice(pos, 1);
}

function collides(bPosition, bSize, aPosition, aSize) {
	return aPosition.x + aSize.width > bPosition.x &&
		aPosition.x < bPosition.x + bSize.width &&
		aPosition.y + aSize.height > bPosition.y &&
		aPosition.y < bPosition.y + bSize.height;
}

function removeEntity(entity, oldKeys, entities, spatialHash) {
	function notCurrentEntityId(id) {
		return id !== entity;
	}
	for (var i = 0; i < oldKeys.length; i++) {
		remove(spatialHash[oldKeys[i]], entity);
	}
	var collisions = entities.get(entity, "collisions");
	for (i = 0; i < collisions.length; i++) {
		var peer = collisions[i];
		if (peer === undefined) {
			continue;
		}
		var peerCollisions = entities.get(peer, "collisions");
		entities.set(peer, "collisions", peerCollisions.filter(notCurrentEntityId));
	}
}

var spatialHash = {};

module.exports = function(ecs, data) {
	data.entities.registerSearch("boxCollider", ["position", "size", "collisions"]);
	ecs.addEach(function(entity, elapsed) { // eslint-disable-line no-unused-vars
		var collisionKeys = data.entities.get(entity, "collisionKeys");
		var velocity = data.entities.get(entity, "velocity");
		var position = data.entities.get(entity, "position");
		var size = data.entities.get(entity, "size");

		if (collisionKeys === undefined || velocity !== undefined) {
			var oldKeys = collisionKeys || [];
			collisionKeys = keys(position, size);
			data.entities.set(entity, "collisionKeys", collisionKeys);

			if (velocity !== undefined || !areArraysSame(oldKeys, collisionKeys)) {
				removeEntity(entity, oldKeys, data.entities, spatialHash);
				data.entities.set(entity, "collisions", []);
				for (var i = 0; i < collisionKeys.length; i++) {
					add(spatialHash, entity, collisionKeys[i], data.entities);
				}
			}
		}
	}, "boxCollider");
};

module.exports.reset = function() {
	spatialHash = {};
};
module.exports.onEntityDelete = function(entity, data) {
	removeEntity(entity, entity.collisionKeys || [], data.entities.entities, spatialHash);
};

function areArraysSame(a, b) {
	if (a.length !== b.length) {
		return false;
	}
	for (var i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}
