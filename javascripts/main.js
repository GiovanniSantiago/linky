$(document).ready(function() {
	var canvases = [
			$("#layer1")[0],
			$("#layer2")[0]
		],
		contexts = [
			canvases[0].getContext('2d'),
			canvases[1].getContext('2d')
		],
		width = canvases[0].width,
		height = canvases[0].height;
	
	var $controlPanel = $("#controls"),
		$wheelListPanel = $("#wheelList"),
		$speedBar = $controlPanel.find("#speed"),
		$playButton = $controlPanel.find("#playpause"),
		$resetButton = $controlPanel.find("#resetButton"),
		$addWheelButton = $controlPanel.find("#addWheelButton"),
		$toggleTraceButton = $controlPanel.find("#toggleTraceButton"),
		$clearTraceButton = $controlPanel.find("#clearTraceButton");
	
	$speedBar.on("input", function() {
		globalSpeed = Number($(this).val());
	});
	
	$playButton.on("click", function() {
		paused = !paused;
	});
	
	$resetButton.on("click", function() {
		time = 0;
		fixLastPos();
	});
	
	$addWheelButton.on("click", function() {
		var $panelDiv = $("<div class=\"wheelPanel\"></div>"),
			radiusSlider = "<input type=\"range\" data-param=\"radius\" min=\"0\" max=\"200\" value=\"50\" step=\"1\">",
			speedSlider = "<input type=\"range\" data-param=\"speed\" min=\"-20\" max=\"20\" value=\"2\" step=\"0.001\">",
			phaseSlider = "<input type=\"range\" data-param=\"phase\" min=\"0\" max=\"6.23\" value=\"0\" step=\"0.1\">",
			deleteButton = "<input type=\"button\" value=\"Delete\">";
		
		$panelDiv.append("<label>Radius</label>",radiusSlider, "<label>Speed</label>",speedSlider, "<label>Phase</label>", phaseSlider, deleteButton);
		var newPhasor = {
			r: 50,
			speed: 2,
			baseAngle: 0
		};
		if(phasors.length != 0) {
			newPhasor.parent = phasors[phasors.length -1];
		}
		var newId = phasors.length;
		
		$panelDiv.find("input[data-param='radius']").on("input", function() {
			phasors[$(this).parent().index()].r = Number($(this).val());
			fixLastPos();
		});
		
		$panelDiv.find("input[data-param='speed']").on("input", function() {
			phasors[$(this).parent().index()].speed = Number($(this).val());
			fixLastPos();
		});
		
		$panelDiv.find("input[data-param='phase']").on("input", function() {
			phasors[$(this).parent().index()].baseAngle = Number($(this).val());
			fixLastPos();
		});
		
		$panelDiv.find("input[type='button']").on("click",function() {
			var index = $(this).parent().index();
			if(index != phasors.length - 1) {
				phasors[index+1].parent = phasors[index].parent;
			}
			phasors.splice(index,1);
			
			fixLastPos();
			$(this).parent().remove();
		});
		
		phasors.push(newPhasor);
		fixLastPos();
		$wheelListPanel.append($panelDiv);
		
	});
	
	$toggleTraceButton.on("click", function() {
		trace = !trace;
	});
	
	$clearTraceButton.on("click", function() {
		marks.clearRect(0,0,width,height);
		marks.font = "20px Georgia";
		marks.fillStyle = "black";
		marks.textBaseline = "top";
		marks.fillText("Wheels", 10, 10);
	});
	
	var base = contexts[0];
	var marks = contexts[1];
	
	marks.clearRect(0,0,width,height);
	marks.font = "20px Georgia";
	marks.fillStyle = "black";
	marks.textBaseline = "top";
	marks.fillText("Wheels", 10, 10);
	
	base.fillStyle = "white";
	base.fillRect(0,0,width,height);
	
	var time = 0;
	var globalSpeed = 0.01;
	
	var paused = false;
	
	var trace = false;
	
	var lastPos = {x:0,y:0};
	
	var phasors = [
	];
	
	update();
	
	function fixLastPos() {
		if(phasors.length != 0) {
			lastPos = calcPos(phasors[phasors.length - 1]);
		}
	}
	
	function update() {
		base.fillStyle = "white";
		base.fillRect(0,0,width,height);
		base.stokeStyle = "black";
		base.lineWidth = 1;
		base.strokeRect(5,5,width-10,height-10);
		
		phasors.forEach(function(p) {
			var center;
			if(p.parent) {
				center = calcPos(p.parent);
			} else {
				center = {x:width/2,y:height/2};
			}
			
			drawWheel(center,p.r, p.baseAngle + time * p.speed);
		});
		
		if(!paused) {
			time += globalSpeed;
			if(phasors.length != 0) {
				var newPos = calcPos(phasors[phasors.length - 1]);
				if(phasors.length != 0) {
					if(trace) {

						marks.beginPath();

						marks.moveTo(lastPos.x,lastPos.y);
						marks.lineTo(newPos.x,newPos.y);
						marks.strokeStyle = "red";
						marks.lineWidth = 2;

						marks.stroke();

					}
				}
				lastPos = newPos;
			}

		}
		
		requestAnimationFrame(update);
	}
	
	function drawWheel(center, radius, phase) {
		base.strokeStyle = "gray";
		base.lineWidth = 4;
		base.lineCap = "round";
		
		var target = {
			x:center.x + radius * Math.cos(phase),
			y:center.y + radius * Math.sin(phase)
		};
		base.beginPath();
		
		base.arc(center.x,center.y, radius, 0, 2 * Math.PI);
		base.moveTo(center.x,center.y);
		base.lineTo(target.x, 
				   target.y);
		
		base.stroke();
		
		base.fillStyle = "blue";
		base.beginPath();
		
		base.arc(target.x, target.y, 5, 0, 2* Math.PI);
		
		base.fill();
	}
	
	function calcPos(p) {
		if(p.parent) {
			var parPos = calcPos(p.parent);
			return {
				x:parPos.x + p.r*Math.cos(p.baseAngle + p.speed * time),
				y:parPos.y + p.r*Math.sin(p.baseAngle + p.speed * time)
			};
		}
		else {
			return {
				x: width/2 + p.r*Math.cos(p.baseAngle + p.speed * time),
				y: height/2 + p.r*Math.sin(p.baseAngle + p.speed * time)
			};
		}
	}
});

