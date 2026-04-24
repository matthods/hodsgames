let canvas = document.getElementById('canvas').getContext('2d');
let rocketImage = document.getElementById('rocket');

const FPS = 70;
const laserSpeed = 200 / FPS;
const detectCollision = false;

canvasX = 0;
canvasY = 0;

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

let shootSound = new Audio('Sounds/PlayerShooting.mp3');
let smallExplosionSound = new Audio('Sounds/SmallExplosionAudio.mp3');
let bigExplosionSound = new Audio('Sounds/BigExplosionAudio.mp3');
let newLifeSound = new Audio('Sounds/NewLifeAudio.mp3');
let playerExplodeSound = new Audio('Sounds/PlayerExplosionAudio.mp3');
let respawnSound = new Audio('Sounds/RespawnAudio.mp3');
let bossMadSound = new Audio('Sounds/BossMadAudio.mp3');
	bossMadSound.currentTime = 0.5;


let explodePlyrCount = 0;
let attackCount = 0;
let explodeEnmyCount= 0;
let newLifeCount = 0;
let startCount = 0;
let pressSpace = '';

let newLife = {
	x: Math.random()*288,
	y: -30,
	speed: 20 / FPS,
	random: Math.random()*5+10,
}

let startEnemyX = -20;

let meteorImage = document.getElementById('meteor');

let fullHealth = document.getElementById('bossFullHealth');
let oneHit = document.getElementById('bossOneHit');
let twoHits = document.getElementById('bossTwoHits');
let mad = document.getElementById('bossMad');
let furious = document.getElementById('bossFurious');
let sad = document.getElementById('bossSad');
let bossImage = fullHealth;
let bossHealth = 1;

let bossShakeCount = 0;
let bossShakeX = 0;
let bossShakeCountLength = 0;
let bossShake = false;
let bossAttackCount = 0;
let bossAttackRandom = Math.random()*5+1;
let bossShootShield = false;
let dashRight = false;
let dashLeft = false;
let dashTime = Math.random()+1;

let runAwayCount = 0;

let shield = {
	goldX: 0,
	goldY: 0,
	x: 0,
	y: 0,
}


let player = {
	x: 140,
	y: 125,
	r: 10,
	speed: 80 / FPS,
	moveRight: false,
	moveLeft: false,
	shoot: false,
	canShoot: true,
	lasers: [],
	explode: false,
	explosion: document.getElementById('playerExplosion'),
	health: 3,
	level: 1,
	score: 0,
	start: true,
	restart: false,
}

let enemyList = {};

createEnemy(30,Math.random()*30+270,5,5,0,0,15,8,Math.random()*3,false,0,100,100,true,true,true,true,'#b32700',1,14,10,0,0,0,Math.random()*-135-30,1,1,'small');
createEnemy(30,Math.random()*30+270,60,60,0,0,15,8,Math.random()*3,false,0,100,100,true,true,true,true,'#b32700',1,44,10,0,0,0,Math.random()*-135-30,1,1,'small2');
createEnemy(30,Math.random()*30+270,115,115,0,0,15,8,Math.random()*3,false,0,100,100,true,true,true,true,'#b32700',1,74,10,0,0,0,Math.random()*-135-30,1,1,'small3');
createEnemy(30,Math.random()*30+270,170,170,0,0,15,8,Math.random()*3,false,0,100,100,true,true,true,true,'#b32700',1,104,10,0,0,0,Math.random()*-135-30,1,1,'small4');
createEnemy(30,Math.random()*30+270,225,225,0,0,15,8,Math.random()*3,false,0,100,100,true,true,true,true,'#b32700',1,134,10,0,0,0,Math.random()*-135-30,1,1,'small5');
createEnemy(30,Math.random()*30+270,280,280,0,0,15,8,Math.random()*3,false,0,100,100,true,true,true,true,'#b32700',1,164,10,0,0,0,Math.random()*-135-30,1,1,'small6');
createEnemy(20,Math.random()*30+270,30,30,0,0,20,10,Math.random()*10+5,false,0,250,250,false,true,true,true,'#008f26',2,224,10,0,0,0,Math.random()*-135-30,2,2,'middle');
createEnemy(20,Math.random()*30+270,250,250,0,0,20,10,Math.random()*10+5,false,0,250,250,false,true,true,true,'#008f26',2,194,10,0,0,0,Math.random()*-135-30,2,2,'middle2');
createEnemy(1,Math.random()*30+270,132.5,132.5,0,0,45,30,Math.random()*10+5,false,0,3000,3000,false,false,true,false,'#6e003e',3,254,10,0,0,0,Math.random()*-135-30,130,130,'boss');
createEnemy(-40,Math.random()*30+270,Math.random()*250 +10,Math.random()*250 +10,0,0,35,20,Math.random()*10+5,false,0,500,500,true,true,true,true,'yellow',4,284,10,0,0,0,Math.random()*-135-30,1,1,'meteor');
//createEnemy(60,270,15,15,0,0,30,15,Math.random()*10+5,false,0,600,600,false,false,false,true,'yellow',5,284,10,0,0,0,Math.random()*-135-30,6,6,'babyBoss');


