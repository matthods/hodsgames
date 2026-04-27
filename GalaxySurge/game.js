let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let FPS;
let showCollision = false;
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
}

let player = {
	src: document.getElementById('playerImg'),
	arm: document.getElementById('playerArm'),
	x:100,
	y:canvas.height/2-70,
	width:32.5,
	height:87.5,
	speedX:0,
	speedY:0,
	maxSpeedY:100/FPS,
	left:false,
	right:false,
	jump:false,
	canJump:true,
	angle:5,
	armAngle:30,
	shoot:false,
	canShoot:true,
	bullets:[],
	score:0,
	start:false,
	lost:false,
}

let shootSound = new Audio('shootSound.mp3');
shootSound.volume = .2;
let thrustSound = new Audio('thrustSound.mp3');
let lowThrustSound = new Audio('lowThrustSound.mp3');
let highScoreSound = new Audio('highScoreSound.mp3');
highScoreSound.volume = .7;
let startSound = new Audio('startSound.mp3');

let gotHighScore = false;
let asteroids = [];
let explosions = [];
let explosionSprite = document.getElementById('explosion');
let madeFirstBoss = false;
let madeSecondBoss = false;

let arrowInst = document.getElementById('arrowInst');
let wadInst = document.getElementById('wadInst');
let shootInst = document.getElementById('shootInst');
let moveInst = arrowInst;

let stars = [];
let gameSpeed = 600;
let startTime;

let startPressY = 260;
let startPressSpeed = 80;

startGame = function(timestamp) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	startTime = startTime || timestamp;
	let passedTime = timestamp - startTime
	FPS = 1000/passedTime;
	canvasSize();
	movePlayer();
	makeStars();
	if(player.start) {
		ctx.fillStyle = 'white';
		ctx.font = '20px impact';
		ctx.fillText('FPS: '+Math.round(FPS),canvas.width-40,20);
		makeObstacles();
		if(player.lost == false) {
			bullets();
			shootAsteroid();
		}
		collision();
	} else if (player.x > -70) {
		document.getElementById('canvas').style.cursor = 'default';
		if(startPressY < 260) {
			startPressSpeed = 80;
			moveInst = arrowInst;
		} else if(startPressY > canvas.height-260) {
			startPressSpeed = -80;
			moveInst = wadInst;
		}
		startPressY += startPressSpeed/FPS;
		ctx.font = '50px Impact';
		ctx.fillText('Press To Start',canvas.width/2,startPressY);
		ctx.drawImage(moveInst,900,canvas.height-159,220,100);
		ctx.drawImage(shootInst,canvas.width/2-140,canvas.height-120,280,60);
	}
	showExplosions();
	if(player.lost) {
		lose();
	}
	drawPlayer();
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
	if(event.keyCode == 39 || event.keyCode == 68) {
		player.right = true;
	}
	if(event.keyCode == 38 || event.keyCode == 87) {
		if(player.canJump && player.start) {
			player.jump = true;
		}
	}
	if(event.keyCode == 32) {
		if(player.start && player.lost == false) {
			playerShoot();
		}
	}
	if(player.start == false && player.x > 0) {
		player.start = true;
		gotHighScore = false;
		madeFirstBoss = false;
		madeSecondBoss = false;
		explosions = [];
		player.speedX = 0;
		player.speedY = -200;
		player.score = 0;
		document.getElementById('canvas').style.cursor = 'none';
		startSound.play();
	}
}

document.onmousedown = function() {
	if(player.start == false && player.x > 0) {
		player.start = true;
		gotHighScore = false;
		madeFirstBoss = false;
		madeSecondBoss = false;
		explosions = [];
		player.speedX = 0;
		player.speedY = -200;
		player.score = 0;
		document.getElementById('canvas').style.cursor = 'none';
		startSound.play();
	} else if(player.lost == false) {
			playerShoot();
		
	}
}

document.onmouseup = function() {
	player.canShoot = true;
}

document.onkeyup = function(event) {
	if(event.keyCode == 37 || event.keyCode == 65) {
		player.left = false;
	}
	if(event.keyCode == 39 || event.keyCode == 68) {
		player.right = false;
	}
	if(event.keyCode == 38 || event.keyCode == 87) {
		player.canJump = true;
	}
	if(event.keyCode == 32) {
		player.canShoot = true;
	}
}

