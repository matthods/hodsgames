let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

const FPS = 40;

let canvasY = 0;
let canvasX = 0;

const onGroundSound = new Audio('onGroundSound.mp3');
const countDownSound = new Audio('countDownSound.mp3');
const clickSound = new Audio('clickSound.mp3');
const onRampSound = new Audio('onRampSound.mp3');
const onTubeSound = new Audio('onTubeSound.mp3');
const windSound = new Audio('windSound.mp3');
const hitTubeSound = new Audio('hitTubeSound.mp3');
const loseSlideSound = new Audio('loseSlideSound.mp3');
const loseOnBaracade = new Audio('loseOnBaracade.mp3');
const dogBarkingSound = new Audio('dogBarkingSound.mp3');


titleSize = function() {
	document.getElementById('const').style.fontSize = window.innerWidth/11+'px';
	document.getElementById('run').style.fontSize = window.innerWidth/11+'px';
	
	setTimeout(titleSize,500);
}

titleSize();

canvasSize = function() {
	document.getElementById('canvas').style.height = canvasY+'px';
	document.getElementById('canvas').style.width = canvasX+'px';
	
	if(canvasY < window.innerHeight && canvasX < window.innerWidth) {
		canvasY += 10000/FPS;
		canvasX += 19355/FPS;
	} else {
		document.querySelector('body').style.background = '#c03434';
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
}

let ground = {
	x:0,
	y:canvas.height-100,
};

let player = {
	x:100,
	y:ground.y-460,
	sizeX:65,
	sizeY:100,
	angle:0,
	jump:false,
	jumping:true,
	down:false,
	goingDown:false,
	speedY:0,
	speedX:0,
	frameNum:1,
	frameCount:0,
	frameSpeed:0,
	lose:false,
	score: 0,
	highScore: localStorage.getItem('constructionRunHighScore'),
};

if(player.highScore == null) {
	player.highScore = 0;
}

document.getElementById('highScore').innerHTML = 'HIGH SCORE: '+player.highScore;

let runImage = undefined;//document.getElementById('run'+player.frameNum);

let block = {
	x:canvas.width+Math.random()*650+250,
	y:Math.random()*100+canvas.height/2,
	sizeY:Math.random()*130+50,
	sizeX:Math.random()*200+50,
	type: 'block',
	hit:false,
	angle:0,
};

let coneHit = false;

let frontTubeImage = document.getElementById('frontTube');
let middleTubeImage = document.getElementById('middleTube');
let backTubeImage = document.getElementById('backTube');

let coneImage = document.getElementById('cone');

let baracadeImage = document.getElementById('baracade');

let dogFrame = 1;
let dogFrameCount = 0;

let ramp = {
	x:canvas.width+Math.random()*600+200,
	y:ground.y,
	length:Math.random()*700+150,
	height:Math.random()*500+50,
	hit: false,
};

let rampImage = document.getElementById('ramp');

let interval;

let playBtn = document.getElementById('playBtn');

let startCountDown, countDownNum, countDownCount, showCountDown;

newGame = function() {
	
	document.getElementById('startScreen').style.display = 'none';
	
	document.getElementById('canvas').style.cursor = 'none';
	
	if(runImage != document.getElementById('run'+player.frameNum) && player.speedX == 0) {
	clickSound.volume = .2;
	clickSound.play();
		
	canvas.style.display = 'block';
	
	playBtn.style.left = '-100%';
	
	
	startCountDown = 0;
	countDownNum = 3;
	countDownCount = 0;
	showCountDown = false;
	
	player.sizeX = 65;
	player.sizeY = 100;
	player.x = canvas.width/2-player.sizeX/2;
	player.y = ground.y-player.sizeY;
	player.angle = 0;
	player.jump = false;
	player.jumping = true;
	player.down = false;
	player.goingDown = false;
	player.speedY = 0;
	player.speedX = 40/FPS;
	player.lose = false;
	player.frameNum = 3;
	player.frameSpeed = 0;
	player.score = 0;
	runImage = document.getElementById('startPlayer');

	block.x = canvas.width+Math.random()*2000+1600;
	block.y = Math.random()*100+canvas.height/2.5;
	block.sizeY = Math.random()*130+50;
	block.sizeX = Math.random()*200+50;
	block.hit = false;
	block.angle = 0;
	coneHit = false;

	ramp.x = canvas.width+Math.random()*2200+1800;
	ramp.y = ground.y;
	ramp.length = Math.random()*700+150;
	ramp.height = Math.random()*500+50;
	ramp.hit = false;
	
	clearInterval(interval);
	interval = setInterval(startGame,1000/FPS);
	}
}

startGame = function() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	canvasSize();
	countDown();
	
	obstacles();
	movePlayer();
	score();
	
	inGround();
	audio();
}