function createEnemy(stopY,startY,startX,x,speedX,speedY,sizeX,sizeY,attackTime,enemyHit,explodeCount,value,startValue,lvl1,lvl2,lvl3,lvl4,color,strength,bossSpearX,bossSpearY,bossSpearHeight,bossSpearStartX,bossSpearStartY,siegeY,health,fullHealth,id) {
	let enemy = {
		stopY: stopY,
		startY: startY,
		startX: startX,
		x: x,
		speedX: speedX,
		speedY: speedY,
		sizeX: sizeX,
		sizeY: sizeY,
		attackTime: attackTime,
		enemyHit: enemyHit,
		explodeCount: explodeCount,
		value: value,
		startValue: startValue,
		smallExplosion: document.getElementById('smallExplosion'),
		bigExplosion: document.getElementById('bigExplosion'),
		lvl1: lvl1,
		lvl2: lvl2,
		lvl3: lvl3,
		lvl4: lvl4,
		color: color,
		strength: strength,
		bossSpearX: bossSpearX,
		bossSpearY: bossSpearY,
		bossSpearHeight: bossSpearHeight,
		bossSpearStartX: bossSpearStartX,
		bossSpearStartY: bossSpearStartY,
		siegeY: siegeY,
		health: health,
		fullHealth: fullHealth,
		id:id,
	}
	enemyList[id] = enemy;
}

startGame = function(thing) {
	canvas.fillStyle = 'white';
	document.getElementById('canvas').style.cursor = 'none';
	canvas.clearRect(0,0,window.innerWidth,window.innerHeight);
	canvasSize();
	if(player.start) {
		canvas.textAlign = 'center';
		canvas.fillStyle = '#5100ff';
		canvas.font = '25px VT323';
		startCount += 0.1 / FPS;
		if(startCount >= .02) {
			canvas.fillText(pressSpace, 150,40);
			pressSpace = 'Press the space bar to start';
			if(startCount >= .1) {
				startCount = -.04;
			}
		}
		canvas.fillStyle = 'white';
		canvas.fillRect(startEnemyX,100,15,8);
		canvas.fillStyle = '#b32700';
		canvas.fillRect(startEnemyX,99,4,10);
		canvas.fillRect(startEnemyX+11,99,4,10);
		canvas.fillRect(startEnemyX+6,102,3,8);
		startEnemyX += 50 / FPS;
		if(startEnemyX > 300) {
			startEnemyX = -20;
		}
	} else {
		playerPosition();
		for(let i in enemyList) {
			enemyPosition(enemyList[i]);
		}
		for(let i in enemyList) {
			collision(enemyList[i]);
		}
		for(let i in enemyList) {
			hitEnemy(enemyList[i]);
		}
		levelUp();
		for(let i in enemyList) {
			playerDead(enemyList[i]);
		}
		for(let i in enemyList) {
			bossMad(enemyList[i]);
		}
		extraLife();
		for(let i in enemyList) {
			bossFurious(enemyList[i]);
		}
		for(let i in enemyList) {
			bossSad(enemyList[i]);
		}
	}
}