movePlayer = function() {
	if(player.lost == false && player.start) {
		player.speedX /= 1.1;
		player.speedY += 400/FPS;
		if(player.speedY > 190) {
			player.speedY = 190;
		}
		if(player.left) {
			player.speedX -= 30;
		}
		if(player.right) {
			player.speedX += 30;
		}
		if(player.jump && player.canJump) {
			player.speedY = -270;
			thrustSound.currentTime = 0;
			thrustSound.play();
			player.jump = false;
			player.canJump = false;
		}
	}
	player.x += player.speedX/FPS;
	player.y += player.speedY/FPS;
	if(player.lost == false && player.start) {
		if(player.x < 0) {
			player.x = 0;
			player.speedX = 0;
		}
		if(player.x+player.width > canvas.width) {
			player.x = canvas.width-player.width;
			player.speedX = 0;
		}
		if(player.y+player.height > canvas.height-20) {
			player.y = canvas.height-player.height-20;
			player.speedY = 0;
		}
		if(player.y < 0) {
			player.y = 0;
			player.speedY = 0;
		}
		player.angle = player.speedX/FPS*1.2+5;
		player.armAngle = player.speedX/FPS*3+30;
	}
	if(player.score != 0 || player.start) {
		lowThrustSound.volume = Math.abs(player.speedY-150)/470+.1;
		lowThrustSound.play();
		if(lowThrustSound.currentTime > 1.7) {
			lowThrustSound.currentTime = 0;
		}
	}
}

drawPlayer = function() {
	if(player.start == false) {
		if(player.x < 100) {
			player.speedX = 100;
		} else {
			player.x = 100;
		}
		player.bullets = [];
		asteroids = [];
		esplosions = [];
		player.y = canvas.height/2-70;
	}
	ctx.save();
	ctx.translate(player.x+player.width/2,player.y);
	ctx.rotate(player.angle*Math.PI/180);
	ctx.beginPath();
	ctx.moveTo(-player.width/2+6,player.height);
	ctx.lineTo(player.width/2-6,player.height);
	ctx.lineTo(0,player.height+15-player.speedY/20+Math.random()*5);
	ctx.fillStyle = 'rgb(120,50,255)';
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(-player.width/2+12,player.height);
	ctx.lineTo(player.width/2-12,player.height);
	ctx.lineTo(0,player.height+5-player.speedY/40+Math.random()*5);
	ctx.fillStyle = 'rgb(220,150,255)';
	ctx.fill();
	ctx.drawImage(player.src,-player.width/2,0,player.width,player.height);
	ctx.translate(0,37);
	ctx.rotate(player.armAngle*Math.PI/180);
	ctx.drawImage(player.arm,-10,-5,player.width/2.2,player.height/2.5);
	ctx.restore();
	if(showCollision) {
		ctx.beginPath();
		ctx.arc(circles[e].x,circles[e].y,circles[e].r,0,2*Math.PI);
		ctx.fillStyle = 'white';
		ctx.fill();
	}
}

playerShoot = function() {
	if(player.canShoot && player.start) {
		shootSound.currentTime = 0;
		shootSound.play();
		player.canShoot = false;
		player.bullets.push({
			x:player.x+10,
			y:player.y+15,
			xv:700,
		});
	}
}

bullets = function() {
	for(let i=0;i<player.bullets.length;i++) {
		player.bullets[i].x += player.bullets[i].xv/FPS;
		ctx.fillStyle = 'rgb(240,80,80)'
		ctx.fillRect(player.bullets[i].x,player.bullets[i].y,25,4);
		if(player.bullets[i].x >= canvas.width) {
				player.bullets[i].xv = 0
				player.bullets[i].y = -500;
		}
		if(player.bullets.length > 20) {
			player.bullets.splice(0,1);
		}
	} 
}

