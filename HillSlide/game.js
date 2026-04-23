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
		canvasX += 10000*(canvas.width/canvas.height)/FPS;
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
	
	for(let i=0;i<btns.length;i++) {
		btns[i].style.width = canvasX/5+'px';
		btns[i].style.height = canvasX/10+'px';
		btns[i].style.marginLeft = -canvasX/10+'px';
		btns[i].style.marginTop = -canvasY/5+'px';
		btns[i].style.fontSize = canvasX/20+'px';
	}
	document.getElementById('notContinueBtn').style.marginTop = -canvasY/10+'px';
	document.getElementById('continueBtn').style.fontSize = canvasX/30+'px';
}

const btns = document.getElementsByClassName('btn');
const showCol = false;

let player = {
	x:canvas.width/2-65/3,
	y:400,
	sledX:undefined,
	sledY:0,
	width:65/1.5,
	height:92.5/1.5,
	angle:0,
	spin:false,
	spinV:0,
	left:false,
	right:false,
	up:false,
	down:false,
	move:false,
	flyUp:false,
	flyDown:false,
	streak:[],
	xv:0,
	yv:0,
	xMaxSpeed:250,
	yMaxSpeed:200,
	score:0,
	highScore:localStorage.getItem('HillSlideBest'),
	coins:localStorage.getItem('HillSlideCoins'),
	lose:false,
	start:false,
	askRestart:false,
	frame:0,
};

if(player.highScore == null) {
	player.highScore = 0;
	localStorage.setItem('HillSlideBest',player.highScore);
}

if(player.coins == null) {
	player.coins = 0;
	localStorage.setItem('HillSlideCoins',player.coins);
}
player.coins = parseInt(player.coins);

let coins = [];

const sled = document.getElementById('sled');
const tree = document.getElementById('tree');
const snowman = document.getElementById('snowman');
const ramp = document.getElementById('ramp');
let polarBear;
const playerImg = document.getElementById('player');

let obstacles = [];
let obstacleTypes = ['tree','tree','snowman','ramp'];

const lanes = 10;
const hitSlow = 1.02;

let gameSpeed = 0;
let wantedGS = 180;

let startTime;

startGame = function(timeStamp) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	startTime = startTime || timeStamp;
	FPS = 1000/(timeStamp-startTime);
	FPS--;
	FPS++;
	canvasSize();
	if(player.lose == false) {
		document.getElementById('notContinueBtn').style.display = 'none';
		document.getElementById('continueBtn').style.display = 'none';
	}
	if(player.start) {
		movePlayer();
		for(let i=0;i<player.streak.length;i++) {
			streaks(i);
		}
		if(player.lose == false) {
			obstacleCol();
		}
		moveObstacles();
		coin();
		if(player.lose == false) {
			if(gameSpeed < wantedGS) {
				gameSpeed += 60/FPS;
			}
			gameSpeed += 1.5/FPS;
			wantedGS += 1.5/FPS;
		} else {
			document.getElementById('notContinueBtn').style.display = 'block';
			document.getElementById('continueBtn').style.display = 'block';
			lose();
		}
	} else {
		ctx.fillText('Press To Start',canvas.width/2,300);
		document.getElementById('startBtn').style.display = 'block';
	}
	drawPlayer();
	startTime = timeStamp;
	requestAnimationFrame(startGame);
}

start = function() {
	player.start = true;
	player.score = 0;
	startBtn.style.display = 'none';
}

document.onkeydown = function(event) {
	if(event.keyCode == 123) {
      return false;
    } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
      return false;
    } else if (event.ctrlKey && event.keyCode == 85) {
      return false;
    }
	if(event.keyCode == 37) {
		player.left = true;
	}
	if(event.keyCode == 38) {
		player.up = true;
	}
	if(event.keyCode == 39) {
		player.right = true;
	}
	if(event.keyCode == 40) {
		player.down = true;
	}
}