document.onkeydown = function(event) {
	if(event.keyCode == 123) {
      return false;
    } else if(event.ctrlKey && event.shiftKey && event.keyCode == 73) {
      return false;
    } else if(event.ctrlKey && event.keyCode == 85) {
      return false;
    }
	if(event.keyCode === 39) {
		player.moveRight = true;
	}
	else if(event.keyCode === 37) {
		player.moveLeft = true;
	}
	if(event.keyCode === 32) {
		playerShoot();
		player.restart = true;
		for(let i in enemyList) {
			restart(enemyList[i]);
		}
		setInterval(restart,1);
	}
}
	

document.onkeyup = function(event){
	if(event.keyCode === 39)
		player.moveRight = false;
	else if(event.keyCode === 37)
		player.moveLeft = false;
	if(event.keyCode === 32) {
		player.canShoot = true;
	}
}

playerPosition = function() {
	canvas.drawImage(rocketImage,player.x,player.y,18,20);
	
	for (let i = 0; i < player.lasers.length; i++) {
	canvas.fillStyle = 'white';
	canvas.fillRect(player.lasers[i].x, player.lasers[i].y, 2,2);
	}
	
	if(player.explode === false) {
		if(player.moveRight) {
			player.x += player.speed;
		}
		if(player.moveLeft) {
			player.x -= player.speed;
		}
		
		if(player.x < 0) {
			player.x = 0
		}
		if(player.x > 282) {
			player.x = 282;
		}
	}	
		for (let i = 0; i < player.lasers.length; i++) {
			if(player.lasers[i].y > player.y -30) {
			//	player.canShoot = true;
			//player.canShoot = false;
			} else {
				
			}
			player.lasers[i].y -= player.lasers[i].yv;
			if(player.lasers.length > 20) {
				player.lasers.shift();
			}
		}
}

playerShoot = function() {
	if(player.explode === false) {
		if(player.canShoot) {
			player.lasers.push({
				x: player.x + 8.5,
				y: player.y,
				yv: laserSpeed,
			});
			shootSound.currentTime = .2;
			shootSound.play();
		}
		player.canShoot = false;
	}
}

levelUp = function() {
	canvas.font = '15px VT323';
	canvas.fillStyle = 'white';
	canvas.fillText('BADGES:', 258,50);
	canvas.fillRect(260,60,12,20);
	canvas.fillStyle = '#b32700';
	canvas.fillRect(262,60,3,20);
	canvas.fillRect(267,60,3,20);
	canvas.fillStyle = '#d19c1f';
	canvas.fillRect(259,60,14,5);
	
	if(player.score >= 1000) {
		player.level = 2;
		canvas.fillStyle = 'white';
		canvas.fillRect(280,60,12,20);
		canvas.fillStyle = '#b32700';
		canvas.fillRect(282,60,3,20);
		canvas.fillRect(287,60,3,20);
		canvas.fillStyle = '#d19c1f';
		canvas.fillRect(279,60,14,5);
	}
	
	if(player.score >= 2000) {
		player.level = 3;
		canvas.fillStyle = 'white';
		canvas.fillRect(260,85,12,20);
		canvas.fillStyle = '#b32700';
		canvas.fillRect(262,85,3,20);
		canvas.fillRect(267,85,3,20);
		canvas.fillStyle = '#d19c1f';
		canvas.fillRect(259,85,14,5);
	}
	
	if(bossImage === mad || bossImage === furious || bossImage === sad || runAwayCount > 0) {
		canvas.fillStyle = 'white';
		canvas.fillRect(280,85,12,20);
		canvas.fillStyle = '#b32700';
		canvas.fillRect(282,85,3,20);
		canvas.fillRect(287,85,3,20);
		canvas.fillStyle = '#d19c1f';
		canvas.fillRect(279,85,14,5);
	}
	
	if(runAwayCount > .6) {
		canvas.fillStyle = 'white';
		canvas.fillRect(280,110,12,20);
		canvas.fillStyle = '#b32700';
		canvas.fillRect(282,110,3,20);
		canvas.fillRect(287,110,3,20);
		canvas.fillStyle = '#d19c1f';
		canvas.fillRect(279,110,14,5);
	}
}