makeObstacles = function() {
	let color = Math.random()*50+180;
	if(asteroids.length < player.score/8000+4) {
		asteroids.push({
			x:canvas.width+Math.random()*1000+400,
			y:Math.random()*(canvas.height-100)+50,
			r:Math.random()*35+75,
			xv:Math.random()*30+150,
			yv:0,
			color:'rgb('+color+','+color+','+color+')',
			img:document.getElementById('asteroid'+Math.floor(Math.random()*4)),
			sound:new Audio('explosionSound'+Math.floor(Math.random()*5)+'.mp3'),
		});
	}
	if(player.score >= 10000 && madeFirstBoss == false) {
		asteroids.push({
			x:canvas.width+500,
			y:canvas.height/2,
			r:220,
			xv:120,
			yv:0,
			color:'rgb('+color+','+color+','+color+')',
			img:document.getElementById('asteroid1'),
			sound:new Audio('explosionSound'+Math.floor(Math.random()*5)+'.mp3'),
		});
		madeFirstBoss = true;
	}
	if(player.score >= 30000 && madeSecondBoss == false) {
		asteroids.push({
			x:canvas.width+500,
			y:canvas.height/2,
			r:360,
			xv:120,
			yv:0,
			color:'rgb('+color+','+color+','+color+')',
			img:document.getElementById('asteroid0'),
			sound:new Audio('explosionSound'+Math.floor(Math.random()*5)+'.mp3'),
		});
		madeSecondBoss = true;
	}
	for(let i=0;i<asteroids.length;i++) {
		asteroids[i].x -= asteroids[i].xv/FPS;
		asteroids[i].y += asteroids[i].yv/FPS;
		if(asteroids[i].x < -asteroids[i].r) {
			asteroids[i].x=canvas.width+Math.random()*1000+400;
		}
		if(asteroids[i].y+asteroids[i].r < 0) {
			asteroids[i].y = canvas.height+asteroids[i].r;
		}
		if(asteroids[i].y-asteroids[i].r > canvas.height) {
			asteroids[i].y = -asteroids[i].r;
		}
		ctx.fillStyle = asteroids[i].color;
		ctx.beginPath();
		ctx.arc(asteroids[i].x,asteroids[i].y,asteroids[i].r,0,2*Math.PI);
		ctx.fill();
		ctx.drawImage(asteroids[i].img,asteroids[i].x-asteroids[i].r,asteroids[i].y-asteroids[i].r,asteroids[i].r*2,asteroids[i].r*2);
	}
}

shootAsteroid = function() {
	for(let i=0;i<player.bullets.length;i++) {
		for(let e=0;e<asteroids.length;e++) {
			if(player.bullets[i].x+25 > asteroids[e].x-asteroids[e].r && player.bullets[i].x < asteroids[e].x+asteroids[e].r) {
				if(player.bullets[i].y+4 > asteroids[e].y-asteroids[e].r && player.bullets[i].y < asteroids[e].y+asteroids[e].r) {
					player.score += Math.round(200-asteroids[e].r/3);
					if(asteroids[e].r <= 110) { 
						asteroids[e].sound.volume = asteroids[e].r/122.3+.1;
					} else {
						asteroids[e].sound.volume = 1;
					}
					asteroids[e].sound.play();
					if(asteroids[e].r > 35) {
						asteroids.push({
							x:asteroids[e].x,
							y:asteroids[e].y-asteroids[e].r/2,
							r:asteroids[e].r/(Math.random()*.4+1.6),
							yv:Math.random()*-10-30,
							xv:asteroids[e].xv*(Math.random()*.2+1.1),
							color:asteroids[e].color,
							img:document.getElementById('asteroid'+Math.floor(Math.random()*4)),
							sound:new Audio('explosionSound'+Math.floor(Math.random()*5)+'.mp3'),
						});
						asteroids.push({
							x:asteroids[e].x,
							y:asteroids[e].y+asteroids[e].r/2,
							r:asteroids[e].r/(Math.random()*.4+1.6),
							yv:Math.random()*10+30,
							xv:asteroids[e].xv*(Math.random()*.2+1.1),
							color:asteroids[e].color,
							img:document.getElementById('asteroid'+Math.floor(Math.random()*4)),
							sound:new Audio('explosionSound'+Math.floor(Math.random()*5)+'.mp3'),
						});
						if(asteroids[e].r > 250) {
							asteroids.push({
								x:asteroids[e].x-asteroids[e].r/1.4,
								y:asteroids[e].y,
								r:asteroids[e].r/(Math.random()*.4+1.6),
								yv:Math.random()*20-10,
								xv:asteroids[e].xv*(Math.random()*.3+1.4),
								color:asteroids[e].color,
								img:document.getElementById('asteroid'+Math.floor(Math.random()*4)),
								sound:new Audio('explosionSound'+Math.floor(Math.random()*5)+'.mp3'),
							});
						}
					}
					explosions.push({
						x:asteroids[e].x,
						y:asteroids[e].y,
						r:asteroids[e].r,
						frame:0,
						frameCount:0,
					});
					asteroids.splice(e,1);
					player.bullets[i].xv = 0
					player.bullets[i].y = -500;
				}
			}
		}
	}
}

