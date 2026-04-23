let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let FPS;

let canvasY = 0;
let canvasX = 0;

canvasSize = function() {
	document.getElementById('canvas').style.height = canvasY+'px';
	document.getElementById('canvas').style.width = canvasX+'px';
	
	if(canvasY < window.innerHeight && canvasX < window.innerWidth) {
		canvasY += 10000/FPS;
		canvasX += 19355/FPS;
	} else {
		if(canvasX > window.innerWidth) {
			canvasX = window.innerWidth;
			canvasY = canvasX/(canvas.width/canvas.height);
		}
		if(canvasY > window.innerHeight) {
			canvasY = window.innerHeight;
			canvasX = canvasY*(canvas.width/canvas.height);
		}
	}
	document.getElementById('canvas').style.marginLeft = -canvasX/2+'px';
	document.getElementById('canvas').style.marginTop = -canvasY/2+'px';
}

let startTime;

startGame = function(timeStamp) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	startTime = startTime || timeStamp;
	FPS = 1000/(timeStamp-startTime);
	ctx.fillText(Math.round(FPS),10,10);
	canvasSize();
	startTime = timeStamp;
	requestAnimationFrame(startGame);
}

requestAnimationFrame(startGame);