enemyPosition = function(thing) {
	if(thing.enemyHit === false) {
		if(player.level >= 1 && thing.lvl1 === true || player.level >= 2 && thing.lvl2 === true || player.level === 3 && thing.lvl3 === true || thing.strength === 4) {
			thing.startY += thing.speedY;
			thing.x += thing.speedX;
			
			if(thing.strength === 1) {
				canvas.fillStyle = 'white';
				canvas.fillRect(thing.x,thing.startY,15,8);
				canvas.fillStyle = thing.color;
				canvas.fillRect(thing.x,thing.startY-1,4,10);
				canvas.fillRect(thing.x+11,thing.startY-1,4,10);
				canvas.fillRect(thing.x+6,thing.startY+2,3,8);
			}
			
			if(thing.strength === 2) {
				canvas.fillStyle = 'white';
				canvas.fillRect(thing.x,thing.startY,20,10);
				canvas.fillStyle = thing.color;
				canvas.fillRect(thing.x,thing.startY,2,10);
				canvas.fillRect(thing.x+18,thing.startY,2,10);
				canvas.fillRect(thing.x,thing.startY+2,20,3);
			}
			
			if (thing.strength === 3) {
				canvas.drawImage(bossImage,thing.x,thing.startY,thing.sizeX,thing.sizeY);
				
				if(runAwayCount > .8) {
					if(thing.health <= 0) {
						thing.startY = 160;
						thing.speedY = 0;
						thing.speedX = 0;
					}
				}
			}
			
			if(thing.strength === 4) {
				canvas.drawImage(meteorImage,thing.x,thing.startY,25,25);
			}
			
			attackCount += 0.1 / FPS;
			
				if(thing.attackTime < attackCount) {
					if(thing.strength === 1) {
						//if(thing.value === 100) {
							thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /110) / FPS;
							thing.speedY = 50 / FPS;
						//} else {
						//	thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /90) / FPS;
						//	thing.speedY = 0.7;
						//}
					} 
					if(thing.strength === 2) {
						//if(thing.value === 250) {
						thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /90) / FPS;
						thing.speedY = 60 / FPS;
						//} else {
						//	thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /70) / FPS;
						//	thing.speedY = 0.8;
						//}
						
					}
					if(thing.strength === 3) {
						if(bossShake === false) {
							thing.speedY = 20 / FPS;
							thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /350) / FPS;
							if(player.score >= 8000) {
								thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /300) / FPS;
							}
							if(player.score >= 10500) {
								thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /250) / FPS;
							}
							if(player.score >= 13000) {
								thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /200) / FPS;
							}
							if(player.score >= 15500) {
								thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /150) / FPS;
							}
							if(player.score >= 18000) {
								thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /100) / FPS;
							}
						}
					}
					if(thing.strength === 4) {
						thing.speedY = 120 / FPS;
					}
					
					
				} else {
				thing.speedY = 0;
				thing.speedX = 0;
				}
			
			//canvas.fillText(attackCount,20,20);
			
			if(thing.startY > 300) {
				if(thing.strength === 4) {
					thing.x = player.x+9-thing.sizeX/2;
					thing.startY = Math.random()*-60-40;
					thing.attackTime = attackCount + Math.random()*6+1;
				} else {
					thing.startY = Math.random()*-60-40;
					thing.x = thing.startX;
					thing.attackTime = attackCount + Math.random()*6+1;
				}
			}
		}
		
		if(thing.startY < thing.stopY) {
		thing.speedY = 50 /FPS;
		}
	}
}