document.onkeydown = function() {
	if(event.keyCode == 123) {
      return false;
    } else if(event.ctrlKey && event.shiftKey && event.keyCode == 73) {
      return false;
    } else if(event.ctrlKey && event.keyCode == 85) {
      return false;
    }
	if(event.keyCode == 38) {
		player.jump = true;
	}
	if(event.keyCode == 40) {
		player.down = true;
	}
}

document.onkeyup = function() {
	if(event.keyCode == 38) {
		player.jump = false;
	}
	if(event.keyCode == 40) {
		player.down = false;
	}
}

movePlayer = function() {
	
	ctx.save();
	ctx.translate(player.x+player.sizeX/2,player.y+player.sizeY/2);
	ctx.rotate(player.angle);
	ctx.fillStyle = 'red';
	//ctx.fillRect(-player.sizeX/2,-player.sizeY/2,player.sizeX,player.sizeY);
	ctx.drawImage(runImage,-player.sizeX/2,-player.sizeY/2,player.sizeX,player.sizeY);
	ctx.restore();
	
	if(countDownNum == 'GO!') {
	
	if(player.lose) {
		document.getElementById('canvas').style.cursor = 'default';
		player.angle = 0;
		if(player.loseWay == 'hitWall') {
			player.frameCount += 20/FPS;

			if(player.frameCount >= 1) {
				if(player.frameNum < 15) {
					player.frameNum += 1;
				}
				player.frameCount = 0;
			}
			runImage = document.getElementById('hitWall'+player.frameNum);
			player.speedY -= 55/FPS;
			if(player.frameNum < 15) {
				player.x -= 20/FPS;
			} else {
				if(player.speedX < 0 && player.y+player.sizeY >= ground.y) {
					player.speedX += 7/FPS;
					player.x += 10/FPS * -player.speedX;
				} else {
					player.speedX = 0;
					//if(playBtn
					//playBtn.style.visibility = 'visible';
					playBtn.style.left = '50%';
				}
			}
		}
		if(player.loseWay == 'trip') {
			player.frameCount += 18/FPS;

			if(player.frameCount >= 1) {
				if(player.frameNum < 7) {
					player.frameNum += 1;
				}
				player.frameCount = 0;
			}
			runImage = document.getElementById('trip'+player.frameNum);
			player.speedY -= 55/FPS;
			if(player.frameNum < 7) {
			} else {
				if(player.speedX > 0) {
					player.speedX -= 10/FPS;
					player.x -= 10/FPS * -player.speedX;
				} else {
					player.speedX = 0;
					playBtn.style.left = '50%';
				}
			}
		}
	} else {
		if(player.frameSpeed < 18/FPS) {
			player.frameSpeed = player.speedX/40+5/FPS
		}
		
		player.frameCount += player.frameSpeed;
	
		if(player.frameCount >= 1) {
			if(player.frameNum < 6) {
				player.frameNum += 1;
			} else {
				player.frameNum = 1;
			}
			player.frameCount = 0;
		}
		player.sizeX = 65;
		player.sizeY = 100;
		
		if(player.x > 100) {
			player.x -= ((player.x+200)-player.x*1.2)/FPS;
		}
		
		if(player.x < 100) {
			player.x = 100;
		}
		
		if(player.speedX < 380/FPS) {
			player.speedX += 7/FPS;
		}
		
		runImage = document.getElementById('run'+player.frameNum);
	}
	
	if(player.lose == false) {
	
	if(player.jump) {
		if(player.jumping == false) {
			player.jumping = true;
			player.speedY = 500/FPS;
		}
	}
	
	if(player.jumping) {
		//block.hit = false;
	}
	
	
	
	
	player.speedX += .14/FPS;
	
	}
	
	}
	
	if(ramp.hit == false && block.hit == false) {
		if(player.jumping) {
			if(player.speedY > -550/FPS) { 
				player.speedY -= 15/FPS;
			}
			if(player.speedY <= -700/FPS) {
				player.speedY -= 40/FPS;
			//	runImage = document.getElementById('down');
			//	player.sizeX = 127;
			//	player.sizeY = 120;
			}
		} else {
			//player.speedY = 0;
		}
		
		if(player.y+player.sizeY < ground.y && block.hit == false && ramp.hit == false) {
			player.jumping = true;
		}
		
		if(player.down && player.goingDown == false && block.hit == false && player.jump == false) {
			player.goingDown = true;
			player.speedY = -750/FPS;
		}
	} else {
		player.goingDown = false;
		player.jumping = false;
	}
	
	
	player.y -= player.speedY;
	
	if(player.y+player.sizeY > ground.y) {
		player.jumping = false;
		player.goingDown = false;
		player.y = ground.y-player.sizeY;
		player.speedY = 0;
	}
	
}

