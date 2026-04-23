let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
const FPS = 80;
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
	
	document.getElementById('startBtn').style.top = (window.innerHeight-canvasY)/2+canvasX/40+'px';
}

let startTime, passedTime;
let road = {
	x: 0,
	y: 550,
	width: canvas.width,
	height: canvas.height-500,
}

let player = {
	start:false,
	x:canvas.width/2-45,
	y:-200,
	sizeX:50,
	sizeY:150,
	left:false,
	right:false,
	moveCount:1000,
	jump: false,
	jumping: true,
	speedX:0,
	speedY:0,
	friction:undefined,
	allowShoot: true,
	bullets:[],
	ammo:15,
	img: document.getElementById('playerSprite'),
	stillShootImg: document.getElementById('playerStillShoot'),
	jumpingImg:document.getElementById('playerJumpingSprite'),
	facing: 'right',
	amountFrame: 8,
	imgWidth:440,
	imgHeight:101,
	frameCount:0,
	frameNum:0,
	health:100,
	lose: false,
	score:0,
}

let runSound = new Audio('sounds/runSound1.mp3');
let burstRifleSound = new Audio('sounds/burstRifle.mp3');
burstRifleSound.volume = .4;
let minigunSound = new Audio('sounds/minigun.mp3');
let shotgunSound = new Audio('sounds/shotgun.mp3');
let pistolSound = new Audio('sounds/pistol.mp3');
let rocketLaunchSound = new Audio('sounds/rocketLauncher.mp3');
let explosionSound = new Audio('sounds/explosion.mp3');
let smgSound = new Audio('sounds/smg.mp3');

let leftGun = {
	x:player.x-10,
}
let rightGun = {
	x:player.x+player.sizeX-10,
}

let gun = {
	type: 'pistol',
	src: document.getElementById('pistol'),
	y:undefined,
	x:undefined,
	bulletX:undefined,
	sizeX:undefined,
	sizeY:undefined,
	bulletWidth:undefined,
	bulletHeight:undefined,
	speed: undefined,
	loadSpeed:undefined,
	addY:undefined,
	accuracy:undefined,
	maxAmmo: undefined,
	preAmmo:undefined,
	count:0,
	neededCount:Math.random()*15+15,
	load: 0,
	letGo: true,
	random:undefined,
}

let missile = document.getElementById('missile');
let explosion = {
	img:document.getElementById('explosion'),
	spot:0,
	count:0,
	endCount:3,
}

let blood = [];

let crate = {
	src:document.getElementById('crateSprite'),
	x:0,
	y:-170-Math.random()*100,
	width:90,
	height:160,
	imgWidth:1554,
	imgHeight:196,
	frameNum: 0,
	frameCount: 0,
	amountFrame: 14,
	angle: 15,
	angleSpeed:0,
	box: {
		x:undefined,
		y:undefined,
		width:65,
		height:65,
	},
	drop:false,
	dropSpeed:undefined,
	explode:false,
	holding:undefined,
	contents: {
		src:document.getElementById('ammo'),
		x:0,
		y:0,
		width:0,
		height:0,
		speedY:0,
		timing: {
			ammo: Math.floor(Math.random()*5+3),
			heart: Math.random()*15+15,
			heartCount:0,
		},
	},
}

start = function() {
	player.start = true;
	document.getElementById('startBtn').style.opacity = '0';
	document.getElementById('startBtn').style.width = '0';
	document.getElementById('startBtn').style.fontSize = '0';
	document.getElementById('startBtn').style.padding = '0';
	document.getElementById('startBtn').style.marginLeft = '0';
	document.getElementById('startBtn').style.border = 'none';

	player.start = true;
	player.x = canvas.width/2-45;
	player.y = 200;
	player.bullets = [];
	player.ammo = 15;
	player.facing = 'right';
	player.amountFrame = 8;
	player.imgWidth = 440;
	player.imgHeight = 101;
	player.frameCount = 0;
	player.frameNum = 0;
	player.health = 100;
	player.lose = false;
	player.score = 0;
	
	gun.type = 'pistol';
	gun.src = document.getElementById('pistol');
	gun.count = 0;
	gun.neededCount = Math.random()*10+10;
	gun.load = 0;
	gun.letGo = true;
	blood = [];

	crate.y = -170-Math.random()*100;
	crate.frameNum = 0;
	crate.frameCount = 0;
	crate.angle = 15;
	crate.angleSpeed = 0;
	crate.drop = false;
	crate.explode = false;
	crate.contents.timing.ammo = Math.floor(Math.random()*5+3);
	crate.contents.timing.heart = Math.random()*15+15;
	crate.contents.timing.heartCount = 0;
	
	zombieList = {};
	makeZombie(document.getElementById('babyZombieSprite'),Math.random()*-1000-400,road.y-90,87.5,118.75,980,95,14,Math.floor(Math.random()*14),Math.random()*100,2.5,0,.35,5,5,.007,40,false,new Audio('sounds/normalZombie'+Math.floor(Math.random()*6)+'.mp3'),'babyZombie0');
	makeZombie(document.getElementById('normalZombieSprite'),Math.random()*-1000-2500,road.y-150,97.5,170.625,676,91,13,Math.floor(Math.random()*13),Math.random()*100,1.4,0,.17,7,7,.014,25,false,new Audio('sounds/normalZombie'+Math.floor(Math.random()*6)+'.mp3'),'normalZombie0');
	makeZombie(document.getElementById('normalZombieSprite'),Math.random()*1000+canvas.width+1000,road.y-150,97.5,170.625,676,91,13,Math.floor(Math.random()*13),Math.random()*100,1.6,0,.2,7,7,.014,25,false,new Audio('sounds/normalZombie'+Math.floor(Math.random()*6)+'.mp3'),'normalZombie1');
	makeZombie(document.getElementById('normalZombieSprite'),Math.random()*-1000-2500,road.y-150,97.5,170.625,676,91,13,Math.floor(Math.random()*13),Math.random()*100,1.4,0,.17,7,7,.014,25,false,new Audio('sounds/normalZombie'+Math.floor(Math.random()*6)+'.mp3'),'normalZombie2');
	makeZombie(document.getElementById('bigZombieSprite'),Math.random()*-1000-400,road.y-270,204,294,952,98,14,Math.floor(Math.random()*14),Math.random()*100,.7,0,.07,30,30,.035,120,false,new Audio('sounds/bigZombie.mp3'),'bigZombie0');
	makeZombie(document.getElementById('bigZombieSprite'),Math.random()*1000+canvas.width,road.y-270,204,294,952,98,14,Math.floor(Math.random()*14),Math.random()*100,.7,0,.07,30,30,.035,120,false,new Audio('sounds/bigZombie.mp3'),'bigZombie1');
	makeZombie(document.getElementById('bigZombieSprite'),Math.random()*1000+canvas.width,road.y-270,204,294,952,98,14,Math.floor(Math.random()*14),Math.random()*100,.7,0,.07,30,30,.035,120,false,new Audio('sounds/bigZombie.mp3'),'bigZombie2');
}