collision = function(thing) {
	if(detectCollision) {
		canvas.strokeStyle = '#0affba';
		canvas.lineWidth = .1;
		canvas.strokeRect(player.x, player.y, 18,20,);
		canvas.lineWidth = 1;
		canvas.strokeRect(thing.x,thing.startY,thing.sizeX,thing.sizeY);
	}
	
	if(thing.strength != 4) {
		if(player.x < thing.x+thing.sizeX && player.x+18 > thing.x && player.y < thing.startY+thing.sizeY && player.y+20 > thing.startY) {
			player.explode = true;
			//playerExplodeSound.currentTime = 1;
			//playerExplodeSound.play();
		}
	} else {
		//canvas.strokeStyle ='red';
		//canvas.beginPath();
		//canvas.arc(thing.x+13,thing.startY+13,13,0,2*Math.PI);
		//canvas.stroke();
		
		let meteorDistX = Math.abs(thing.x - player.x+3);
		let meteorDistY = Math.abs(thing.startY - player.y+3);
		
		//canvas.fillRect(thing.x,thing.startY,meteorDistX,meteorDistY);
		
		if (meteorDistX <= 20) {
			if (meteorDistY <= 20) {
				player.explode = true;
				//playerExplodeSound.currentTime = 1;
				//playerExplodeSound.play();
			}
		}
	}
	
	if(player.explode) {
		if(player.health >= 1) {
			playerExplodeSound.play();
		}
		newLife.y = -30;
		newLife.x = Math.random()*288;
		newLife.random = Math.random()*5+10;
		newLifeCount = 0;
		canvas.drawImage(player.explosion, player.x-7,player.y-7,35,35);
		if(thing.strength != 3) {
			thing.x = thing.startX;
			thing.startY = Math.random()*30+270;
		}
		if(thing.strength === 3) {
			if(bossImage != mad && bossImage != furious) {
				thing.startY = Math.random()*30+270;
			}
		}
		explodePlyrCount += 0.1 / FPS;
		if(explodePlyrCount > 2) {
			explodePlyrCount = 0;
			player.health -= 1;
			player.explode = false;
			if(player.health > 0) {
			player.x = 140;
			respawnSound.currentTime = 0.7;
			respawnSound.play();
			}
		}
	}
}

extraLife = function() {
	if(player.health < 3) {
		newLifeCount += 1 / FPS;
		if(newLifeCount > newLife.random) {
			canvas.drawImage(rocketImage,newLife.x,newLife.y,15,16+2/3);
			newLife.y += newLife.speed;
			if(player.x < newLife.x+15 && player.x+18 > newLife.x && player.y < newLife.y+16+2/3 && player.y+20 > newLife.y) {
				newLifeSound.play();
				player.health += 1;
				newLifeCount = 0;
				newLife.y = -30;
				newLife.x = Math.random()*288;
				newLife.random = Math.random()*5+10;
			}
			if(newLife.y > 150) {
				newLifeCount = 0;
				newLife.y = -30;
				newLife.x = Math.random()*288;
				newLife.random = Math.random()*5+10;
			}
		}
	}
}

