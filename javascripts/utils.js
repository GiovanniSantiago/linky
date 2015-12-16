var Utils = Utils || (function() {
	var obj = {};
	
	var norm = obj.norm = function(value, min, max) {
		return (value - min) / (max - min);
	};
	var lerp = obj.lerp = function(norm, min, max) {
		return (max - min) * norm + min;
	};
	var map = obj.map = function(value, sourceMin, sourceMax, destMin, destMax) {
		return lerp(norm(value,sourceMin,sourceMax),destMin,destMax);
	};
	var clamp = obj.clamp = function(value, a, b) {
		var min = Math.min(a,b),
			max = Math.max(a,b);
		return Math.min(Math.max(value,min), max);
	};
	var distance = obj.distance = function(p0, p1) {
		var dx = p1.x - p0.x,
			dy = p1.y - p0.y;
		return Math.sqrt(dx * dx + dy * dy);
	};
	var distanceXY = obj.distanceXY = function(x0, y0, x1, y1) {
		var dx = x1 - x0,
			dy = y1 - y0;
		return Math.sqrt(dx * dx + dy * dy);
	};
	var randomRange = obj.randomRange = function(min, max) {
		return lerp(Math.random(), min, max);
	};
	var randomInt = obj.randomInt = function(min, max) {
		return Math.floor(randomRange(min,max));
	};
	var toRads = obj.toRads = function(deg) {
		return deg / 180 * Math.PI;
	};
	var toDegs = obj.toDegs = function(rad) {
		return radians * 180 / Math.PI;
	};
	var searchBy = obj.searchBy = function(col,prop,val) {
		for(var i = 0; i < col.length; i++) {
			if(col[i][prop] === val)
				return col[i];
		}
	};
	var mousePos = obj.mousePos = function (canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}
	
	return obj;
})();