obstacles = function() {
	let dogImage = document.getElementById('dog'+dogFrame);
	
	ctx.save();
	ctx.translate(ramp.x,ground.y);
	ctx.rotate(-ramp.height/ramp.length);
	ctx.drawImage(rampImage,0,0,ramp.length*4,ramp.height*4,0,0,ramp.length+15,ramp.height);
	ctx.restore();
	
	if(countDownNum == 'GO!') {
		block.x -= player.speedX;
		ramp.x -= player.speedX;
	}
	
	if(player.lose == false) {
		if(player.x+player.sizeX >= ramp.x && player.x+player.sizeX/2 <= ramp.x+ramp.length+20 && player.y+player.sizeY >= ground.y-((player.x+player.sizeX-ramp.x-30)*((Math.tan(((ramp.height)/(ramp.length))))))) {
			player.angle = -Math.atan(ramp.height/ramp.length);
			ramp.hit = true;
			player.speedY = 0;
			player.jumping = false;
			player.goingDown = false;
			player.y = ground.y-player.sizeY-((player.x+player.sizeX-ramp.x-30)*((Math.tan(((ramp.height)/(ramp.length))))));
		} else {
			player.angle = 0;
			ramp.hit = false;
		}
	}
	
	if(block.x+block.sizeX >= ramp.x && block.x <= ramp.x+ramp.length) {
		if(block.y+block.sizeY >= ground.y-((block.x+block.sizeX-ramp.x-10)*((Math.tan(((ramp.height)/(ramp.length))))))) {
			if(block.type != 'airTube' && block.type != 'tube' && coneHit == false) {
				block.x = canvas.width + Math.random()*250+250;
			}
		}
	}
	
	if(block.y+block.sizeY > ground.y) {
		block.sizeY = ground.y-block.y;
	}
	
	if(player.x+player.sizeX >= block.x && player.x <= block.x+block.sizeX) {
		if(player.lose == false) {
		if(player.y+player.sizeY >= block.y+player.speedY*2 && player.y+player.sizeY <= block.y+20) {
		/*	if(player.speedY <= 0) {
				//player.speedY = 0;
				player.jumping = false;
				player.goingDown = false;
			}
		}*/
		
		//if(player.y+player.sizeY >= block.y && player.y+player.sizeY <= block.y+20) {
			block.hit = true;
			player.jumping = false;
			player.goingDown = false;
			if(block.type == 'tube' || block.type == 'airTube') {
				player.y = block.y-player.sizeY;
				player.speedY = 0;
				player.jumping = false;
				player.goingDown = false;

			} else {
				if(block.type = 'cone') {
					coneHit = true;
				}
				player.lose = true;
				player.frameNum = 1;
				player.sizeX = 160;
				player.loseWay = 'trip';
				player.speedY = 0;
				player.speedX = player.speedX/1.5;
				if(player.speedX > 1300/FPS) {
					player.speedX = 1300/FPS;
				}
				runImage = document.getElementById('trip'+player.frameNum);
			}
		} else {
			block.hit = false;
		}
		}
		
		
		if(player.lose == false) {
		if(player.y+player.sizeY > block.y+20 && player.y <= block.y+block.sizeY) {
			if(block.type == 'cone') {
				if(player.x+player.sizeX >= block.x+45 && player.x <= block.x+block.sizeX) {
					block.hit = true;
					coneHit = true;
					player.frameNum = 1;
					player.lose = true;
					player.loseWay = 'hitWall';
					player.sizeX = 160;
					player.speedX = -player.speedX/2;
					if(player.speedX < -500/FPS) {
						player.speedX = -500/FPS; 
					}
					player.x = block.x+30-player.sizeX-1;
					runImage = document.getElementById('hitWall'+player.frameNum);
				}
			} else {
				block.hit = true;
				player.frameNum = 1;
				player.lose = true;
				player.loseWay = 'hitWall';
				player.sizeX = 160;
				player.speedX = -player.speedX/2;
				if(player.speedX < -650/FPS) {
					player.speedX = -650/FPS; 
				}
				player.x = block.x-player.sizeX-1;
				runImage = document.getElementById('hitWall'+player.frameNum);
			}
		}
		}
	} else {
		block.hit = false;
	}
	
	if(coneHit) {
		if(block.type == 'cone') {
			if(player.loseWay == 'hitWall') {
				block.x += -player.speedX/1.5;
			}
			if(block.angle < 1.75) {
				block.angle += 7/FPS;
			} else {
				block.angle = 1.75
			}
		}
	}
	
	if(block.sizeX/block.sizeY <= 5 && block.sizeX/block.sizeY >= 1.9 && block.sizeX >= 180) {
		ctx.lineWidth = '1.5';
		ctx.beginPath();
		ctx.moveTo(block.x+30,block.y);
		ctx.lineTo(block.x+40,-20);
		ctx.lineTo(block.x+block.sizeX-40,-20);
		ctx.lineTo(block.x+block.sizeX-30,block.y);
		ctx.stroke();
			
		if(block.y+block.sizeY < ground.y) {
			block.type = 'airTube';
			
			block.y += 30/FPS;
		} else {
			block.type = 'tube';
		}
		
		ctx.drawImage(middleTubeImage,block.x+40,block.y,block.sizeX-80,block.sizeY);
		ctx.drawImage(frontTubeImage,block.x,block.y,40,block.sizeY);
		ctx.drawImage(backTubeImage,block.x+block.sizeX-40,block.y,40,block.sizeY);
	} else if (block.sizeX/block.sizeY < 1.9 && block.sizeX/block.sizeY >= 1.3 && block.sizeX >= 100 && block.sizeX < 180) {
		block.type = 'baracade'
		block.y = ground.y-block.sizeY;
		ctx.drawImage(baracadeImage,block.x,block.y,block.sizeX,block.sizeY);
	} else if(block.sizeX/block.sizeY < 1.8 && block.sizeX/block.sizeY >= .9 && block.sizeX < 110 && block.sizeX >= 60) {
		block.type = 'dog';
		block.y = ground.y-block.sizeY;
		ctx.drawImage(dogImage,block.x,block.y,block.sizeX,block.sizeY);
		
		ctx.setLineDash([5,8]);
		ctx.lineWidth = '3';
		ctx.beginPath();
		ctx.moveTo(block.x+block.sizeX/1.8,block.y+block.sizeY/3);
		ctx.lineTo(block.x+block.sizeX+100,block.y+block.sizeY/2);
		ctx.stroke();

		ctx.setLineDash([0]);
		ctx.lineWidth = '8';
		ctx.beginPath();
		ctx.moveTo(block.x+block.sizeX+100,block.y);
		ctx.lineTo(block.x+block.sizeX+100,ground.y);
		ctx.stroke();
		
		dogFrameCount += 8/FPS;
		
		if(dogFrameCount >= 1) {
			if(dogFrame < 4) {
				dogFrame += 1;
			} else {
				dogFrame = 1;
			}
			dogFrameCount = 0;
		}
	} else if(block.sizeX/block.sizeY < .8 && block.sizeX/block.sizeY >= 0.5) {
		block.type = 'cone';
		
		block.sizeX = 70;
		block.sizeY = block.sizeX*1.5;
		
		block.y = ground.y-block.sizeY;
		
		if(coneHit) {
			ctx.save();
			ctx.translate(block.x+block.sizeX,block.y+block.sizeY);
			ctx.rotate(block.angle);
			ctx.drawImage(coneImage,-block.sizeX,-block.sizeY,block.sizeX,block.sizeY);
			ctx.restore();
		} else {
			ctx.drawImage(coneImage,block.x,block.y,block.sizeX,block.sizeY);
		}
		
	} else {
		block.type = 'block';
		//ctx.fillRect(block.x,block.y,block.sizeX,block.sizeY);
		block.x = canvas.width + Math.random()*650+250;
		block.y = Math.random()*100+canvas.height/2;
		block.sizeY = Math.random()*130+50;
		block.sizeX = Math.random()*200+50;
	}
	
	/*ctx.beginPath();
	ctx.moveTo(ramp.x,ground.y);
	ctx.lineTo(ramp.x+ramp.length,ground.y);
	ctx.lineTo(ramp.x+ramp.length,ground.y-ramp.height);
	ctx.fill();
	*/
	
	if(block.x+block.sizeX < -200 || block.type != 'airTube' && block.y <= 380) {
		block.x = canvas.width + Math.random()*1000+450;
		block.y = Math.random()*100+canvas.height/2;
		block.sizeY = Math.random()*130+50;
		block.sizeX = Math.random()*200+50;
	}
	
	if(ramp.x+ramp.length+100 < 0) {
		ramp.x = canvas.width+Math.random()*1000+1000;
		ramp.length = Math.random()*550+250;
		ramp.height = Math.random()*300+50;
	}
	
	if(ramp.height/ramp.length >= 0.4 || ramp.height/ramp.length <= 0.14) {
		ramp.length = Math.random()*550+150;
		ramp.height = Math.random()*400+50;
	}
}