hitEnemy = function(thing) {
	canvas.font = '20px VT323';
	canvas.fillStyle = 'salmon';
	canvas.textAlign = 'left';
	canvas.fillText('SCORE:',10,15);
	canvas.fillStyle = 'lightgrey';
	canvas.font = '25px VT323';
	canvas.fillText(player.score,70,15);
	if(thing.strength != 4) {
		for (let i = player.lasers.length -1; i >= 0; i--) {
			if(player.lasers[i].y < thing.startY+thing.sizeY && player.lasers[i].y > thing.startY && player.lasers[i].x > thing.x-2 && player.lasers[i].x < thing.x+thing.sizeX) {
				if(thing.enemyHit === false) {
					thing.enemyHit = true;
					thing.health -= 1;
					
					if(thing.strength != 3) {
						if(thing.health === 0) {
							smallExplosionSound.currentTime = .7;
							smallExplosionSound.play();
							player.score += thing.value;
							thing.health = thing.fullHealth;
						}
					}
					if(thing.strength === 3) {
						//bossHealth-= 0.1;
						//if(bossHealth <= 0 && bossHealth >= -0.1) {
							
							//player.score += thing.value;
						//}
					}
					player.lasers[i].x = -650;
					player.lasers[i].yv = 0;
				}
			}
			if(player.lasers[i].y <= 0) {
				player.lasers[i].x = -650;
				player.lasers[i].yv = 0;
			}
		}
	}
	if(thing.enemyHit){
		if(thing.strength === 1) {
			thing.explodeCount += 8 /FPS;
			thing.speedX = 0;
			thing.speedY = 0;
			canvas.drawImage(thing.smallExplosion, thing.x-5,thing.startY-7, 30,30);
		}
		
		if(thing.strength === 2) {
		
			if(thing.color === '#0076ad') {
				thing.explodeCount += 8 /FPS;
				thing.speedX = 0;
				thing.speedY = 0;
				canvas.drawImage(thing.smallExplosion, thing.x-5,thing.startY-7, 30,30);
			}

			if(thing.color === '#008f26'){
				thing.enemyHit = false;
				thing.color = '#0076ad';
			}	
		}
		
		if(thing.color === '#417500') {
			thing.explodeCount += 4 / FPS;
			thing.speedX = 0;
			thing.speedY = 0;
			canvas.drawImage(thing.bigExplosion,thing.x-10,thing.startY-15,60,50);
		}
		
		if(thing.strength === 3) {
			if(bossImage != sad || bossShake === false) {
				thing.startY -= 100 / FPS;
			}
		
			if(thing.health <45) {
				thing.enemyHit = false;
				if(bossImage != furious && bossImage != sad) {
					bossImage = mad;
				}
				if(bossShakeCount === 0) {
					bossShake = true;
				}
				//thing.color = '#417500';
			}
			
			
			if(thing.health >=45 && thing.health <75) {
				thing.enemyHit = false;
				bossImage = twoHits;
				thing.color = '#027065';
			}
		
			if(thing.health >= 75 && thing.health < 105) {
				thing.enemyHit = false;
				bossImage = oneHit;
				thing.color = '#6b4200';
			}
			
			if(thing.health >=105) {
				thing.enemyHit = false;
				bossImage = fullHealth;
			}
		}

			if(thing.explodeCount > 2) {
				thing.explodeCount = 0;
				thing.explodeCount += 0;
				thing.startY = Math.random()*50+250;
				thing.enemyHit = false;
				if(thing.color === '#0076ad') {
					thing.color = '#008f26';
				}
				if(thing.color === '#417500') {
					thing.color = '#6e003e';
					bossImage = fullHealth;
					bossHealth = 15;
				}
			}
	}
}

