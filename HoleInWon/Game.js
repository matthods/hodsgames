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
			canvasY = canvasX/1.9355;
		}
		if(canvasY > window.innerHeight) {
			canvasY = window.innerHeight;
			canvasX = canvasY*1.9355;
		}
	}
	document.getElementById('canvas').style.marginLeft = -canvasX/2+'px';
	document.getElementById('canvas').style.marginTop = -canvasY/2+'px';
	
	
	if(timer >= .9) {
		homeBtn.style.left = (window.innerWidth-canvasX)/2+canvasX/1.5+'px';
		homeBtn.style.top = (window.innerHeight-canvasY)/2+canvasY/5+'px';
		homeBtn.style.fontSize = canvasX/42+'px';
		
		playBtn.style.left = (window.innerWidth-canvasX)/2+canvasX/1.5+'px';
		playBtn.style.top = (window.innerHeight-canvasY)/2+canvasY/20+'px';
		playBtn.style.fontSize = canvasX/35+'px';
	}
}

let playBtn = document.getElementById('playBtn');
let homeBtn = document.getElementById('homeBtn');

let frameCount = 0;
let frameNum = 1;

const bounce = new Audio('sound/bounce.mp3');
const hitWall = new Audio('sound/hitWall.mp3');
const countDownAudio = new Audio('sound/countDown.mp3');
const hitBall = new Audio('sound/hitBall.mp3');

let golfingImage = document.getElementById('Golfing'+frameNum);
let golfingImageFlip = document.getElementById('GolfingFlip'+frameNum);

let saveScoreKey = 'highScore';

let flipImage = false;

let ground = 500;

let player = {
	x: 20,
	y: ground-175,
	swing: false,
	allowSwing: true,
	madeHole: false,
	score: 0,
}

let playAgain = false;
let playAgainCount = 0;

let go = false;

let timer = 0;
let countDown = 60;
let startCount = 3;
let startCountStart = 0;
let startCountDown = true;

let clubStrengthX = 0;
let clubStrengthY = 0;

let ball = {
	x: 150,
	y: ground+15,
	ground: ground+15,
	startStrengthY: 0,
	strengthY: 0,
	strengthX: 0,
	bounce: false,
	hit: false,
	amount: 2,
	angle: 1.7,
	radius: 6,
}

let hole = {
	x: Math.random()*470+700,
	y: ground+20,
}

let croc = {
	y:ground,
	wy:ground,
	yv:0,
	img:document.getElementById('croc'+Math.floor(Math.random()*8)),
};

let scoreStr = localStorage.getItem(saveScoreKey);

if(scoreStr == null) {
	scoreHigh = 0;
} else {
	scoreHigh = parseInt(scoreStr);
}

document.getElementById('rec1').innerHTML = scoreHigh;

let startTime;

startGame = function(timestamp) {
	startTime = startTime || timestamp;
	FPS = 1000/(timestamp-startTime)
	ctx.clearRect(0,0,canvas.width,canvas.height);
	canvasSize();
	if(countDown > 0 || croc.y < ground) {
		drawCroc();
	}
	drawField();
	playerSwing();
	madeHole();
	moveBall();
	score();
	requestAnimationFrame(startGame);
	startTime = timestamp;
}

document.onkeydown = function(event) {
	if(event.keyCode == 123) {
      return false;
    } else if(event.ctrlKey && event.shiftKey && event.keyCode == 73) {
      return false;
    } else if(event.ctrlKey && event.keyCode == 85) {
      return false;
    }
	if(event.keyCode == 32) {
		player.swing = true;
		playAgain = true;
	}
}
document.onkeyup = function(event) {
	if(event.keyCode == 32) {
		player.swing = false;
		player.allowSwing = false;
		playAgain = false;
	}
}
document.onmousedown = function() {
	player.swing = true;
}
document.onmouseup = function() {
	player.swing = false;
	player.allowSwing = false;
}

drawField = function() {
	ctx.fillStyle = 'rgb(140,245,140)';
	ctx.fillRect(0,ground,canvas.width,200);
}

playerSwing = function() {
	golfingImage = document.getElementById('Golfing'+frameNum);
	golfingImageFlip = document.getElementById('GolfingFlip'+frameNum);
	if(flipImage == false) {
		ctx.drawImage(golfingImage,player.x,player.y,200,200);
	} else {
		ctx.drawImage(golfingImageFlip,player.x,player.y,200,200);
	}
			
	if(player.allowSwing) {
		if(player.swing) {
			frameCount += 10/FPS;
				
			ball.strengthY +=  8/FPS;
			if(ball.strengthY > 8) {
				ball.strengthY = 8;
			}
			if(flipImage == false) {
				ball.strengthX += 18/FPS;
				if(ball.strengthX > 16) {
					ball.strengthX = 16
				}
			} else {
				ball.strengthX -= 18/FPS;
				if(ball.strengthX < -16) {
					ball.strengthX = -16
				}
			}
		}
		
		if(frameCount >= 1) {
			frameNum += 1;
			frameCount = 0;
		}
		if(frameNum >= 6) {
			frameNum = 6;
		}
	} else {
		frameCount += 25 / FPS;
		if(frameCount >= 1) {
			frameNum -= 1;
			frameCount = 0;
		}
		if(frameNum <= -1) {
			frameNum = -1;
		}
		
		if(ball.hit) {
			ball.startStrengthY = ball.strengthY;
			croc.yv = 80;
		}
	}
}