let rocks = [];
let bigRocks = [];

inGround = function() {
	ctx.fillStyle = '#cca574';
	ctx.fillRect(ground.x,ground.y,canvas.width,200);
	
	if(rocks.length < 300) {
		rocks.push({
			x:Math.random()*(canvas.width+500),
			y:ground.y+Math.random()*70+15,
		});
	}
	
	for(let i = 0; i < rocks.length; i++) {
		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.arc(rocks[i].x,rocks[i].y,.5,0,2*Math.PI);
		ctx.fill();
		
		if(countDownNum == 'GO!') {
			rocks[i].x -= player.speedX;
		}
		
		if(rocks[i].x < -2000) {
			rocks[i].x = canvas.width+Math.random()*canvas.width+1;
			rocks[i].y = ground.y+Math.random()*70+15;
		}
	}
	
	if(bigRocks.length < 350) {
		bigRocks.push({
			x:Math.random()*(canvas.width+500),
			y:ground.y,
		});
	}
	
	for(let i = 0; i < bigRocks.length; i++) {
		ctx.fillStyle = '#cca574';
		ctx.beginPath();
		ctx.moveTo(bigRocks[i].x-15,bigRocks[i].y);
		ctx.lineTo(bigRocks[i].x,bigRocks[i].y-5);
		ctx.lineTo(bigRocks[i].x+15,bigRocks[i].y);
		ctx.lineTo(bigRocks[i].x+15,bigRocks[i].y+5);
		ctx.lineTo(bigRocks[i].x-15,bigRocks[i].y+5);
		ctx.fill();
		
		if(countDownNum == 'GO!') {
			bigRocks[i].x -= player.speedX;
		}
		
		if(bigRocks[i].x < -2000) {
			bigRocks[i].x = canvas.width+Math.random()*1000+10;
		}
	}
}

