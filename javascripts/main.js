$(document).ready(function() {
	var $canvas = $('#maincanvas'),
		canvas = $canvas[0],
		context = canvas.getContext('2d'),
		width = canvas.width,
		height = canvas.height;
	
	var cursorPos = { x:0, y:0 },
		cursorSize = 30;
	
	$canvas.on("mousemove", function(e) {
		var curpos = Utils.mousePos(canvas,e);
		cursorPos.x = curpos.x;
		cursorPos.y = curpos.y;
	})
	
	update();
	
	function update() {
		context.fillStyle = "white";
		context.fillRect(0,0,width,height);
		
		context.strokeStyle = "gray";
		context.beginPath();
		context.moveTo(cursorPos.x - cursorSize/2, cursorPos.y);
		context.lineTo(cursorPos.x + cursorSize/2, cursorPos.y);
		
		context.moveTo(cursorPos.x, cursorPos.y - cursorSize/2);
		context.lineTo(cursorPos.x, cursorPos.y + cursorSize/2);
		context.stroke();
		
		requestAnimationFrame(update);
	}
});