moveBall = function() {
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.ellipse(ball.x,ball.y,ball.radius,ball.radius,ball.angle,0,ball.amount*Math.PI);
	ctx.fill();
	
	if(ball.strengthX < 0.03 && ball.strengthX > -0.03 && ball.y > ball.ground && player.madeHole == false) {
		ball.strengthX = 0;
		if(player.madeHole == false) {
			player.allowSwing = true;
			frameNum = 1;
			if(ball.x < hole.x) {
				flipImage = false;
				player.x = ball.x-130;
			}
			if(ball.x > hole.x) {
				flipImage = true;
				player.x = ball.x-70;
			}
			ball.strengthY = 0;
			ball.hit = true;
		}
	}

	if(ball.x+ball.radius > canvas.width) {
		hitWall.volume = Math.abs(ball.strengthX/35);
		hitWall.play();
		ball.x = canvas.width - ball.radius;
		ball.strengthX = -ball.strengthX/1.25;
	}
	if(ball.x-ball.radius < 0) {
		hitWall.volume = Math.abs(ball.strengthX/35);
		hitWall.play();
		ball.x = 0 + ball.radius;
		ball.strengthX = -ball.strengthX*1.25;
	}

	if(frameNum <= 1) {
		if(player.allowSwing == false) {
			if(frameNum == 1) {
				if(startCountDown == false) {
					hitBall.volume = Math.abs(ball.strengthY/8);
					hitBall.play();
				}
			}
			ball.hit = false;
			ball.x += ball.strengthX;
			ball.y -= ball.strengthY*2.5;
			if(ball.strengthX > 0.03) {
				ball.strengthX -= 2.5 / FPS;
			} else if(ball.strengthX < -0.03) {
				ball.strengthX += 2.5 / FPS;
			}
			ball.strengthY -= 8.3/FPS;
		
			if(ball.strengthY <= -250/FPS) {
				ball.strengthY = -250/FPS;
			}
			if(player.madeHole == false) {
				if(ball.y > ball.ground && ball.strengthY < 0) {
					ball.bounce = true;
				}
			}

			if(ball.bounce) {
				if(ball.strengthY <= -.5) {
					bounce.currentTime = 0;
					bounce.volume = ball.startStrengthY/(Math.abs(ball.startStrengthY-20)*3);
					bounce.play();
				}
				
				if(ball.strengthX > .1 || ball.strengthX < -.1) {
					ball.startStrengthY /= 1.9;
					ball.strengthY = ball.startStrengthY;
				} else {
					ball.strengthY = 0;
				}
				ball.bounce = false;
			}
			
		}
	}
}

madeHole = function() {
	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.ellipse(hole.x,hole.y,12,5,0,0,2*Math.PI);
	ctx.fill();
	
	if(ball.x > hole.x-14 && ball.x < hole.x+14 && ball.y > ball.ground-1) {
		//if(ball.strengthX < 5.5 && ball.strengthX > -5.5 && ball.strengthY >= -3.2) {
			croc.yv = -600;
			player.madeHole = true;
			ball.strengthX = 0;
			ball.strengthY = 0;
			if(ball.x < hole.x) {
				ball.strengthX = 50 / FPS;
			} else {
				ball.strengthX = -50 / FPS;
			}
			ball.strengthY = -15/FPS;
			ball.angle += 5.6 / FPS;
			ball.amount -= 4 / FPS;
			if(ball.y > hole.y+5) {
				player.allowSwing = true;
				flipImage = false;
				player.x = 20;
				player.score += 1;
				frameNum = 1;
				ball.x = 150;
				ball.angle = 1.7;
				ball.amount = 2;
				hole.x = Math.random()*470+700;
				ball.y = ball.ground;
				ball.strengthY = 0;
				ball.hit = true;
				player.madeHole = false;
			}
		/*} else {
			ball.strengthY = 1;
			ball.startStrengthY /= 2.5;
			if(ball.strengthX > 0) {
				ball.strengthX -= 5;
			} 
			if(ball.strengthX < 0) {
				ball.strengthX += 5;
			}
		}*/
	}
}