score = function() {

	if(player.lose == false) {
		player.score += player.speedX/1.4/FPS;
	}
	
	ctx.font = '120px Fredoka One';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	
	if(countDownNum != 'GO!') {
		player.score = 0;
	}
	ctx.fillText(Math.round(player.score),canvas.width/2,120);
	
	if(player.score > player.highScore) {
		localStorage.setItem('constructionRunHighScore',Math.round(player.score));
		player.highScore = Math.round(player.score);
	}
}

countDown = function() {
	if(countDownNum == 3) {
		startCountDown += 1/FPS;
		if(startCountDown >= 1) {
			showCountDown = true;
		}
	}
	
	if(showCountDown) {
		
		if(countDownNum == 0) {
			countDownNum = 'GO!';
		}
		
		ctx.textAlign = 'center';
		ctx.fillStyle = '#804e4e';
		ctx.font = '200px Impact';
		ctx.fillText(countDownNum,canvas.width/2,310);
		
		if(countDownNum > 0 || countDownNum == 'GO!') {
			countDownCount += 1/FPS;
			if(countDownCount >= 1) {
				if(countDownNum == 'GO!') {
					showCountDown = false;
				} else {
					countDownNum -= 1;
				}
				countDownCount = 0;
			}
		}
		
	}
}

audio = function() {
	if(player.lose == false) {
		if(player.y+player.sizeY >= ground.y) {
			if(player.speedX > 100/FPS) {
				onGroundSound.volume = 1;
				if(player.frameNum == 4 || player.frameNum == 5 || player.frameNum == 3) {
					onGroundSound.play();
				}
			} else {
				onGroundSound.pause();
			}
		} else {
			if(onGroundSound.volume > .1) {
				onGroundSound.volume -= 10/FPS;
			} else {
				onGroundSound.volume = 0;
				onGroundSound.currentTime = 0;
				onGroundSound.pause();
			}
		}
		
		if(showCountDown) {
			countDownSound.volume = .1;
			if(countDownSound.currentTime >= 3) {
				showCountDown == false;
			}
			countDownSound.play();
		}
		
		if(ramp.hit == true) {
			onRampSound.volume = .3;
			if(player.frameNum == 4 || player.frameNum == 5) {
				onRampSound.play();
			}
		} else {
			if(onRampSound.volume > .1) {
				onRampSound.volume -= 5/FPS;
			} else {
				onRampSound.volume = 0;
				onRampSound.currentTime = 0;
				onRampSound.pause();
			}
		}
		
		if(block.hit) {
			if(block.type == 'airTube' || block.type == 'tube') {
				onTubeSound.volume = 1;
				onTubeSound.play();
			}
		} else {
			if(onTubeSound.volume > .1) {
				onTubeSound.volume -= 5/FPS;
			} else {
				onTubeSound.volume = 0;
				onTubeSound.currentTime = 0;
				onTubeSound.pause();
			}
		}
	} else {
		onGroundSound.pause();
		onRampSound.pause();
		onTubeSound.pause();
	}
	
	if(windSound.currentTime >= 1.6) {
		windSound.currentTime = 0;
	}
	
	windSound.volume = (Math.abs(player.speedY/95))+.3;
	
	if(player.lose) {
		windSound.volume = .2;
	}
	windSound.play();
	
	if(block.type == 'dog') {
		dogBarkingSound.volume = .4-Math.abs((block.x-player.x)/5500);
		if(dogFrame == 1 || dogFrame == 2) {
			dogBarkingSound.play();
		}
	}
	
	if(player.lose) {
		if(player.loseWay == 'hitWall') {
			if(block.type == 'airTube' || block.type == 'tube') {
				if(player.frameNum <= 5) {
					hitTubeSound.play();
				}
			}
		}
		if(block.type == 'baracade' || block.type == 'cone') {
			if(player.frameNum <= 5) {
				loseOnBaracade.play();
			}
		}
		
		if(player.y+player.sizeY >= ground.y && player.frameNum >= 6) {
			if(Math.abs(player.speedX) <= 400/FPS) {
				loseSlideSound.volume = Math.abs(player.speedX/10);
			} else {
				loseSlideSound.volume = 1;
			}
			loseSlideSound.play();
		}
	}
}