startGame = function(timestamp) {
	ctx.clearRect(-canvas.width*4,-300,canvas.width*8,canvas.height+300);
	canvasSize();
	startTime = startTime || timestamp;
	passedTime = timestamp - startTime;
	passedTime = Math.min(passedTime,1000);
	passedTime+=0.00001;
	ctx.fillStyle = 'rgba(80, 80, 80)';
	ctx.fillRect(road.x,road.y,road.width,road.height);
	if(player.start) {
		ctx.font = '25px Arial';
		ctx.fillStyle = 'black';
		ctx.fillText('FPS: '+Math.round(1000/passedTime),1100,30);
		movePlayer();
		guns();
		makeAmmo();
	}
		drawPlayer();
	if(player.start) {
		drawBlood();
		zombieCount = 0;
		for(let i in zombieList) {
			zombies(zombieList[i]);
			showExplosion(zombieList[i]);
		}
	}
		health();
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
	if(event.keyCode == 37 || event.keyCode == 65) {
		player.left = true;
	}
	if(event.keyCode == 38 || event.keyCode == 87) {
		player.jump = true;
	}
	if(event.keyCode == 39 || event.keyCode == 68) {
		player.right = true;
	}
	if(event.keyCode == 90 || event.keyCode == 75) {
		shootLeft();
		gun.letGo = false;
	}
	if(event.keyCode == 88 || event.keyCode == 76) {
		shootRight();
		gun.letGo = false;
	}
}

document.onkeyup = function(event) {
	if(event.keyCode == 37 || event.keyCode == 65) {
		player.left = false;
	}
	if(event.keyCode == 38 || event.keyCode == 87) {
		player.jump = false;
	}
	if(event.keyCode == 39 || event.keyCode == 68) {
		player.right = false;
	}
	if(event.keyCode == 90 || event.keyCode == 75) {
		gun.letGo = true;
	}	
	if(event.keyCode == 88 || event.keyCode == 76) {
		gun.letGo = true;
	}
}
let zombieCount = 0;
let zombieList = {};

function makeZombie(src,x,y,width,height,imgWidth,imgHeight,amountFrame,frameNum,frameCount,frameSpeed,speedX,maxSpeed,health,fullHealth,damage,value,show,sound,id) {
	let thing = {
		src:src,
		x:x,
		y:y,
		width:width,
		height:height,
		imgWidth:imgWidth,
		imgHeight:imgHeight,
		amountFrame:amountFrame,
		frameNum:frameNum,
		frameSpeed:frameSpeed,
		frameCount:frameCount,
		speedX:speedX,
		maxSpeed:maxSpeed,
		health:health,
		fullHealth:fullHealth,
		damage:damage,
		value:value,
		show:show,
		id:id,
		sound:sound,
	}
	zombieList[id] = thing;
}

movePlayer = function() {
	if(player.lose == false) {
		if(player.jumping == false) {
			player.friction = passedTime*.07;
		} else {
			player.friction = passedTime*.065;
		}
		player.speedX = player.speedX/player.friction;
		
		player.moveCount += passedTime*0.01;
		if(player.left && player.right == false) {
			if(gun.letGo && player.moveCount >= 3) {
				player.facing = 'left';
			}
			player.speedX -= .8;
		}
		if(player.right && player.left == false) {
			if(gun.letGo && player.moveCount >= 3) {
				player.facing = 'right';
			}
			player.speedX += .8;
		}
		if(player.speedX > .4) {
			player.speedX = .4;
		}
		if(player.speedX < -.4) {
			player.speedX = -.4;
		}
		if(player.jumping == false) {
			if(player.jump) {
				player.speedY = -.9;
				player.jumping = true;
				player.jump = false;
				
				player.amountFrame = 9;
				player.frameNum = 0;
				player.imgWidth = 495;
			}
		}
	}
		player.x += player.speedX*passedTime;
		player.y += player.speedY*passedTime;
		if(player.lose == false) {
		if(player.x < 0) {
			player.speedX = 0;
			player.x = 0;
		}
		if(player.x > canvas.width-player.sizeX) {
			player.speedX = 0;
			player.x = canvas.width-player.sizeX;
		}
		if(player.y < road.y-120) {
			if(player.speedY < 10) {
				player.speedY += passedTime*1/500;
			}
		} else {
			player.speedY = 0;
			player.y = road.y-120;
			player.jumping = false;
		}
		if(player.jumping == false) {
			player.amountFrame = 8;
			player.imgWidth = 440;
			if(player.frameNum >= player.amountFrame) {
				player.frameNum = 0;
			}
		}
		if(player.jumping) {
			player.frameCount += passedTime*2;
		} else if(player.right || player.left) {
			player.frameCount += passedTime;
		}
		if(player.frameCount >= 60) {		
			if(player.jumping == false) {
				if(player.facing == 'left' && player.right == true || player.facing == 'right' && player.left == true) {
					player.frameNum--;
				} else {
					player.frameNum++;
				}
				if(player.right || player.left) {
					if(player.frameNum >= player.amountFrame) {
						player.frameNum = 0;
					}
					if(player.frameNum < 0) {
						player.frameNum = player.amountFrame-1;
					}
				}
			} else if(player.jumping) {
				player.frameNum++;
				if(player.frameNum >= player.amountFrame-1) {
					player.frameNum = player.amountFrame-1;
				}
			}
			player.frameCount = 0;
			if(player.frameNum == 1 || player.frameNum == 5) {
				if(player.jumping == false) {
					if(player.right == true && player.left == false || player.left == true && player.right == false) {
						runSound = new Audio('sounds/runSound'+Math.floor(Math.random()*4)+'.mp3');
						runSound.volume = .1;
						runSound.play();
					}
				}
			}
		}
	}
}

