"use strict";

function compile(gl, type, src) {
	if (!type) {
		console.error("Invalid shader type: " + type);
		return null;
	}
	var shader = gl.createShader(gl[type]);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

var shaderTypes = {
	"x-shader/x-fragment": "FRAGMENT_SHADER",
	"x-shader/x-vertex": "VERTEX_SHADER"
};

function get(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var src = shaderScript.textContent;
	return compile(gl, shaderTypes[shaderScript.type], src);
}

function link(gl, shaders, vertexAttribArrays, uniformVars) {
	var program = gl.createProgram();

	for (var i = 0; i < shaders.length; i++) {
		gl.attachShader(program, shaders[i]);
	}

	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error("Could not initialise shaders");
		return null;
	}

	gl.useProgram(program);

	bindVertexAttribArrays(gl, program, vertexAttribArrays);
	bindUniformVars(gl, program, uniformVars);

	return program;
}

function bindVertexAttribArrays(gl, shaderProgram, vertexAttribArrays) {
	Object.keys(vertexAttribArrays).forEach(function(key) {
		shaderProgram[key] = gl.getAttribLocation(shaderProgram, vertexAttribArrays[key]);
		gl.enableVertexAttribArray(shaderProgram[key]);
	});
}

function bindUniformVars(gl, shaderProgram, uniformVars) {
	Object.keys(uniformVars).forEach(function(key) {
		shaderProgram[key] = gl.getUniformLocation(shaderProgram, uniformVars[key]);
	});
}

module.exports = {
	compile: compile,
	get: get,
	link: link
};