document.onkeyup = function(event) {
	if(event.keyCode == 37) {
		player.left = false;
	}
	if(event.keyCode == 38) {
		player.up = false;
	}
	if(event.keyCode == 39) {
		player.right = false;
	}
	if(event.keyCode == 40) {
		player.down = false;
	}
}

movePlayer = function() {
	if(player.lose == false) {
		if(player.left) player.xv -= 1000/(player.spinV/100+1)/FPS;
		if(player.right) player.xv += 1000/(player.spinV/100+1)/FPS;
		if(player.up) player.yv -= 1000/(player.spinV/100+1)/FPS;
		if(player.down) player.yv += 1000/(player.spinV/100+1)/FPS;
		if(player.xv > player.xMaxSpeed) player.xv = player.xMaxSpeed;
		if(player.xv < -player.xMaxSpeed) player.xv = -player.xMaxSpeed;
		if(player.yv > player.yMaxSpeed) player.yv = player.yMaxSpeed;
		if(player.yv < -player.yMaxSpeed) player.yv = -player.yMaxSpeed;
	} else {
		player.left = false;
		player.right = false;
		player.down = false;
		player.up = false;
	}
	if(player.left == false && player.right == false) {
		if(player.xv > 0) player.xv -= 80/FPS;
		if(player.xv < 0) player.xv += 70/FPS;
		if(player.xv > -100/FPS && player.xv < 100/FPS) player.xv = 0;
	}
	if(player.up == false && player.down == false) {
		if(player.yv > 0) player.yv -= 80/FPS;
		if(player.yv < 0) player.yv += 80/FPS;
		if(player.yv > -100/FPS && player.yv < 100/FPS) player.yv = 0;
	}
	player.x += player.xv/FPS;
	player.y += player.yv/FPS;
	if(player.x+player.width > canvas.width) {
		gameSpeed /= hitSlow;
		player.x = canvas.width-player.width;
		player.xv = Math.min(-player.xv/1.6,-10);
	}
	if(player.x < 0) {
		gameSpeed /= hitSlow;
		player.x = 0;
		player.xv = Math.max(-player.xv/1.6,10);
	}
	if(player.y+player.height > canvas.height) {
		player.y = canvas.height-player.height;
		player.yv = 0;
	}
	if(player.y < 0) {
		player.y = 0;
		player.yv = 0;
	}
	if(player.spin == false) {
		player.spinV = 0;
		player.angle = player.xv/20;
	} else {
		if(gameSpeed > 150) gameSpeed -= 300/FPS;
		player.spinV -= 400/FPS;
		if(player.spinV < 0) {
			player.spin = false;
			player.width = 65/1.5;
			player.x += 10;
		}
	}
	if(player.flyUp) {
		if(player.spin) {
			player.spin = false;
			player.width = 65/1.5;
		}
		player.width += 65/1.5/(player.width/15)/FPS;
		player.height = player.width*1.423;
		player.x -= 65/1.5/(player.width/15)/FPS;
		player.y -= 92.5/1.5/(player.width/15)/FPS;
		if(player.width > 60) {
			player.flyUp = false;
			player.flyDown = true;
		}
	}
	if(player.flyDown) {
		player.width -= 65/1.5/2.5/FPS;
		player.height -= 92.5/1.5/2.5/FPS;
		player.x += 65/1.5/5/FPS;
		player.y += 92.5/1.5/5/FPS;
		if(player.width < 65/1.5) {
			player.flyDown = false;
			player.width = 65/1.5
			player.height = 92.5/1.5;
		}
	}
	player.angle -= player.spinV/FPS;
	player.score += gameSpeed/10/FPS;
	if(player.flyUp == false && player.flyDown == false) {
		player.streak.push({
			x:player.x+5,
			y:player.y+15,
			width:player.width,
		});
	}
}

streaks = function(i) {
	let thing = player.streak[i];
	thing.y += gameSpeed/FPS;
	ctx.fillStyle = 'rgb(240,240,240)';
	ctx.fillRect(thing.x,thing.y,thing.width/3,10+100/FPS);
	ctx.fillRect(thing.x+thing.width-thing.width/3-10,thing.y,thing.width/3,10+100/FPS);
	ctx.fillRect(thing.x,thing.y+player.height-30,thing.width/3,10+100/FPS);
	ctx.fillRect(thing.x+thing.width-thing.width/3-10,thing.y+player.height-30,thing.width/3,10+100/FPS);
	if(thing.y > canvas.height) {
		player.streak.splice(i,1);
		i--;
	}
}