drawPlayer = function() {
	ctx.save();
	ctx.translate(player.x+player.sizeX/2,player.y+player.sizeY/2);
	if(player.jumping == false) {
		if(player.lose == false && (player.left == false && player.right == true || player.right == false && player.left == true)) {
			if(player.facing == 'right') {
			ctx.drawImage(player.img,player.frameNum*(player.imgWidth/player.amountFrame),0,player.imgWidth/player.amountFrame,player.imgHeight,-player.sizeX/2-25,-player.sizeY/2,player.sizeX+30,player.sizeY);
			} else if(player.facing == 'left') {
				 ctx.translate(player.imgWidth/player.amountFrame,0);
				 ctx.scale(-1,1);
				 ctx.drawImage(player.img,player.frameNum*(player.imgWidth/player.amountFrame),0,player.imgWidth/player.amountFrame,player.imgHeight,5,-player.sizeY/2,player.sizeX+30,player.sizeY);
				 ctx.setTransform(1,0,0,1,0,0);
			}			
		} else if(player.facing == 'right') {
			ctx.drawImage(player.stillShootImg,-player.sizeX/2-20,-player.sizeY/2,player.sizeX+30,player.sizeY);
		} else if(player.facing == 'left') {
			ctx.translate(0,0);
			ctx.scale(-1,1);
			ctx.drawImage(player.stillShootImg,-player.sizeX/2-20,-player.sizeY/2,player.sizeX+30,player.sizeY);
			ctx.setTransform(1,0,0,1,0,0);
		}
	}
	if(player.jumping) {
		if(player.facing == 'right') {
			ctx.drawImage(player.jumpingImg,player.frameNum*(player.imgWidth/player.amountFrame),0,player.imgWidth/player.amountFrame,player.imgHeight,-player.sizeX/2-15,-player.sizeY/2,player.sizeX+30,player.sizeY);
		} else if(player.facing == 'left') {
			ctx.translate(0,0);
			ctx.scale(-1,1);
			ctx.drawImage(player.jumpingImg,player.frameNum*(player.imgWidth/player.amountFrame),0,player.imgWidth/player.amountFrame,player.imgHeight,-player.sizeX/2-15,-player.sizeY/2,player.sizeX+30,player.sizeY);
			ctx.setTransform(1,0,0,1,0,0);
		}
	}
	ctx.restore();	
}

shootLeft = function() {
	if(player.allowShoot && player.lose == false) {
		if(gun.type == 'minigun') {
			minigunSound.currentTime = 0;
			minigunSound.play();
		} else if(gun.type == 'pistol') {
			pistolSound.play();
		} else if(gun.type == 'rocketLauncher') {
			rocketLaunchSound.currentTime = 0;
			rocketLaunchSound.play();
		} else if(gun.type == 'smg') {
			smgSound.currentTime = 0;
			smgSound.play();
		}
		player.ammo--;
		player.moveCount = 0;
		player.facing = 'left';
		player.bullets.push({
			x:player.x-gun.bulletX,
			y:gun.y+gun.addY,
			xv:-gun.speed,
			yv:gun.accuracy,
		});
		if(gun.type == 'shotgun') {
			shotgunSound.currentTime = 0;
			shotgunSound.play();
			player.bullets.push({
				x:player.x-gun.bulletX,
				y:gun.y+gun.addY,
				xv:-gun.speed+Math.random()*.2-.1,
				yv:.1+gun.accuracy,
			});
			player.bullets.push({
				x:player.x-gun.bulletX,
				y:gun.y+gun.addY,
				xv:-gun.speed+Math.random()*.2-.1,
				yv:-.1+gun.accuracy,
			});
			player.bullets.push({
				x:player.x-gun.bulletX,
				y:gun.y+gun.addY,
				xv:-gun.speed+Math.random()*.2-.1,
				yv:-.2+gun.accuracy,
			});
			player.bullets.push({
				x:player.x-gun.bulletX,
				y:gun.y+gun.addY,
				xv:-gun.speed+Math.random()*.2-.1,
				yv:.2+gun.accuracy,
			});
		}
		if(gun.type == 'burstRifle') {
			burstRifleSound.play();
			player.bullets.push({
				x:player.x-gun.bulletX+20,
				y:gun.y+gun.addY,
				xv:-gun.speed,
				yv:gun.accuracy+Math.random()*.05-.025,
			});
			player.bullets.push({
				x:player.x-gun.bulletX+40,
				y:gun.y+gun.addY,
				xv:-gun.speed,
				yv:gun.accuracy*-gun.accuracy+Math.random()*.05-.025,
			});
		}
		player.allowShoot = false;
	}
}