bossMad = function(thing) {
	if(bossImage === mad) {
		if(bossShake) {
			bossMadSound.play();
			if(thing.strength !=3) {
				thing.speedX = 0;
				thing.speedY = 0;
			}
			if(thing.strength === 3) {
				if(thing.startY < 2) {
					thing.speedY = 200 / FPS;
				}
				
				if(bossShakeCount === 0) {
					bossShakeX = thing.x;
				}
				bossShakeCount += 0.08 / FPS;
				bossShakeCountLength += 0.1 / FPS;
				
				if(bossShakeCount <= 0.004) {
					thing.x -= 200 / FPS;
					thing.speedX = 0;
					thing.speedY = -10 / FPS;
				}
				if(bossShakeCount > 0.008) {
					if(thing.x < bossShakeX-5) {
						thing.x += 200 / FPS;
						thing.speedX = 0;
						thing.speedY = -10 /FPS;
					}
				}
				if(bossShakeCount >= .012) {
					if(thing.x < bossShakeX+5) {
						bossShakeCount = 0.001;
						thing.speedX = 0;
						thing.speedY = -10 / FPS;
					}
				}
			}
		}
		if(bossShakeCountLength > .3) {
			bossShakeCount = 1;
			bossShake = false;
			thing.speedY = -150 / FPS;
			
			if(thing.startY > 150) {
				thing.startY = thing.siegeY;
				thing.x = thing.startX;
			}
			if(thing.strength != 3) {
				
				thing.speedX = 0;
				if(thing.startY < thing.siegeY) {
					thing.startY = thing.siegeY;
				}
			} else if(thing.strength === 3) {
				if(thing.startY < 5) {
					thing.speedY = 0;
					
					if(bossShootShield === false) {
						shield.goldX = thing.x +20;
						shield.goldY= thing.startY+38;
						shield.x= thing.x-5;
						shield.y= thing.startY+33;
					}
					canvas.fillStyle = '#d19c1f';
					canvas.fillRect(shield.goldX,shield.goldY,5,3);
					canvas.fillStyle = '#8c5e14';
					canvas.fillRect(shield.x,shield.y,thing.sizeX+10,7);
					if(bossShootShield) {
						thing.speedX = 0;
						shield.y += 100 / FPS;
						shield.goldY += 100 /FPS;
					}
					
					if(shield.y > 300) {
						thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /70) / FPS;
						shield.y = 201;
						shield.goldY = 201;
						bossAttackCount = 0;
						bossImage = furious;
					}
					for (let i = 0; i < player.lasers.length; i++) {
						if(player.lasers[i].y < shield.y+5 && player.lasers[i].y > shield.y && player.lasers[i].x +2 > shield.x && player.lasers[i].x < shield.x+thing.sizeX+10) {
							player.lasers[i].y = -650;
							shield.y -= 200 / FPS;
							shield.goldY -= 200 / FPS;
						}
						if(player.y < shield.y+7 && player.y+20 > shield.y && player.x+18 > shield.x && player.x < shield.x+thing.sizeX+10) {
							player.explode = true;
						}
					}
				} else {
					thing.speedY = -150 / FPS;
				}
			}
			
			bossAttackCount += 1 / FPS;
			if(bossAttackCount > bossAttackRandom) {
				canvas.fillStyle = '#d60000';
				canvas.fillRect(thing.bossSpearStartX,thing.bossSpearY,2,thing.bossSpearHeight);
				if(thing.bossSpearStartX > thing.bossSpearX) {
					thing.bossSpearStartX -= 100 / FPS;
				}
				if(thing.bossSpearStartX < thing.bossSpearX) {
					thing.bossSpearStartX += 100 / FPS;
				}
				thing.bossSpearHeight += 5 / FPS;
				if(thing.bossSpearHeight >= 15) {
					thing.bossSpearHeight = 15;
				
					if(bossAttackCount > bossAttackRandom +15) {
						thing.bossSpearY += 100 / FPS;
					}
				}
				
				if(player.y < thing.bossSpearY+15 && player.y+20 > thing.bossSpearY && player.x+18 > thing.bossSpearX && player.x < thing.bossSpearX+2) {
					player.explode = true;
				}
				
				if(thing.bossSpearY > 200) {
					if(thing.bossSpearY > 208) {
						thing.bossSpearY -= 100 / FPS;
					}
					if(thing.strength === 1) {
						if(thing.bossSpearY < 205) {
							thing.startY = thing.siegeY;
						}
						
						if(thing.enemyHit === false) {
							thing.speedY = (100*(Math.random()*1.5-.1)) / FPS;
							if(thing.startY > 30) {
								thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /80) / FPS;
							} else {
								thing.x = thing.startX;
							}
						} else {
							thing.speedX = 0;
							if(thing.startY <= 30) {
								thing.speedY = -50 / FPS;
							} else {
								thing.speedY = 0;
							}
						}
						if(bossAttackCount > 270) {
							if(thing.enemyHit === false) {
								if(thing.x+thing.sizeX>player.x+9) {
									thing.speedX = 150 / FPS;
								}
								if(thing.x+thing.sizeX<player.x+9) {
									thing.speedX = -150 / FPS;
								}
								if(thing.x > 300 || thing.x < -30) {
									thing.startY = -30;
									thing.x = thing.startX;
								}
							}
							if(thing.startY > -30 && thing.startY < -25) {
								thing.startY = -30;
								thing.speedX = 0;
								thing.speedY = 0;
								if(bossAttackCount > 310) {
									bossShootShield = true;
								}
							}
						}
					}
				}
			}
		}
	}
}