showExplosions = function() {
	for(let i=0;i<explosions.length;i++) {
		explosions[i].frameCount += 10/FPS;
		if(explosions[i].frameCount >= 1) {
			explosions[i].frame++;
			explosions[i].frameCount = 0;
		}
		ctx.drawImage(explosionSprite,explosions[i].frame*210,0,210,210,explosions[i].x-explosions[i].r*1.7,explosions[i].y-explosions[i].r,explosions[i].r*2,explosions[i].r*2);
			if(explosions[i].frame >= 8) {
			explosions.splice(i,1);
		}
	}
}

collision = function() {
	let circles = [{x:player.x+17,y:player.y+15,r:12},{x:player.x+12,y:player.y+50,r:8},{x:player.x+9,y:player.y+75,r:8}];
	for(let e=0;e<circles.length;e++) {
		for(let i=0;i<asteroids.length;i++) {
			let distance = Math.sqrt(Math.pow(asteroids[i].x-circles[e].x,2)+Math.pow(asteroids[i].y-circles[e].y,2));
			if(distance < asteroids[i].r+circles[e].r) {
				player.lost = true;
				explosions.push({
					x:asteroids[i].x,
					y:asteroids[i].y,
					r:asteroids[i].r,
					frame:0,
					frameCount:0,
				});
				asteroids[i].sound.volume = 1;
				asteroids[i].sound.play();
				asteroids.splice(i,1);
			}
		}
	}
}

score = function() {
	ctx.textAlign = 'center';
	ctx.fillStyle = 'rgb(200,200,200)';
	ctx.font = '40px Impact';
	ctx.fillText(player.score,canvas.width/2,50);
	ctx.font = '20px Impact';
	ctx.fillText('Best:',canvas.width/2+400,25);
	if(localStorage.getItem('galaxySurgeBest') == null) {
		localStorage.setItem('galaxySurgeBest',0);
	}
	if(localStorage.getItem('galaxySurgeBest') < player.score) {
		if(gotHighScore == false) {
			highScoreSound.play();
			gotHighScore = true;
		}
		localStorage.setItem('galaxySurgeBest',player.score);
	}
	ctx.fillText(localStorage.getItem('galaxySurgeBest'),canvas.width/2+400,50);
}

lose = function() {
	for(let i=0;i<asteroids.length;i++) {
		if(asteroids[i].x-player.x > canvas.width/4) {
			explosions.push({
				x:asteroids[i].x,
				y:asteroids[i].y,
				r:asteroids[i].r,
				frame:0,
				frameCount:0,
			});
			asteroids[i].sound.volume = .1;
			asteroids[i].sound.play();
			asteroids.splice(i,1);
		}
	}
	if(player.x > -200) {
		player.angle += 8;
		player.speedX = -500;
	} else {
		for(let i=0;i<asteroids.length;i++) {
			explosions.push({
				x:asteroids[i].x,
				y:asteroids[i].y,
				r:asteroids[i].r,
				frame:0,
				frameCount:0,
			});
			asteroids[i].sound.volume = .1;
			asteroids[i].sound.play();
			asteroids.splice(i,1);
		}
		player.armAngle = 30;
		player.angle = 5;
		player.lost = false;
		player.start = false;
	}
}

makeStars = function() {
	if(stars.length < 200) {
		stars.push({
			x:Math.random()*canvas.width*2,
			y:Math.random()*canvas.height,
			speed:Math.random()*40+80,
		});
	}
	for(let i=0;i<stars.length;i++) {
			stars[i].x -= stars[i].speed/FPS;
		if(stars[i].x < 0) {
			stars[i].x = canvas.width+Math.random()*canvas.width;
			stars[i].y = Math.random()*canvas.height;
			stars[i].speed = Math.random()*40+80;
		}
		ctx.fillStyle = 'white';
		ctx.fillRect(stars[i].x,stars[i].y,2,2);
	}
}
requestAnimationFrame(startGame);