shootRight = function() {
	if(player.allowShoot && player.lose == false) {
		if(gun.type == 'minigun') {
			minigunSound.currentTime = 0;
			minigunSound.play();
		} else if(gun.type == 'pistol') {
			pistolSound.play();
		} else if(gun.type == 'rocketLauncher') {
			rocketLaunchSound.currentTime = 0;
			rocketLaunchSound.play();
		} else if(gun.type == 'smg') {
			smgSound.currentTime = 0;
			smgSound.play();
		}
		player.ammo--;
		player.moveCount = 0;
		player.facing = 'right';
		player.bullets.push({
			x:player.x+player.sizeX+gun.bulletX,
			y:gun.y+gun.addY,
			xv:gun.speed,
			yv:gun.accuracy,
		});
		if(gun.type == 'shotgun') {
			shotgunSound.currentTime = 0;
			shotgunSound.play();
			player.bullets.push({
				x:player.x+player.sizeX+gun.bulletX,
				y:gun.y+gun.addY,
				xv:gun.speed+Math.random()*.2-.1,
				yv:.1+gun.accuracy,
			});
			player.bullets.push({
				x:player.x+player.sizeX+gun.bulletX,
				y:gun.y+gun.addY,
				xv:gun.speed+Math.random()*.2-.1,
				yv:-.1+gun.accuracy,
			});
			player.bullets.push({
				x:player.x+player.sizeX+gun.bulletX,
				y:gun.y+gun.addY,
				xv:gun.speed+Math.random()*.2-.1,
				yv:-.2+gun.accuracy,
			});
			player.bullets.push({
				x:player.x+player.sizeX+gun.bulletX,
				y:gun.y+gun.addY,
				xv:gun.speed+Math.random()*.2-.1,
				yv:.2+gun.accuracy,
			});
		}
		if(gun.type == 'burstRifle') {
			burstRifleSound.play();
			player.bullets.push({
				x:player.x+player.sizeX+gun.bulletX-20,
				y:gun.y+gun.addY,
				xv:gun.speed,
				yv:gun.accuracy+Math.random()*.05-.025,
			});
			player.bullets.push({
				x:player.x+player.sizeX+gun.bulletX-40,
				y:gun.y+gun.addY,
				xv:gun.speed,
				yv:gun.accuracy+Math.random()*.05-.025,
			});
		}
		player.allowShoot = false;
	}
}