bossFurious = function(thing) {
	if(player.health >= 1) {
		if(bossImage === furious) {
			bossAttackCount += 0.1 / FPS;
			if(thing.strength != 3) {
				thing.startY = -30;
				thing.x = thing.startX;
				thing.speedY = 0;
				thing.speedX = 0;
			} else {
				thing.speedY = 40 / FPS;
				if(bossAttackCount <= dashTime && bossAttackCount > 0) {
					thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /80) / FPS;
					dashLeft = false;
					dashRight = false;
				}
				
				if(bossAttackCount > dashTime) {
					if(thing.startY < 70) {
						if(thing.x+thing.sizeX/2 > player.x+9+25 && dashRight === false) {
							dashLeft = true;
						}
						if(thing.x+thing.sizeX/2 < player.x+9-25 && dashLeft === false) {
							dashRight = true;
						}
					} else {
						
					} thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /80) / FPS;
				}
				
				
				if(dashLeft === true) {
						thing.speedX -= 150 / FPS;
					if(thing.x+thing.sizeX/2 < player.x+9-20 || bossAttackCount > 3) {
						bossAttackCount = 0;
						dashTime = Math.random()+1.5;
						dashLeft = false;
						dashRight = false;
						thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /80) / FPS;
					} else {
						//thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /140) / FPS;
					}
				}
				if(dashRight === true) {
					thing.speedX += 150 / FPS;
					if(thing.x+thing.sizeX/2 > player.x+9+20 || bossAttackCount > 3) {
						bossAttackCount = 0;
						dashTime = Math.random()+1.5;
						dashLeft = false;
						dashRight = false;
						thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /80) / FPS;
					} else {
						//thing.speedX = (100*(player.x-thing.sizeX/2-thing.x+9) /140) / FPS;
					}
				}
				if(thing.health <= 0) {
					bossImage = sad;
				}
			}
		}
	}
}

bossSad = function(thing) {
	if(bossImage === sad) {
		thing.speedX = 0;
		if(thing.strength != 3) {
			if(runAwayCount > .6) {
				if(thing.strength ===1) {
					thing.value = 150;
				}
				if(thing.strength === 2) {
					thing.value = 300;
				}
				thing.startY = 400;
				if(runAwayCount > .8) {
					bossImage = fullHealth;
				}
			} else {
				thing.startY = -30;
				thing.x = thing.startX;
				thing.speedY = 0;
			}
		} else {
			runAwayCount += 0.1 / FPS;
			if(runAwayCount > 70 / FPS) {
				thing.startY = 160;
				
			}
			if(thing.startY < 50) {
				if(runAwayCount <= .5) {
					thing.speedY = 40 / FPS;
				}
			} else {
				if(runAwayCount <= 50 / FPS) {
					thing.speedY = 0;
				}
			}
		
			if(runAwayCount > .5) {
				thing.speedY = -100 / FPS;
			}
		}
	}
}

playerDead = function(thing) {
	if(player.health === 3) {
		canvas.drawImage(rocketImage,255,5,12,40/3);
		canvas.drawImage(rocketImage,280,5,12,40/3);
	}
	if(player.health === 2) {
		canvas.drawImage(rocketImage,255,5,12,40/3);
	}
	if(player.health < 1) {
		thing.speedY = 0;
		thing.speedX = 0;
		player.speed = 0;
		explodePlyrCount -= 0.1 / FPS;
		player.explode = true;
		document.getElementById('canvas').style.cursor = 'default';
		canvas.fillStyle = '#3266a6';
		canvas.textAlign = 'center';
		canvas.fillRect(10,65, 280, 20);
		canvas.fillStyle = '#b32700';
		canvas.font = '50px VT323';
		canvas.fillText('YOU DIED!',150,60);
		canvas.font = '20px VT323';
		canvas.fillText('Press the space bar to play again!', 150, 80);
	}
}

restart = function(thing) {
	if(player.health < 1 && player.restart) {
		window.location = 'http://hodsgames.com/GalaticTakedown/GalaticTakedown.html';
	} else {
		player.restart = false;
	}
	
	if(player.start) {
		player.start = false;
	}
}

setInterval(startGame,1000 / FPS);