function phys() {
	var $canvas = $('#maincanvas'),
		$simform = $('#simulationControls'),
		$playbutton = $simform.find('#playButton'),
		canvas = $canvas[0],
		context = canvas.getContext('2d'),
		width = canvas.width,
		height = canvas.height;
	
	// Cursor Vars
	
	var cursorPos = { x:0, y:0 },
		cursorSize = 30;
	
	// Simulation Control Vars
	
	var isPaused = false;
	
	setupListeners();
	
	$canvas.on("mousemove", function(e) {
		var curpos = Utils.mousePos(canvas,e);
		cursorPos.x = curpos.x;
		cursorPos.y = curpos.y;
	})
	
	update();
	
	function update() {
		context.fillStyle = "white";
		context.fillRect(0,0,width,height);
		
		context.fillStyle = isPaused ? "Red" : "Green";
		context.fillRect(0,0,30,30);
		
		context.strokeStyle = "gray";
		context.beginPath();
		context.moveTo(cursorPos.x - cursorSize/2, cursorPos.y);
		context.lineTo(cursorPos.x + cursorSize/2, cursorPos.y);
		
		context.moveTo(cursorPos.x, cursorPos.y - cursorSize/2);
		context.lineTo(cursorPos.x, cursorPos.y + cursorSize/2);
		context.stroke();
		
		requestAnimationFrame(update);
	}
	
	function setupListeners() {
		$playbutton.prop('value',isPaused ? "Play" : "Pause");
		$playbutton.on("click", togglePlayState);
	}
	
	function togglePlayState() {
		isPaused = !isPaused;
		$playbutton.prop('value',isPaused ? "Play" : "Pause");
		$playbutton.removeClass(isPaused ? "pause" : "play");
		$playbutton.addClass(isPaused ? "play" : "pause");
	}
}