guns = function() {
	if(player.ammo == 0 && gun.type != 'pistol' && player.bullets.length == 0) {
		gun.type = 'pistol';
		player.ammo = gun.preAmmo;
	}
	if(player.lose == false) {
		if(gun.type == 'pistol') {
			gun.src = document.getElementById('pistol');
			gun.sizeX = 40;
			gun.sizeY = 25;
			gun.bulletX = 10;
			gun.bulletWidth = 6;
			gun.bulletHeight = 6;
			gun.speed = 1.1;
			gun.loadSpeed = 150;
			gun.addY = 2;
			gun.accuracy = Math.random()*.1-.05;
			gun.maxAmmo = 15;
			gun.damage = 1.5;
			if(player.left == true && player.right == false || player.right == true && player.left == false) {
				gun.y = player.y+45+Math.random()*3;
			} else {
				gun.y = player.y+45;
			}
		} else if(gun.type == 'minigun') {
			gun.src = document.getElementById('minigun');
			gun.sizeX = 111.75;
			gun.sizeY = 33.75;
			gun.bulletX = 65;
			gun.bulletWidth = 8;
			gun.bulletHeight = 8;
			gun.speed = 1;
			gun.loadSpeed = 15;
			gun.addY = Math.random()*10+10;
			gun.accuracy = Math.random()*.25-.15;
			gun.damage = .9;
			if(player.left == true && player.right == false || player.right == true && player.left == false) {
				gun.y = player.y+60+Math.random()*3;
			} else {
				gun.y = player.y+60;
			}
		} else if(gun.type == 'shotgun') {
			gun.src = document.getElementById('shotgun');
			gun.sizeX = 105.5;
			gun.sizeY = 26.2;
			gun.bulletX = 60;
			gun.bulletWidth = 10;
			gun.bulletHeight = 10;
			gun.speed = .9;
			gun.loadSpeed = 260;
			gun.addY = 0;
			gun.accuracy = Math.random()*.06-.03;
			gun.damage = 1.2;
			if(player.left == true && player.right == false || player.right == true && player.left == false) {
				gun.y = player.y+60+Math.random()*3;
			} else {
				gun.y = player.y+60;
			}
		} else if(gun.type == 'rocketLauncher') {
			gun.src = document.getElementById('rocketLauncher');
			gun.sizeX = 105;
			gun.sizeY = 45.7;
			gun.bulletX = 60;
			gun.bulletWidth = 96.4;
			gun.bulletHeight = 21.4;
			gun.speed = .7;
			gun.loadSpeed = 300;
			gun.addY = -10;
			gun.accuracy = Math.random()*.1-.05;
			gun.damage = 7.5;
			if(player.left == true && player.right == false || player.right == true && player.left == false) {
				gun.y = player.y+30+Math.random()*3;
			} else {
				gun.y = player.y+30;
			}
		} else if(gun.type == 'burstRifle') {
			gun.src = document.getElementById('burstRifle');
			gun.sizeX = 82.6;
			gun.sizeY = 24.3;
			gun.bulletX = 40;
			gun.bulletWidth = 5;
			gun.bulletHeight = 5;
			gun.speed = .7;
			gun.loadSpeed = 120;
			gun.addY = 6;
			gun.accuracy = Math.random()*.02-.01;
			gun.damage = 1;
			if(player.left == true && player.right == false || player.right == true && player.left == false) {
				gun.y = player.y+50+Math.random()*3;
			} else {
				gun.y = player.y+50;
			}
		} else if(gun.type == 'smg') {
			gun.src = document.getElementById('smg');
			gun.sizeX = 75;
			gun.sizeY = 35;
			gun.bulletX = 30;
			gun.bulletWidth = 5;
			gun.bulletHeight = 5;
			gun.speed = 1;
			gun.loadSpeed = 35;
			gun.addY = 10;
			gun.accuracy = Math.random()*.01-.005;
			gun.damage = 1.3;
			if(player.left == true && player.right == false || player.right == true && player.left == false) {
				gun.y = player.y+50+Math.random()*3;
			} else {
				gun.y = player.y+50;
			}
		}
		if(player.allowShoot == false) {
			gun.load += passedTime*1/5;
		}
		if(gun.load >= gun.loadSpeed && gun.letGo && player.ammo > 0) {
			player.allowShoot = true;
			gun.load = 0;
		}
		for(let i=0;i<player.bullets.length;i++) {
			player.bullets[i].x += player.bullets[i].xv*passedTime;
			player.bullets[i].y += player.bullets[i].yv*passedTime;
			ctx.fillStyle = 'black';
			if(gun.type != 'rocketLauncher') {
				ctx.beginPath();
				ctx.arc(player.bullets[i].x,player.bullets[i].y,gun.bulletWidth/2,0,2*Math.PI);
				ctx.fill();
			} else {
				if(player.bullets[i].xv > 0) {
					ctx.drawImage(missile,0,0,135,30,player.bullets[i].x-gun.bulletWidth/2,player.bullets[i].y+gun.bulletHeight/2,96.4,21.4);
					ctx.fillRect(player.bullets[i].x,player.bullets[i].y,1,1);
				} else if(player.bullets[i].xv < 0) {
					ctx.drawImage(missile,135,0,135,30,player.bullets[i].x-gun.bulletWidth/2,player.bullets[i].y+gun.bulletHeight/2,96.4,21.4);
					ctx.fillRect(player.bullets[i].x,player.bullets[i].y,1,1);
				}
			}
			if(player.bullets[i].x < -gun.bulletWidth || player.bullets[i].x > canvas.width) {
				player.bullets.splice(i,1);
			}
		}
		if(gun.type == 'pistol') {
			if(player.facing == 'right') {
				ctx.drawImage(gun.src,player.x+player.sizeX/1.3,gun.y,gun.sizeX,gun.sizeY);
			} else if(player.facing == 'left') {
				ctx.translate(player.x+gun.sizeX,gun.y);
				ctx.scale(-1,1);
				ctx.drawImage(gun.src,player.sizeX/1.8,0,gun.sizeX,gun.sizeY);
				ctx.setTransform(1,0,0,1,0,0);
			}
		} else if(gun.type == 'minigun') {
			if(player.facing == 'right') {
				ctx.drawImage(gun.src,player.x+player.sizeX/2.5,gun.y,gun.sizeX,gun.sizeY);
			} else if(player.facing == 'left') {
				ctx.translate(player.x,gun.y);
				ctx.scale(-1,1);
				ctx.drawImage(gun.src,-player.sizeX/1.5,0,gun.sizeX,gun.sizeY);
				ctx.setTransform(1,0,0,1,0,0);
			}
		} else if(gun.type == 'shotgun') {
			if(player.facing == 'right') {
				ctx.drawImage(gun.src,player.x+player.sizeX/2.5,gun.y,gun.sizeX,gun.sizeY);
			} else if(player.facing == 'left') {
				ctx.translate(player.x,gun.y);
				ctx.scale(-1,1);
				ctx.drawImage(gun.src,-player.sizeX/1.5,0,gun.sizeX,gun.sizeY);
				ctx.setTransform(1,0,0,1,0,0);
			}
		} else if(gun.type == 'rocketLauncher') {
			if(player.facing == 'right') {
				ctx.drawImage(gun.src,player.x+player.sizeX/5,gun.y,gun.sizeX,gun.sizeY);
			} else if(player.facing == 'left') {
				ctx.translate(player.x,gun.y);
				ctx.scale(-1,1);
				ctx.drawImage(gun.src,-player.sizeX/1.2,0,gun.sizeX,gun.sizeY);
				ctx.setTransform(1,0,0,1,0,0);
			}
		} else if(gun.type == 'burstRifle') {
			if(player.facing == 'right') {
				ctx.drawImage(gun.src,player.x+player.sizeX/3,gun.y,gun.sizeX,gun.sizeY);
			} else if(player.facing == 'left') {
				ctx.translate(player.x,gun.y);
				ctx.scale(-1,1);
				ctx.drawImage(gun.src,-player.sizeX/1.5,0,gun.sizeX,gun.sizeY);
				ctx.setTransform(1,0,0,1,0,0);
			}
		} else if(gun.type == 'smg') {
			if(player.facing == 'right') {
				ctx.drawImage(gun.src,player.x+player.sizeX/2.7,gun.y,gun.sizeX,gun.sizeY);
			} else if(player.facing == 'left') {
				ctx.translate(player.x,gun.y);
				ctx.scale(-1,1);
				ctx.drawImage(gun.src,-player.sizeX/1.8,0,gun.sizeX,gun.sizeY);
				ctx.setTransform(1,0,0,1,0,0);
			}
		}
	}
}

