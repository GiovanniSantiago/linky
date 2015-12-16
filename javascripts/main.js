$(document).ready(function() {
	var canvas = $('#maincanvas')[0],
		context = canvas.getContext('2d'),
		width = canvas.width,
		height = canvas.height;
	context.fillStyle = "white";
	context.fillRect(0,0,width,height);
	context.fillStyle = "black";
	context.font = "40px Georgia";
	context.textAlign = "center";
	context.fillText("HAI",width/2,height/2);
});