score = function() {
	ctx.fillStyle = 'black';
	ctx.font = '120px Coda';
	ctx.fillText(player.score,200,200);
	if(startCountDown == false && countDown > 0) {
		timer += 1 / FPS;
		if(timer >= 1) {
			countDown -= 1;
			timer = 0;
			if(countDown <= 5) {
				countDownAudio.volume = .1;
				countDownAudio.play();
			}
		}
	}
	ctx.font = '250px Courier New';
	ctx.textAlign = 'center';
	ctx.fillText(countDown,canvas.width/2,200,);
	if(countDown <= 0) {
		homeBtn.style.display = 'block';
		playBtn.style.display = 'block';
		document.getElementById('canvas').style.cursor = 'default';
		countDown = 0;
		timer = 0.9;
		player.allowSwing = false;
		ctx.fillStyle = '#ff3838';
		ctx.fillRect(0,250,canvas.width,200,);
		ctx.fillStyle = '#546bff'
		ctx.textAlign = 'center';
		ctx.font = '230px Lucida Console';
		ctx.fillText('SCORE: '+player.score,canvas.width/2,430);
		ctx.fillStyle = 'black';
		ctx.font = '50px Lucida Console';
		ctx.fillText('Press space to play again', canvas.width/2,500);
		playAgainCount += 1/FPS;
		
		croc.w = 120;
		ctx.drawImage(document.getElementById('croc7'),200,canvas.height-croc.w/1.3,croc.w,croc.w);
		ctx.drawImage(document.getElementById('croc6'),canvas.width-200-croc.w,canvas.height-croc.w/1.3,croc.w,croc.w);
		ctx.fillStyle = 'rgb(60,20,10)';
		ctx.font = '100px Impact'
		ctx.fillText('Hods Games',canvas.width/2,canvas.height-20);
		
		if(playAgain && ball.strengthX == 0 && playAgainCount >= 1) {
			document.getElementById('canvas').style.cursor = 'none';
			playAgainCount = 0;
			go = false;
			ball.strengthX = 0;
			ball.strengthY = 0;
			player.allowSwing = false;
			player.swing = false;
			startCountDown = true;
			player.score = 0;
			countDown = 60;
			timer = 0;
			player.x = 20;
			ball.x = 150;
			ball.y = ball.ground;
			homeBtn.style.display = 'none';
			playBtn.style.display = 'none';
		}
	}
	if(go == false) {
		startCountStart += 1 / FPS;
		if(startCountStart >= 1) {
			startCount -= 1;
			startCountStart = 0;
		}
	}
		if(startCountDown) {
			player.allowSwing = false;
			if(startCount <= 3 && startCount > 0) {
				ctx.font = '270px Courier New';
				ctx.fillText(startCount,canvas.width/2,400);
			} else {
				startCountDown = false;
				startCountStart = 0;
			}
		}
		if(startCount <= 0) {
			if(go == false) {
				ctx.fillText('GO!',canvas.width/2,400);
			}
			if(startCount < 0) {
				go = true;
				startCount = 3;
			}
		}
	
	if(player.score > scoreHigh) {
		scoreHigh = player.score;
		localStorage.setItem(saveScoreKey,scoreHigh);
	}
	ctx.font = '30px Lucida Console';
	ctx.fillStyle = 'black';
	ctx.fillText('HIGH SCORE: '+scoreHigh,250,50);
	
	if(crocNum >= 6) {
		ctx.drawImage(croc.img,croc.x,croc.y,croc.w,croc.w);
	}
}

let crocNum;

drawCroc = function() {
	if(croc.y > croc.wy) {
		croc.yv = 0;
		croc.w = Math.random()*40+110;
		croc.x = hole.x-croc.w/2
		crocNum = Math.floor(Math.random()*8);
		croc.img = document.getElementById('croc'+crocNum);
		if(crocNum >= 6) {
			croc.y = croc.wy = canvas.height+croc.w/1.2-68;
		} else {
			croc.y = croc.wy = ground;
		}
	}
	croc.y += croc.yv/FPS;
	if(croc.y < croc.wy-croc.w && croc.yv < 0) {
		croc.yv = 0;
		croc.y = croc.wy-croc.w;
	}
	if(crocNum <= 5) {
		ctx.drawImage(croc.img,croc.x,croc.y,croc.w,croc.w);
	}
}

begin = function() {
	document.getElementById('notCanvas').style.display = 'none';
	document.getElementById('canvas').style.display = 'block';
	document.getElementById('startBtn').style.display = 'none';
	document.getElementById('canvas').style.cursor = 'none';
	document.querySelector('body').style.background = '#c03434';
	requestAnimationFrame(startGame);
}

again = function() {
	if(ball.strengthX == 0 && playAgainCount >= 1) {
		document.getElementById('canvas').style.cursor = 'none';
		playAgainCount = 0;
		go = false;
		ball.strengthX = 0;
		ball.strengthY = 0;
		player.allowSwing = false;
		player.swing = false;
		startCountDown = true;
		player.score = 0;
		countDown = 60;
		timer = 0;
		player.x = 20;
		ball.x = 150;
		ball.y = ball.ground;
		homeBtn.style.display = 'none';
		playBtn.style.display = 'none';
	}
}