makeAmmo = function() {
	crate.contents.timing.heartCount += 1/(1000/passedTime);
	if(player.score >= 0 && gun.type == 'pistol') {
		gun.count += .003*passedTime;
	}
	if(crate.drop == false) {
		if(player.ammo <= crate.contents.timing.ammo && gun.type == 'pistol') {
			crate.drop = true;
			crate.x = Math.random()*(canvas.width-crate.width);
			crate.holding = 'ammo';
			crate.contents.src = document.getElementById('ammo');
			crate.contents.timing.ammo = Math.floor(Math.random()*3+4);
		} else if(crate.contents.timing.heartCount >= crate.contents.timing.heart && player.health <= 75) {
			crate.drop = true;
			crate.x = Math.random()*(canvas.width-crate.width);
			crate.holding = 'heart';
			crate.contents.src = document.getElementById('heart');
			crate.contents.timing.heart = Math.random()*15+15;
			crate.contents.timing.heartCount = 0;
		} else if(gun.type == 'pistol' && gun.count >= gun.neededCount) {
			crate.drop = true;
			crate.x = Math.random()*(canvas.width-crate.width);
			gun.random = Math.floor(Math.random()*5);
			if(gun.random == 0) {
				crate.holding = 'minigun';
				crate.contents.src = document.getElementById('minigun');
			} else if(gun.random == 1) {
				crate.holding = 'shotgun';
				crate.contents.src = document.getElementById('shotgun');
			} else if(gun.random == 2) {
				crate.holding = 'rocketLauncher';
				crate.contents.src = document.getElementById('rocketLauncher');
			} else if(gun.random == 3) {
				crate.holding = 'burstRifle';
				crate.contents.src = document.getElementById('burstRifle');
			} else if(gun.random == 4) {
				crate.holding = 'smg';
				crate.contents.src = document.getElementById('smg');
			}
			gun.count = 0;
			gun.neededCount = Math.random()*10+10;
		}
	}
	crate.box.x = crate.x+12.5;
	crate.box.y = crate.y+95;
	crate.dropSpeed = passedTime*(Math.random()*.05+.08);
	if(crate.drop && crate.explode == false) {
		if(crate.y < road.y-140) {
			crate.y += crate.dropSpeed;
		} else {
			crate.y = road.y-140;
			if(crate.angle > 2) {
				crate.angle -= 1;
			} else if(crate.angle < -2) {
				crate.angle += 1;
			} else {
				crate.angle = 0;
			}
			
			if(crate.frameNum < crate.amountFrame-1) {
				crate.frameCount += passedTime*2.5;
				if(crate.frameCount >= 100) {
					crate.frameNum ++;
					crate.frameCount = 0;
				}
			}
		}
		if(crate.angle > 0) {
			crate.angleSpeed -= passedTime*.003;
		}
		if(crate.angle < 0) {
			crate.angleSpeed += passedTime*.003;
		}	
		crate.angle += crate.angleSpeed;
	}
	if(crate.holding == 'ammo') {
		crate.contents.width = 29;
		crate.contents.height = 40;
	} else if(crate.holding == 'heart') {
		crate.contents.width = 27.8;
		crate.contents.height = 29.4;
	} else if(crate.holding == 'minigun') {
		crate.contents.width = 59.6;
		crate.contents.height = 18;
	} else if(crate.holding == 'shotgun') {
		crate.contents.width = 73.7;
		crate.contents.height = 17.7;
	} else if(crate.holding == 'rocketLauncher') {
		crate.contents.width = 73.5;
		crate.contents.height = 32;
	} else if(crate.holding == 'burstRifle') {
		crate.contents.width = 70.8;
		crate.contents.height = 20.8;
	} else if(crate.holding == 'smg') {
		crate.contents.width = 75;
		crate.contents.height = 35;
	}
	for(let i=0;i<player.bullets.length;i++) {
		if(player.bullets[i].x+gun.bulletWidth/2 >= crate.box.x && player.bullets[i].x-gun.bulletWidth/2 <= crate.box.x+crate.box.width) {
			if(player.bullets[i].y >= crate.box.y && player.bullets[i].y <= crate.box.y+crate.box.height) {
				player.bullets.splice(i,1);
				crate.explode = true;
				crate.contents.speedY = -.2;
				crate.contents.x = crate.x+crate.width/2-crate.contents.width/2;
				crate.contents.y = crate.y+crate.height-crate.box.height/2-crate.contents.height/2;
				crate.y = -170-Math.random()*100;
			}
		}
	}
		if(player.x+player.sizeX >= crate.box.x && player.x <= crate.box.x+crate.box.width) {
			if(player.y+player.sizeY >= crate.box.y && player.y <= crate.box.y+crate.box.height) {
				crate.explode = true;
				crate.contents.speedY = -.2;
				crate.contents.x = crate.x+crate.width/2-crate.contents.width/2;
				crate.contents.y = crate.y+crate.height-crate.box.height/2-crate.contents.height/2;
				crate.y = -170-Math.random()*100;
			}
		}
		
	if(crate.explode) {
		crate.contents.y += crate.contents.speedY*passedTime; 
		crate.contents.speedY += passedTime*.0005;
		if(crate.contents.y > road.y-30) {
			crate.contents.y = road.y-30;
			crate.contents.speedY = 0;
		}
		if(player.x+player.sizeX >= crate.contents.x && player.x <= crate.contents.x+crate.contents.width) {
			if(player.y+player.sizeY >= crate.contents.y && player.y <= crate.contents.y+crate.contents.height) {
				if(crate.holding == 'ammo') {
					player.ammo += Math.floor(Math.random()*5+8);
					if(player.ammo > gun.maxAmmo) {
						player.ammo = gun.maxAmmo
					}
				} else if (crate.holding == 'heart') {
					player.health += Math.random()*20+30;
				} else if (crate.holding != 'ammo' && crate.holding != 'heart') {
					gun.type = crate.holding;
					gun.preAmmo = player.ammo;
					if(gun.type == 'minigun') {
						player.ammo = 40;
					} else if(gun.type == 'shotgun') {
						player.ammo = 10;
					} else if(gun.type == 'rocketLauncher') {
						player.ammo = 8;
					} else if(gun.type == 'burstRifle') {
						player.ammo = 15;
					} else if(gun.type == 'smg') {
						player.ammo = 30;
					}
				}
				crate.angle = 15;
				crate.angleSpeed = 0;
				crate.frameNum = 0;
				crate.frameCount = 0;
				crate.explode = false;
				crate.drop = false;
			}
		}
			ctx.drawImage(crate.contents.src,crate.contents.x,crate.contents.y,crate.contents.width,crate.contents.height);
	}
	ctx.save();
	ctx.translate(crate.x+crate.width/2,crate.y+30);
	ctx.rotate(crate.angle*Math.PI/180);
	ctx.drawImage(crate.src,crate.frameNum*(crate.imgWidth/crate.amountFrame),0,crate.imgWidth/crate.amountFrame,crate.imgHeight,-crate.width/2,-30,crate.width,crate.height);
	ctx.drawImage(crate.contents.src,-crate.contents.width/1.2/2,crate.height-30-crate.box.height/2-crate.contents.height/2,crate.contents.width/1.2,crate.contents.height/1.2);
	ctx.restore();
	ctx.fillStyle = 'black';
	ctx.font = '40px Impact';
	ctx.fillText('AMMO:  ',150,50);
	ctx.fillText(player.ammo,230,50);
}

