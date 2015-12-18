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

module.exports = function advanceAnimations(ecs, data) {
	ecs.addEach(function(entity, elapsed) {
		var a = data.entities.get(entity, "animation");
		var animation = data.animations[a.name];
		if (animation === undefined) {
			return;
		}

		a.time += elapsed * a.speed;
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
		applyAnimation(entity, a, animation, data.entities);
	}, "animation");
};