drawPlayer = function() {
	if(showCol) {
		ctx.strokeStyle = 'lightgreen';
		ctx.strokeRect(player.x,player.y,player.width,player.height);
	}
	if(player.lose == false) {
		ctx.save();
		ctx.translate(player.x+player.width/2,player.y+player.height/2);
		ctx.rotate(player.angle*Math.PI/180);
		if(player.spin == false) {
			ctx.drawImage(sled,-player.width/2,-player.height/2,player.width,player.height);
			ctx.drawImage(playerImg,-player.width/1.5,-player.height/2.5,player.width/.75,player.height/1.1);
		} else {
			ctx.drawImage(sled,-player.width/2+10,-player.height/2,player.width-20,player.height);
			ctx.drawImage(playerImg,-player.width/2.2,-player.height/2.5,player.width/1.1,player.height/1.1);
		}
	}
	ctx.restore();
	ctx.fillStyle = 'black';
	ctx.font = '50px impact';
	ctx.textAlign = 'center';
	ctx.fillText(Math.round(player.score),canvas.width/2,70);
	if(player.score > player.highScore) {
		player.highScore = player.score;
		localStorage.setItem('HillSlideBest',player.highScore);
	}
	ctx.fillStyle = 'gold';
	ctx.strokeStyle = 'black';
	ctx.beginPath();
	ctx.arc(canvas.width-70,30,12,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = '#f5b433';
	ctx.beginPath();
	ctx.arc(canvas.width-70,30,12/1.5,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = 'black';
	ctx.font = '25px impact';
	ctx.fillText('Best: '+Math.round(player.highScore),canvas.width/2,100);
	ctx.fillText(player.coins,canvas.width-70,70);
}

let restartCost = 2000;

continueGame = function() {
	if(player.coins > restartCost) {
		if(gameSpeed == 0) {
			player.lose = false;
			player.sledX = undefined;
			player.x = canvas.width/2-65/3;
			player.y = 400;
			player.frame = 0;
			coins = [];
			obstacles = [];
			player.coins -= restartCost;
			restartCost *= 1.7;
			restartCost = Math.round(restartCost/1000)*1000;
		}
	}
}

notContinue = function() {
	player.start = false;
	player.lose = false;
	gameSpeed = 0;
	wantedGS = 180;
	player.sledX = undefined;
	player.x = canvas.width/2-65/3;
	player.y = 400;
	player.frame = 0;
	coins = [];
	obstacles = [];
	player.streak = [];
	obstacleTypes = ['tree','tree','snowman','ramp'];
	restartCost = 2000;
}

lose = function() {
	gameSpeed -= 60/FPS;
	if(gameSpeed < 0) {
		gameSpeed = 0;
	}
	if(player.spin) {
		player.spin = false;
		player.width = 65/1.5;
		player.x += 10;
	}
	if(player.frame < 6) {
		player.frame += 30/FPS;
	} else {
		player.frame = 6;
	}
	document.getElementById('continueBtn').innerHTML = 'CONTINUE'+"</br>"+restartCost;
	if(player.coins > restartCost) {
		document.getElementById('continueBtn').style.background = 'rgb(200,200,240)';
	} else {
		document.getElementById('continueBtn').style.background = 'grey';
	}
	player.sledY += gameSpeed/FPS;
	ctx.drawImage(sled,player.sledX,player.sledY,player.width,player.height);
	ctx.drawImage(document.getElementById('player'+Math.floor(player.frame)),player.x-player.width/6,player.y+player.height/10,player.width/.75,player.height*1.3);
}

obstacleCol = function() {
	if(obstacles.length < player.score/600+3) {
		obstacles.push({
			x:Math.floor(Math.random()*lanes)*canvas.width/lanes,
			y:-Math.random()*400-50,
			height:0,
			width:0,
			type:obstacleTypes[Math.floor(Math.random()*obstacleTypes.length)],
			frame:0,
		});
	}
	for(let I=0;I<obstacles.length;I++) {
		for(let i=I+1;i<obstacles.length;i++) {
			if(obstacles[i].x==obstacles[I].x && obstacles[i].y+obstacles[i].height > obstacles[I].y-obstacles[I].height && obstacles[I].y+obstacles[I].height > obstacles[i].y-obstacles[i].height) {
				obstacles.splice(I,1);
				i--;
			}
		}
	}
	if(player.flyUp == false && player.flyDown == false) {
	for(let i=0;i<obstacles.length;i++) {
		let thing = obstacles[i];
		if(thing.type == 'tree') {
			thing.height = 300/lanes;
			thing.width = canvas.width/lanes;
		} else if(thing.type == 'snowman') {
			thing.height = 300/lanes;
			thing.width = canvas.width/lanes;
		} else if(thing.type == 'ramp') {
			thing.height = 600/lanes;
			thing.width = canvas.width/lanes;
		} else if(thing.type == 'polarBear') {
			if(thing.x == (lanes-1)*canvas.width/lanes) {
				thing.x -= canvas.width/lanes;
			}
			thing.height = 400/lanes;
			thing.width = canvas.width/lanes*2-200/lanes;
		}
		if(thing.y-50 > canvas.height) {
			thing.x = Math.floor(Math.random()*lanes)*canvas.width/lanes;
			thing.y = -Math.random()*400-thing.height;
			thing.type = obstacleTypes[Math.floor(Math.random()*obstacleTypes.length)];
		}
		if(player.y+player.height > thing.y && player.y < thing.y+thing.height) {
			if(thing.type == 'tree' || thing.type == 'ramp' || thing.type == 'polarBear') {
				if(player.x+player.width > thing.x) {
					if(player.x+player.width < thing.x+10) {
						gameSpeed /= hitSlow;
						player.x = thing.x-player.width;
						player.xv = Math.min(-player.xv/2,player.xv/1.2,-10);
						if(thing.type == 'polarBear') {
							player.lose = true;
							player.sledX = player.sledX || player.x;
							player.sledY = thing.y+thing.height;
						}
					}
				}
				if(player.x < thing.x+thing.width) {
					if(player.x > thing.x+thing.width-10) {
						gameSpeed /= hitSlow;
						player.x = thing.x+thing.width;
						player.xv = Math.max(-player.xv/2,player.xv/1.2,10);
						if(thing.type == 'polarBear') {
							player.lose = true;
							player.sledX = player.sledX || player.x;
							player.sledY = thing.y+thing.height;
						}
					}
				}
				if(player.x+player.width > thing.x+15 && player.x < thing.x+thing.width-15) {
					if(thing.type == 'tree' || thing.type == 'polarBear') {
						player.lose = true;
						player.yv -= Math.min(150,player.yv+100);
						player.sledX = player.sledX || player.x;
						player.sledY = thing.y+thing.height;
					} else if(player.y < thing.y+thing.height-10) {
						player.flyUp = true;
					}
				}
			} else if(thing.type == 'snowman') {
				if(player.x+player.width > thing.x && player.x < thing.x+thing.width) {
					player.yv /= 2;
					player.yv += gameSpeed/10;
					player.spin = true;
					player.spinV = 933;
					player.angle = 360;
					if(player.width == 65/1.5) {
						player.x -= 10;
					}
					player.width = 65/1.5+20;
					thing.y = canvas.height+50;
				}
			}
		}
	}
	}
	if(player.score > 600 && obstacleTypes.length == 4) {
		obstacleTypes.push('polarBear');
		obstacleTypes.push('snowman');
		obstacleTypes.push('tree');
		obstacleTypes.push('ramp');
	}
}

moveObstacles = function() {
	for(let i=0;i<obstacles.length;i++) {
		let thing = obstacles[i];
		thing.y += gameSpeed/FPS;
		if(thing.y+thing.height > 0) {
			if(thing.type == 'polarBear') {
				if(thing.frame < 7) {
					thing.frame += 10/FPS;
				} else {
					thing.frame = 0;
				}
				polarBear = document.getElementById('polarBear'+Math.floor(thing.frame));
				if(thing.x+thing.width/2 > player.x+player.width/2) thing.x -= 30/FPS;
				else if(thing.x+thing.width/2 < player.x+player.width/2) thing.x += 30/FPS;
					if(thing.x+thing.width/2-2 > player.x+player.width/2) {
						ctx.drawImage(polarBear,thing.x-100/lanes,thing.y-150/lanes,thing.width,thing.height+150/lanes);
					}
					if(thing.x+thing.width/2-2 < player.x+player.width/2) {
						ctx.translate(thing.x+thing.width+100/lanes,thing.y-150/lanes);
						ctx.scale(-1,1);
						ctx.drawImage(polarBear,0,0,thing.width,thing.height+150/lanes);
						ctx.setTransform(1,0,0,1,0,0);
					}
				if(thing.y+thing.height/2 > player.y+player.height/2) thing.y -= 50/FPS;
				if(thing.y+thing.height/2 < player.y+player.height/2) thing.y += 50/FPS;
			}
			if(thing.type == 'tree') ctx.drawImage(tree,thing.x,thing.y-500/lanes,thing.width,thing.height+500/lanes);
			else if(thing.type == 'snowman') ctx.drawImage(snowman,thing.x,thing.y-500/lanes,thing.width,thing.height+500/lanes);
			else if(thing.type == 'ramp') ctx.drawImage(ramp,thing.x,thing.y,thing.width,thing.height);
			if(showCol) {
				ctx.strokeRect(thing.x,thing.y,thing.width,thing.height);
			}
		}
	}
}

coin = function() {
	if(coins.length < 2) {
		let randomLane = Math.floor(Math.random()*lanes)*canvas.width/lanes
		for(let i=0;i<Math.random()*10+5;i++) {
			coins.push({
				x:randomLane,
				y:-i*70-70,
				r:canvas.width/lanes/2,
				value:(i+1)*10,
			});
		}
	}
	for(let i=0;i<coins.length;i++) {
		let thing = coins[i];
		if(thing == undefined) {
			return;
		}
		if(thing.y+canvas.width/lanes/2 < 0) {
			for(let I=0;I<obstacles.length;I++) {
				if(thing.x==obstacles[I].x && thing.y+thing.r*2 > obstacles[I].y-50 && thing.y < obstacles[I].y+obstacles[I].height+20) {
					i = spliceCoins(i);
				}
			}
		}
		thing.y += gameSpeed/FPS;
		if(player.flyUp == false && player.flyDown == false) {
			if(player.x+player.width > thing.x && player.x < thing.x+thing.r*2 && player.y+player.height > thing.y && player.y < thing.y+thing.r*2) {
				player.coins += thing.value;
				i = spliceCoins(i);
			}
		}
		if(thing.y-thing.r*2 > canvas.height) {
			i = spliceCoins(i);
		}
		ctx.fillStyle = 'gold';
		ctx.strokeStyle = 'black';
		ctx.beginPath();
		ctx.arc(thing.x+thing.r,thing.y+thing.r,thing.r,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = '#f5b433';
		ctx.beginPath();
		ctx.arc(thing.x+thing.r,thing.y+thing.r,thing.r/1.5,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = 'black';
		ctx.fillText(thing.value,thing.x+thing.r,thing.y+thing.r+10);
		if(showCol) {
			ctx.strokeRect(thing.x,thing.y,thing.r*2,thing.r*2);
		}
	}
	if(player.coins != localStorage.getItem('HillSlideCoins')) {
		localStorage.setItem('HillSlideCoins',player.coins);
	}
}

spliceCoins = function(i) {
	coins.splice(i,1);
	i--;
	return i;
}

requestAnimationFrame(startGame);