showExplosion = function(zombie) {
	if(explosion.spot != 0) {
		explosion.count += passedTime*.001;
		if(explosion.count < explosion.endCount) {
			ctx.drawImage(explosion.img,explosion.spot[0],explosion.spot[1],250,250);
			if(zombie.x+zombie.width > explosion.spot[0] && zombie.x < explosion.spot[0]+250) {
				zombie.health -= passedTime*.007;
			}
		} else {
			explosion.count = 0;
			explosion.spot = 0;
		}
	}
}

zombies = function(zombie) {
	if(player.lose == false) {
		for(let i=0;i<player.bullets.length;i++) {
			if(player.bullets[i].x+gun.bulletWidth/2 >= zombie.x+zombie.width/4-passedTime*2 && player.bullets[i].x-gun.bulletWidth/2 <= zombie.x+zombie.width-zombie.width/4+passedTime*2) {
				if(player.bullets[i].y+gun.bulletHeight/2 >= zombie.y && player.bullets[i].y <= zombie.y+zombie.height) {
					zombie.health -= gun.damage;
					if(gun.type == 'rocketLauncher') {
						explosion.spot = [zombie.x+zombie.width/2-125,player.bullets[i].y-125];
						explosionSound.play();
					} else {
						makeBlood(player.bullets[i].x,player.bullets[i].y,player.bullets[i].xv/(Math.random()*4+2),-Math.random()*.03);
						makeBlood(player.bullets[i].x,player.bullets[i].y,player.bullets[i].xv/(Math.random()*4+2),-Math.random()*.03);
						makeBlood(player.bullets[i].x,player.bullets[i].y,player.bullets[i].xv/(Math.random()*4+2),-Math.random()*.03);
						if(zombie.health <= 0) {
							makeBlood(zombie.x+zombie.width/2,zombie.y,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
							makeBlood(zombie.x+zombie.width/1.5,zombie.y+zombie.height/3,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
							makeBlood(zombie.x+zombie.width/1.75,zombie.y+zombie.height/2,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
							makeBlood(zombie.x+zombie.width/1.5,zombie.y,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
							makeBlood(zombie.x+zombie.width/2,zombie.y,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
							makeBlood(zombie.x+zombie.width/3,zombie.y+zombie.height/3,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
							makeBlood(zombie.x+zombie.width/3.5,zombie.y+zombie.height/2,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
							makeBlood(zombie.x+zombie.width/3,zombie.y,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
							if(zombie.height > 140) {
								makeBlood(zombie.x+zombie.width/2,zombie.y,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
								makeBlood(zombie.x+zombie.width/1.5,zombie.y+zombie.height/3,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
								makeBlood(zombie.x+zombie.width/1.75,zombie.y+zombie.height/2,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
								makeBlood(zombie.x+zombie.width/1.5,zombie.y,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
								makeBlood(zombie.x+zombie.width/2,zombie.y,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
								makeBlood(zombie.x+zombie.width/3,zombie.y+zombie.height/3,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
								makeBlood(zombie.x+zombie.width/3.5,zombie.y+zombie.height/2,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
								makeBlood(zombie.x+zombie.width/3,zombie.y,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
							}
							if(zombie.height > 200) {
								makeBlood(zombie.x+zombie.width/2,zombie.y,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
								makeBlood(zombie.x+zombie.width/1.5,zombie.y+zombie.height/3,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
								makeBlood(zombie.x+zombie.width/1.75,zombie.y+zombie.height/2,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
								makeBlood(zombie.x+zombie.width/1.5,zombie.y,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
								makeBlood(zombie.x+zombie.width/2,zombie.y,player.bullets[i].xv/(Math.random()*4+7),0.1);
								makeBlood(zombie.x+zombie.width/3,zombie.y+zombie.height/3,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
								makeBlood(zombie.x+zombie.width/3.5,zombie.y+zombie.height/2,player.bullets[i].xv/(Math.random()*4+7),0);
								makeBlood(zombie.x+zombie.width/3,zombie.y,player.bullets[i].xv/(Math.random()*4+7),-Math.random()*.05+.03);
							}
						}
					}
					zombie.speedX = -zombie.speedX;
					/*if(zombie.speedX > 0) {
						zombie.speedX -= .2;
					} else if(zombie.speedX < 0) {
						zombie.speedX += .2;
					}*/
					player.bullets.splice(i,1);
				}
			}
		}
		if(zombie.health <= 0) {
			player.score += zombie.value;
			zombie.x = Math.random();
			if(zombie.x < .5) {
				zombie.x = Math.random()*(-player.score/3)-player.score-200;
			} else {
				zombie.x = Math.random()*player.score/3+canvas.width+player.score+200;
			}
			zombie.speedX = 0;
			zombie.frameNum = 0;
			zombie.frameCount = 0;
			zombie.health = zombie.fullHealth;
			zombie.show = false;
		}
		if(zombie.x+zombie.width-zombie.width/8 > player.x+30 && zombie.x+zombie.width/8 < player.x+player.sizeX-30) {
			if(player.y+player.sizeY > zombie.y) {
				zombie.speedX = zombie.speedX/1.6;
			}
			if(player.y+player.sizeY > zombie.y+zombie.height/3) {
				player.health -= zombie.damage*passedTime;
			}
		} else if(zombie.x < player.x-((zombie.width-player.sizeX)/2)) {
			zombie.speedX += passedTime*.00056;
			if(zombie.speedX >= zombie.maxSpeed) {
				zombie.speedX = zombie.maxSpeed;
			}
		} else if(zombie.x+zombie.width > player.x+player.sizeX+((zombie.width-player.sizeX)/2)) {
			zombie.speedX -= passedTime*.00056;
			if(zombie.speedX <= -zombie.maxSpeed) {
				zombie.speedX = -zombie.maxSpeed;
			}
		}
		if(zombie.id == 'bigZombie0' && player.score < 800 || zombie.id == 'bigZombie1' && player.score < 1500 || zombie.id == 'bigZombie2' && player.score < 2500 || zombie.id == 'babyZombie0' && player.score < 250) {
			zombie.speedX = 0;
		}
		zombie.x += zombie.speedX*passedTime;	
	}
	if(zombie.x+zombie.width > 0 && zombie.x < canvas.width) {
		zombie.show = true;
		zombie.sound.volume = .6;
		zombie.sound.play();
	} else if(zombie.sound.volume >= .01) {
		zombie.sound.volume -= .01;
	}
	if(zombie.show) {
		zombieCount++;
	}
	if(zombieCount >= Object.keys(zombieList).length-3 && zombieCount < player.score/170 && player.start) {
		if(player.score <= 800) {
			makeZombie(document.getElementById('normalZombieSprite'),Math.random()*-1000-2500,road.y-150,Math.random()*15+90,Math.random()*15+163,676,91,13,Math.floor(Math.random()*13),Math.random()*100,1.4,0,Math.random()*.1+.1,7,7,.014,25,false,new Audio('sounds/normalZombie'+Math.floor(Math.random()*6)+'.mp3'),'normalZombie'+zombieCount);
		} else if(player.score <= 1200) {
			makeZombie(document.getElementById('babyZombieSprite'),Math.random()*-1000-2000,road.y-90,Math.random()*15+80,Math.random()*15+111.25,980,95,14,Math.floor(Math.random()*14),Math.random()*100,2.5,0,Math.random()*.15+.25,5,5,.007,40,false,new Audio('sounds/normalZombie'+Math.floor(Math.random()*6)+'.mp3'),'babyZombie'+zombieCount);
		} else {
			makeZombie(document.getElementById('normalZombieSprite'),Math.random()*-1000-2500,road.y-150,Math.random()*15+90,Math.random()*15+163,676,91,13,Math.floor(Math.random()*13),Math.random()*100,1.4,0,Math.random()*.1+.1,7,7,.014,25,false,new Audio('sounds/normalZombie'+Math.floor(Math.random()*6)+'.mp3'),'normalZombie'+zombieCount);
		}
	}
	if(zombie.show) {
		if(player.lose == false) {
			zombie.frameCount += passedTime*zombie.frameSpeed;
			if(zombie.frameCount >= 100) {
				zombie.frameNum++;
				if(zombie.frameNum >= zombie.amountFrame-1) {
					zombie.frameNum = 0;
				}
				zombie.frameCount = 0;
			}
		}
		if(zombie.x < player.x-((zombie.width-player.sizeX)/2)) {
			ctx.drawImage(zombie.src,zombie.frameNum*(zombie.imgWidth/zombie.amountFrame),0,zombie.imgWidth/zombie.amountFrame,zombie.imgHeight,zombie.x,zombie.y,zombie.width,zombie.height);
		}
		if(zombie.x+zombie.width > player.x+player.sizeX+((zombie.width-player.sizeX)/2)) {
			ctx.save();
			ctx.translate(zombie.x+zombie.width,zombie.y);
			ctx.scale(-1,1);
			ctx.drawImage(zombie.src,zombie.frameNum*(zombie.imgWidth/zombie.amountFrame),0,zombie.imgWidth/zombie.amountFrame,zombie.imgHeight,0,0,zombie.width,zombie.height);
			ctx.setTransform(1,0,0,1,0,0);
		}
	}
	ctx.fillStyle = 'black';
	ctx.fillRect(zombie.x+7,zombie.y-21,zombie.width-13,17);
	ctx.fillStyle = 'red';
	ctx.fillRect(zombie.x+10,zombie.y-18,zombie.health*((zombie.width-19)/zombie.fullHealth),11);
}

makeBlood = function(x,y,xv,yv) {
	blood.push({
		x:x,
		y:y,
		xv:xv,
		yv:yv,
	});
}

drawBlood = function() {
	for(let i=0;i<blood.length;i++) {
		blood[i].yv += Math.random()*.002*passedTime;
		blood[i].x += blood[i].xv*passedTime;
		blood[i].y += blood[i].yv*passedTime;
		ctx.fillStyle = 'red';
		ctx.beginPath();
		ctx.arc(blood[i].x,blood[i].y,4,0,2*Math.PI);
		ctx.fill();
		if(blood[i].y > canvas.height) {
			blood.splice(i,1);
			i--;
		}
	}
}

health = function() {
	if(player.health >= 100) {
		player.health = 100;
	}
	if(player.health <= 0) {
		player.health = 0;
		player.lose = true;
		player.start = false;
		player.y += .1*passedTime;
		document.getElementById('startBtn').style.opacity = '1';
		document.getElementById('startBtn').style.width = '150px';
		document.getElementById('startBtn').style.fontSize = '30px';
		document.getElementById('startBtn').style.padding = '15px';
		document.getElementById('startBtn').style.marginLeft = '-75px';
		document.getElementById('startBtn').style.border = '5px solid black';
	}
	ctx.font = '40px Impact';
	ctx.fillStyle = 'black';
	ctx.fillText('HP :',canvas.width-340,75);
	ctx.fillRect(canvas.width-275,50,208,30);
	ctx.fillStyle = 'red';
	ctx.fillRect(canvas.width-271,54,player.health*2,22);
}

score = function() {
	ctx.textAlign = 'center';
	ctx.fillStyle = 'rgba(250,250,250,.5)';
	ctx.fillRect(canvas.width-385,100,317,50);
	ctx.fillStyle = 'black';
	ctx.fillText('SCORE:',canvas.width-315,140);
	ctx.fillText(player.score,1040,140);
	if(localStorage.getItem('zombieDemolition2Best') == null) localStorage.setItem('zombieDemolition2Best',0);
	if(player.score > localStorage.getItem('zombieDemolition2Best')) {
		localStorage.setItem('zombieDemolition2Best',player.score);
	}
	ctx.font = '20px Impact';
	ctx.fillText('Best: ',750,30);
	ctx.fillText(localStorage.getItem('zombieDemolition2Best'),750,50);
}

ready = function() {
	requestAnimationFrame(startGame);
}