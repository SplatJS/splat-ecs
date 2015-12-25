"use strict";

function setOwnPropertiesDeep(src, dest) {
	var props = Object.keys(src);
	for (var i = 0; i < props.length; i++) {
		var prop = props[i];
		var val = src[prop];
		if (typeof val === "object") {
			if (!dest[prop]) {
				dest[prop] = {};
			}
			setOwnPropertiesDeep(val, dest[prop]);
		} else {
			dest[prop] = val;
		}
	}
}

function applyAnimation(entity, a, animation, entities) {
	a.lastName = a.name; // track the old name so we can see if it changes
	Object.keys(animation[a.frame].properties).forEach(function(property) {
		var dest = entities.get(entity, property);
		var isNewProp = false;
		if (dest === undefined) {
			isNewProp = true;
			dest = {};
		}
		setOwnPropertiesDeep(animation[a.frame].properties[property], dest);
		if (isNewProp) {
			entities.set(entity, property, dest);
		}
	});
}

module.exports = function(ecs, data) {
	data.entities.onAddComponent("animation", function(entity, component, a) {
		var animation = data.animations[a.name];
		if (animation === undefined) {
			return;
		}
		applyAnimation(entity, a, animation, data.entities);
	});
	ecs.addEach(function advanceAnimations(entity, elapsed) {
		var a = data.entities.get(entity, "animation");
		var animation = data.animations[a.name];
		if (animation === undefined) {
			return;
		}
		if (a.name != a.lastName) {
			a.frame = 0;
			a.time = 0;
		}
		a.time += elapsed * a.speed;
		var lastFrame = a.frame;
		while (a.time > animation[a.frame].time) {
			a.time -= animation[a.frame].time;
			a.frame++;
			if (a.frame >= animation.length) {
				if (a.loop) {
					a.frame = 0;
				} else {
					a.frame--;
				}
			}
		}
		if (lastFrame != a.frame || a.name != a.lastName) {
			applyAnimation(entity, a, animation, data.entities);
		}
	}, "animation");
};
