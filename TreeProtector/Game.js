let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let FPS = 60;
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
	if(player.lose) {
		ctx.fillStyle = 'black';
		ctx.font = '50px Impact';
		ctx.fillText('Use Arrow KEYS',200,400);
		ctx.fillText('Or',200,450);
		ctx.fillText('WASD',200,500);
		ctx.fillText('Press B to build',1000,400);
	}
}

let btn = document.getElementsByClassName('eBtn');
let msPassed = 1;

let gunSound = new Audio('sounds/gun.mp3');
let standTurSound = new Audio('sounds/standTur.mp3');
let pulsatorSound = new Audio('sounds/pulsator.mp3');
let launcherSound = new Audio('sounds/launcher.mp3');

let player = {
	survival:false,
	sandbox:false,
	lose: true,
	x: canvas.width/2,
	y: canvas.height/2,
	size: 13,
	angle: 0,
	startAngle: 0,
	health: 15,
	move: false,
	left: false,
	up: false,
	right: false,
	down: false,
	speedX:0,
	speedY:0,
	maxSpeed:150,
	holding: 'pistol',
	mats: 0,
	bullets: [],
	allowShoot:true,
	shootCount:0,
	kills:0,
	highScore:localStorage.getItem('TreeProtectorBest'),
	sandboxHighScore:localStorage.getItem('TreeProtectorSandboxBest'),
	scoreCount:0,
};

if(player.highScore == null) {
	player.highScore = 0;
}

if(player.sandboxHighScore == null) {
	player.sandboxHighScore = 0;
}

let turrets = [];
let pulse = [];
let buyItem = [];
let missile = document.getElementById('missile');
let explosions = [];

/*Turret*/addItem(10,canvas.height-135,18,130,3,'Turret',500,500,false,31.5,59,document.getElementById('Turret'),1.3,370,3,.9,1,standTurSound);
/*Mortar*/addItem(220,canvas.height-135,23,260,5,'Mortar',3000,3000,false,33,58,document.getElementById('Mortar'),1.3,90,10,8,3,standTurSound);
/*Pulsator*/addItem(430,canvas.height-135,28,290,6,'Pulsator',4500,4500,false,50,50,document.getElementById('Pulsator'),2,80,4,.1,2.7,pulsatorSound);
/*Homing Missile*/addItem(640,canvas.height-135,25,300,4.5,'Homing Missile',6000,6000,false,40,60,document.getElementById('Homing Missile'),1.5,240,4,8,2.5,launcherSound);
//next is 750
function addItem(x,y,r,range,health,id,cost,startCost,selc,width,height,img,divBy,bulletSpeed,bulletSize,damage,loadTime,sound) {
	buyItem.push({
		x:x,
		y:y,
		r:r,
		range:range,
		health,health,
		id:id,
		cost:cost,
		startCost:startCost,
		selc:selc,
		width:width,
		height:height,
		img:img,
		divBy:divBy,
		bulletSpeed:bulletSpeed,
		bulletSize:bulletSize,
		damage,damage,
		loadTime:loadTime,
		sound:sound,
	});
}

let showMenu = false;

let bluePrint = document.getElementById('bluePrint');

let grid = [{x:0,y:310,endX:canvas.width,endY:310},{x:0,y:620,endX:canvas.width,endY:620},{x:400,y:0,endX:400,endY:canvas.height},{x:800,y:0,endX:800,endY:canvas.height},{x:1200,y:0,endX:1200,endY:canvas.height}];

let tree = {
	x:player.x+Math.random()*300-150,
	y:player.y+Math.random()*300-150,
	size:0,
	health:15,
};

document.onkeydown = function(event) {
	if(event.keyCode == 123) {
      return false;
    } else if(event.ctrlKey && event.shiftKey && event.keyCode == 73) {
      return false;
    } else if(event.ctrlKey && event.keyCode == 85) {
      return false;
    }
	if(player.lose == false) {
		if(event.keyCode == 37 || event.keyCode == 65) {
			player.left = true;
		}
		if(event.keyCode == 38 || event.keyCode == 87) {
			player.up = true;
		}
		if(event.keyCode == 39 || event.keyCode == 68) {
			player.right = true;
		}
		if(event.keyCode == 40 || event.keyCode == 83) {
			player.down = true;
		}
		if(event.keyCode == 66) {
			if(showMenu == false) {
				showMenu = true;
				player.holding = 'bluePrint';
			} else {
				player.holding = 'pistol';
				showMenu = false;
			}
		}
	}
}

document.onkeyup = function(event) {
	if(event.keyCode == 37 || event.keyCode == 65) {
		player.left = false;
	}
	if(event.keyCode == 38 || event.keyCode == 87) {
		player.up = false;
	}
	if(event.keyCode == 39 || event.keyCode == 68) {
		player.right = false;
	}
	if(event.keyCode == 40 || event.keyCode == 83) {
		player.down = false;
	}
}

document.onmousedown = function(event) {
	if(player.survival || player.sandbox) {
		if(player.allowShoot && player.holding != 'bluePrint') {
			let angle = Math.atan2(mouseY-player.y,mouseX-player.x);
			gunSound.currentTime = 0;
			gunSound.play();
			player.bullets.push({
				x:player.x,
				y:player.y,
				xv:400*Math.cos(angle)*(Math.random()*.2+.9),
				yv:400*Math.sin(angle)*(Math.random()*.2+.9),
				r:2,
				damage:2.3,
			});
			player.allowShoot = false;
		}
		for(let i=0;i<buyItem.length;i++) {
			if(player.mats >= buyItem[i].cost && mouseX > buyItem[i].x && mouseX < buyItem[i].x+200 && mouseY > buyItem[i].y && mouseY < buyItem[i].y+120) {
				buyItem[i].selc = true;
			}
		}
		if(player.holding == 'bluePrint') {
			for(let i=0;i<turrets.length;i++) {
				if(Math.sqrt(Math.pow(mouseX-turrets[i].x,2)+Math.pow(mouseY-turrets[i].y,2)) < turrets[i].r) {
					let menuShown = false;
					for(let i=0;i<turrets.length;i++) {
						if(turrets[i].menu) {
							menuShown = true;
						}
					}
					if(menuShown == false) {
						turrets[i].menu = true;
					}
				} else {
					if(turrets[i].lvl < 5 && turrets[i].menu && mouseX > turrets[i].x+25 && mouseX < turrets[i].x+95 && mouseY > turrets[i].y-45 && mouseY < turrets[i].y-25) {
						if(player.mats > turrets[i].upCost) {
							player.mats -= turrets[i].upCost;
							turrets[i].health += 3;
							turrets[i].upCost = Math.round(turrets[i].upCost*1.45)+500;
							turrets[i].lvl++;
						}
					} else if(turrets[i].menu && mouseX > turrets[i].x+42.5 && mouseX < turrets[i].x+82.5 && mouseY > turrets[i].y-85 && mouseY < turrets[i].y-65) {
						player.mats += turrets[i].value;
						turrets.splice(i,1);
					} else {
						turrets[i].menu = false;
					}
				}
			}
		}
	}
}

let allowPlace;

document.onmouseup = function() {
	for(let i=0;i<buyItem.length;i++) {
		if(buyItem[i].selc) {
			buyItem[i].selc = false;
			if(player.holding == 'bluePrint' && mouseY < canvas.height-150 && allowPlace) {
				makeItem(i);
			}
		}
	}
}

makeItem = function(i) {
	player.mats -= buyItem[i].cost;
	buyItem[i].cost += 200;
	turrets.push({
		id:buyItem[i].id,
		lvl:1,
		upCost:Math.round(buyItem[i].startCost*1.4)+500,
		value:0,
		menu:true,
		img:buyItem[i].img,
		x:mouseX,
		y:mouseY,
		r:buyItem[i].r,
		range:buyItem[i].range,
		width:buyItem[i].width,
		height:buyItem[i].height,
		divBy:buyItem[i].divBy,
		angle:0,
		bulletSize:buyItem[i].bulletSize,
		bulletSpeed:buyItem[i].bulletSpeed,
		load:0,
		loadTime:buyItem[i].loadTime,
		damage:buyItem[i].damage,
		health:buyItem[i].health,
		sound:buyItem[i].sound,
	});
}

let startTime;
let mouseX,mouseY;

startGame = function(timeStamp) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	startTime = startTime || timeStamp
	msPassed = (timeStamp - startTime);
	msPassed = Math.min(msPassed, 1000);
	FPS = 1000/msPassed;
	
	canvasSize();
	if(player.lose == false) {
		movePlayer();
	}
	for(let i=0;i<grid.length;i++) {
		makeGrid(grid[i]);
	}
	moveTree();
	if(player.lose == false) {
		playerAttack();
		build();
	}
	drawPlayer();
	lumberjacks();
	if(player.lose) {
		document.getElementById('survivalBtn').style.display = 'block';
		document.getElementById('sandboxBtn').style.display = 'block';
		document.getElementById('canvas').style.cursor = 'default';
		player.survival = false;
		player.sandbox = false;
		player.holding = 'pistol';
		player.left == false;
		player.right == false;
		player.up == false;
		player.down == false;
	}
	score();
	requestAnimationFrame(startGame);
	startTime = timeStamp;
}

document.onmousemove = function(event) {
	mouseX = (event.clientX-(window.innerWidth-canvasX)/2)*(canvas.width/canvasX);
	mouseY = (event.clientY-(window.innerHeight-canvasY)/2)*(canvas.height/canvasY);
}

makeGrid = function(line) {
	if(line.y == line.endY) {
	line.y += player.speedY/FPS;
	line.endY += player.speedY/FPS;
		if(line.y > canvas.height) {
			line.y = 0;
			line.endY = 0;
		} else if(line.y < 0) {
			line.y = canvas.height;
			line.endY = canvas.height;
		}
	} else if(line.x == line.endX) {
	line.x += player.speedX/FPS;
	line.endX += player.speedX/FPS;
		if(line.x > canvas.width) {
			line.x = 0;
			line.endX = 0;
		} else if(line.x < 0) {
			line.x = canvas.width;
			line.endX = canvas.width;
		}
	}
	ctx.beginPath();
	ctx.moveTo(line.x,line.y);
	ctx.lineTo(line.endX,line.endY);
	ctx.lineWidth = '2';
	ctx.strokeStyle = 'black';
	ctx.stroke();
}

moveTree = function() {
	if(tree.x < 0 || tree.x > canvas.width || tree.y < 50 || tree.y > canvas.height) {
		ctx.strokeStyle = '#4dc957';
		ctx.lineWidth = '10';
		ctx.beginPath();
		ctx.moveTo(player.x,player.y);
		ctx.lineTo(tree.x,tree.y);
		ctx.stroke();
	}
	if(player.lose == false) {
		tree.x += player.speedX/FPS;
		tree.y += player.speedY/FPS;
		if(tree.health < 15) {
			tree.health += .5/FPS;
			if(tree.health <= 0) {
				player.lose = true;
			}
		}
	}
	tree.size = tree.health/2+30;
	ctx.fillStyle = 'black';
	ctx.fillRect(canvas.width-150,100,100,30);
	ctx.fillStyle = 'rgb(100,200,100)';
	ctx.fillRect(canvas.width-145,105,tree.health*6,20);
	if(player.lose == false) {
		if(tree.x-70 < canvas.width && tree.x+70 > 0 && tree.y-70 < canvas.height && tree.y+70 > 0) {
			ctx.fillStyle = '#26bf33';
			ctx.strokeStyle = 'black';
			ctx.lineWidth = '8';
			ctx.beginPath();
			ctx.arc(tree.x-25,tree.y+25,tree.size-15,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(tree.x+24,tree.y-25,tree.size-15,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(tree.x+25,tree.y+25,tree.size-15,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(tree.x-25,tree.y-20,tree.size-15,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(tree.x-30,tree.y-16,tree.size-15,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(tree.x+33,tree.y-12,tree.size-15,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(tree.x+30,tree.y+15,tree.size-15,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(tree.x-30,tree.y+20,tree.size-15,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(tree.x,tree.y-35,tree.size-15,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(tree.x,tree.y+35,tree.size-15,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(tree.x,tree.y,tree.size,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}
	}
}

movePlayer = function() {
	if(player.health < 15) {
		player.health += 1/3/FPS;
	}
	if(player.health <= 0) {
		player.lose = true;
	}
	if(player.speedX > 0) {
		player.speedX -= 10;
	} else if(player.speedX < 0) {
		player.speedX += 10;
	}
	if(player.speedY > 0) {
		player.speedY -= 10;
	} else if(player.speedY < 0) {
		player.speedY += 10;
	}
	player.move = false;
	if(player.left) {
		player.move = true;
		player.speedX += 20;
	}
	if(player.up) {
		player.move = true;
		player.speedY += 20;
	}
	if(player.right) {
		player.move = true;
		player.speedX += -20;
	}
	if(player.down) {
		player.move = true;
		player.speedY += -20;
	}
	if(player.speedX > player.maxSpeed) {
		player.speedX = player.maxSpeed;
	} else if(player.speedX < -player.maxSpeed) {
		player.speedX = -player.maxSpeed;
	}
	if(player.speedY > player.maxSpeed) {
		player.speedY = player.maxSpeed;
	} else if(player.speedY < -player.maxSpeed) {
		player.speedY = -player.maxSpeed;
	}
	player.angle = (Math.atan2(player.y-mouseY,player.x-mouseX)-Math.PI/2)*180/Math.PI;
}

drawPlayer = function() {
	ctx.save();
	ctx.translate(player.x,player.y);
	ctx.rotate(player.angle*Math.PI/180);
	if(player.holding == 'pistol') {
		ctx.fillStyle = 'black';
		ctx.fillRect(2,-25,7,30);
	} else if(player.holding == 'bluePrint') {
		ctx.drawImage(bluePrint,-17,-33,40,30);
	}
	ctx.strokeStyle = 'black';
	ctx.lineWidth = '1';
	ctx.fillStyle = '#2852d1';
	ctx.beginPath();
	ctx.arc(0,0,player.size,0,2*Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.ellipse(-6,-7,5,3,0,0,2*Math.PI);
	ctx.fill();
	ctx.beginPath();
	ctx.ellipse(6,-7,5,3,0,0,2*Math.PI);
	ctx.fill();
	ctx.restore();
}

let turTouchDist,turTreeDist;

build = function() {
	for(let i=0;i<turrets.length;i++) {
		if(player.holding != 'bluePrint') {
			turrets[i].menu = false;
		}
		dists = [];
		turrets[i].x += player.speedX/FPS;
		turrets[i].y += player.speedY/FPS;
		for(let I=0;I<jacks.length;I++) { 
			dists.push(Math.sqrt(Math.pow(jacks[I].x-turrets[i].x,2)+Math.pow(jacks[I].y-turrets[i].y,2)));
		}
		let shortestDist = Math.min(...dists);
		turrets[i].load += 1/FPS;
		for(let I=0;I<jacks.length;I++) {
			let dist = Math.sqrt(Math.pow(jacks[I].x-turrets[i].x,2)+Math.pow(jacks[I].y-turrets[i].y,2));
			if(shortestDist < turrets[i].range-50+turrets[i].lvl*50 && shortestDist == dist) {
				turrets[i].angle = (Math.atan2(turrets[i].y-jacks[I].y,turrets[i].x-jacks[I].x)-Math.PI/2);
				if(turrets[i].load > turrets[i].loadTime+1/3-turrets[i].lvl/4) {
					if(turrets[i].id != 'Turret' ) {
						if(turrets[i].id == 'Mortar' ) {
							turrets[i].sound = new Audio('sounds/mortar.mp3');
						}
						if(turrets[i].id == 'Pulsator' ) {
							turrets[i].sound = new Audio('sounds/pulsator.mp3');
						}
						if(turrets[i].id == 'Homing Missile' ) {
							turrets[i].sound = new Audio('sounds/launcher.mp3');
						}
						turrets[i].sound.volume = turrets[i].lvl/20;
					} else {
						turrets[i].sound.currentTime = 0;
						turrets[i].sound.volume = turrets[i].lvl/5;
					}
					turrets[i].sound.play();
					if(turrets[i].id == 'Turret') {
						player.bullets.push({
							x:turrets[i].x,
							y:turrets[i].y,
							xv:turrets[i].bulletSpeed*Math.cos(turrets[i].angle-Math.PI/2)*(Math.random()*.2+.9),
							yv:turrets[i].bulletSpeed*Math.sin(turrets[i].angle-Math.PI/2)*(Math.random()*.2+.9),
							r:turrets[i].bulletSize,
							damage:turrets[i].damage+turrets[i].lvl/2.5,
						});
					} else if(turrets[i].id == 'Mortar') {
						player.bullets.push({
							x:turrets[i].x,
							y:turrets[i].y,
							xv:turrets[i].bulletSpeed*Math.cos(turrets[i].angle-Math.PI/2)*(Math.random()*.2+.9),
							yv:turrets[i].bulletSpeed*Math.sin(turrets[i].angle-Math.PI/2)*(Math.random()*.2+.9),
							r:turrets[i].bulletSize,
							damage:turrets[i].damage+turrets[i].lvl,
							startY:turrets[i].y,
							startX:turrets[i].x,
							range:turrets[i].range-50+turrets[i].lvl*50,
						});
					} else if (turrets[i].id == 'Homing Missile') {
						player.bullets.push({
							x:turrets[i].x,
							y:turrets[i].y,
							xv:0,
							yv:0,
							r:8.1,
							range:turrets[i].range-50+turrets[i].lvl*50,
							speed:turrets[i].bulletSpeed,
							damage:turrets[i].damage+turrets[i].lvl/1.5,
							jack:jacks[I],
						});
					} else if(turrets[i].id == 'Pulsator') {
						pulse.push({
							x:turrets[i].x,
							y:turrets[i].y,
							r:turrets[i].range-50+turrets[i].lvl*50,
							damage:turrets[i].damage+turrets[i].damage/4,
							speed:turrets[i].bulletSpeed,
							size:0,
							lineWidth:1,
							dist:0,
						});
					}
					turrets[i].load = 0;
				}
			}
		}
		if(turrets[i].x-100 < canvas.width && turrets[i].x+100 > 0 && turrets[i].y-100 < canvas.height && turrets[i].y+100 > 0) {
			if(turrets[i].lvl == 1) {
				ctx.fillStyle = 'black';
			} else if(turrets[i].lvl == 2) {
				ctx.fillStyle = 'rgb(120,100,50)';
			} else if(turrets[i].lvl == 3) {
				ctx.fillStyle = 'rgb(200,200,200)';
			} else if(turrets[i].lvl == 4) {
				ctx.fillStyle = 'rgb(190,160,50)';
			} else if(turrets[i].lvl == 5) {
				ctx.fillStyle = 'rgb(170,170,230)';
			}
			ctx.beginPath();
			ctx.arc(turrets[i].x,turrets[i].y,turrets[i].r,0,2*Math.PI);
			ctx.fill();
		}
	}
	for(let i=0;i<turrets.length;i++) {
		ctx.save();
		ctx.translate(turrets[i].x,turrets[i].y);
		ctx.rotate(turrets[i].angle);
		ctx.drawImage(turrets[i].img,-turrets[i].width/2,-turrets[i].height/turrets[i].divBy,turrets[i].width,turrets[i].height);
		ctx.restore();
	}
	for(let i=0;i<turrets.length;i++) {
		if(turrets[i].menu) {
			ctx.beginPath();
			ctx.arc(turrets[i].x,turrets[i].y,turrets[i].range-50+turrets[i].lvl*50,0,2*Math.PI);
			ctx.lineWidth = 10;
			ctx.strokeStyle = 'rgb(255,255,255,0.3)';
			ctx.stroke();
			turrets[i].value = Math.round(turrets[i].upCost/1.45);
			ctx.fillStyle = 'rgb(180,180,200)';
			ctx.fillRect(turrets[i].x+20,turrets[i].y-110,80,90);
			if(player.mats >= turrets[i].upCost && turrets[i].lvl != 5) {
				ctx.fillStyle = 'rgb(150,255,150)';
			} else {
				ctx.fillStyle = 'rgb(150,100,100)';
			}
			ctx.fillRect(turrets[i].x+25,turrets[i].y-45,70,20);
			ctx.fillStyle = 'black';
			ctx.font = '18px impact';
			if(turrets[i].lvl != 5) {
				ctx.textAlign = 'center';
				ctx.fillText('$'+turrets[i].upCost,turrets[i].x+65,turrets[i].y-47.5);
			}
			ctx.textAlign = 'left';
			ctx.fillText('UPGRADE',turrets[i].x+27.5,turrets[i].y-27.5);
			
			ctx.fillStyle = 'rgb(230,230,210)';
			ctx.fillRect(turrets[i].x+42.5,turrets[i].y-85,40,20);
			ctx.fillStyle = 'black';
			ctx.textAlign = 'center';
			ctx.fillText('$'+turrets[i].value,turrets[i].x+65,turrets[i].y-87.5);
			ctx.textAlign = 'left';
			ctx.fillText('SELL',turrets[i].x+46,turrets[i].y-67.5);
		}
	}
	if(player.holding == 'bluePrint') {
		document.getElementById('canvas').style.cursor = 'default';
		ctx.fillStyle = 'black';
		ctx.fillRect(0,canvas.height-150,canvas.width,150);
		for(let i=0;i<buyItem.length;i++) {
			if(player.mats >= buyItem[i].cost) {
				ctx.fillStyle = 'white';
			} else {
				ctx.fillStyle = 'rgb(150,100,100)';
			}
			ctx.fillRect(buyItem[i].x,buyItem[i].y,200,120);
			ctx.drawImage(buyItem[i].img,buyItem[i].x+100-buyItem[i].width/2,buyItem[i].y+60-buyItem[i].height/2,buyItem[i].width,buyItem[i].height);
			ctx.fillStyle = 'black';
			ctx.textAlign = 'center';
			ctx.font = '25px Impact';
			ctx.fillText(buyItem[i].id,buyItem[i].x+100,buyItem[i].y+25);
			ctx.font = '30px Impact';
			ctx.fillText(buyItem[i].cost,buyItem[i].x+100,buyItem[i].y+115);
			if(buyItem[i].selc) {
				ctx.lineWidth = '10';
				ctx.beginPath();
				ctx.arc(mouseX,mouseY,buyItem[i].range,0,2*Math.PI);
				ctx.strokeStyle = 'rgb(255,255,255,0.3)';
				ctx.stroke();
				turTreeDist = Math.sqrt(Math.pow(tree.x-mouseX,2)+Math.pow(tree.y-mouseY,2));
				allowPlace = true;
				ctx.lineWidth = '4';
				ctx.beginPath();
				ctx.arc(mouseX,mouseY,buyItem[i].r,0,2*Math.PI);
				ctx.fillStyle = 'black';
				ctx.fill();
				if(turTreeDist > buyItem[i].r+tree.size+10) {
					ctx.strokeStyle = 'rgb(205,255,205,0.3)';
				} else {
					allowPlace = false;
					ctx.strokeStyle = 'rgb(150,100,100,1)';
					ctx.beginPath();
					ctx.arc(mouseX,mouseY,buyItem[i].r,0,2*Math.PI);
					ctx.stroke();
				}
				ctx.beginPath();
				ctx.arc(tree.x,tree.y,tree.size+10,0,2*Math.PI);
				ctx.stroke();
				for(let I=0;I<turrets.length;I++) {
					turTouchDist = Math.sqrt(Math.pow(mouseX-turrets[I].x,2)+Math.pow(mouseY-turrets[I].y,2));
					if(turTouchDist < buyItem[i].r+turrets[I].r) {
						allowPlace = false;
						ctx.strokeStyle = 'rgb(150,100,100,1)';
						ctx.beginPath();
						ctx.arc(mouseX,mouseY,buyItem[i].r,0,2*Math.PI);
						ctx.stroke();
					} else {
						ctx.strokeStyle = 'rgb(205,255,205,0.3)';
					}
					ctx.beginPath();
					ctx.arc(turrets[I].x,turrets[I].y,turrets[I].r,0,2*Math.PI);
					ctx.stroke();
				}
				ctx.drawImage(buyItem[i].img,mouseX-buyItem[i].width/2,mouseY-buyItem[i].height/buyItem[i].divBy,buyItem[i].width,buyItem[i].height)
			}
		}
	} else {
		document.getElementById('canvas').style.cursor = 'none';
	}
}

let morDist,BulletAngle;

playerAttack = function() {
	if(player.allowShoot == false) {
		player.shootCount += 1/FPS;
		if(player.shootCount >= .4) {
			player.allowShoot = true;
			player.shootCount = 0;
		}
	}
	for(let i=0;i<player.bullets.length;i++) {
		player.bullets[i].x += player.speedX/FPS;
		player.bullets[i].y += player.speedY/FPS;
		if(player.bullets[i].x != tree.x || player.bullets[i].y != tree.y) {
			player.bullets[i].x += player.bullets[i].xv/FPS;
			player.bullets[i].y += player.bullets[i].yv/FPS;
			if(player.bullets[i].x > tree.x+canvas.width*2 || player.bullets[i].x < tree.x-canvas.width*2 || player.bullets[i].y > tree.y+canvas.height*2 || player.bullets[i].y < tree.x-canvas.height*2) {
				player.bullets[i].x = tree.x;
				player.bullets[i].y = tree.y;
				player.bullets[i].xv = 0;
				player.bullets[i].yv = 0;
			} else {
				if(player.bullets[i].r == 10) {
					player.bullets[i].endPointX += player.speedX/FPS;
					player.bullets[i].endPointY += player.speedY/FPS;
					player.bullets[i].startX += player.speedX/FPS;
					player.bullets[i].startY += player.speedY/FPS;
					morDist = Math.sqrt(Math.pow(player.bullets[i].startX-player.bullets[i].x,2)+Math.pow(player.bullets[i].startY-player.bullets[i].y,2));
					if(morDist > player.bullets[i].range) {
						player.bullets[i].x = tree.x;
						player.bullets[i].y = tree.y;
						player.bullets[i].xv = 0;
						player.bullets[i].yv = 0;
					}
				} else if(player.bullets[i].r == 8.1) {
					dists = [];
					for(let I=0;I<jacks.length;I++) { 
						dists.push(Math.sqrt(Math.pow(jacks[I].x-player.bullets[i].x,2)+Math.pow(jacks[I].y-player.bullets[i].y,2)));
					}
					let shortestDist = Math.min(...dists);
					for(let I=0;I<jacks.length;I++) { 
						let dist = Math.sqrt(Math.pow(jacks[I].x-player.bullets[i].x,2)+Math.pow(jacks[I].y-player.bullets[i].y,2));
						if(dist == shortestDist) {
							player.bullets[i].jack = jacks[I];
						}
					}
					BulletAngle = Math.atan2(player.bullets[i].y-player.bullets[i].jack.y,player.bullets[i].x-player.bullets[i].jack.x)+Math.PI;
					player.bullets[i].xv = (player.bullets[i].xv*29+player.bullets[i].speed*Math.cos(BulletAngle))/30;
					player.bullets[i].yv = (player.bullets[i].yv*29+player.bullets[i].speed*Math.sin(BulletAngle))/30;
				}
				if(player.bullets[i].x > 0 && player.bullets[i].x < canvas.width && player.bullets[i].y > 0 && player.bullets[i].y < canvas.height) {
					if(player.bullets[i].x != tree.x || player.bullets[i].y != tree.y) {
						if(player.bullets[i].r == 8.1) {
							ctx.save();
							ctx.translate(player.bullets[i].x,player.bullets[i].y);
							ctx.rotate(BulletAngle+Math.PI/2);
							ctx.drawImage(missile,-10,-20,20,40);
							ctx.restore();
						} else {
							ctx.beginPath();
							ctx.arc(player.bullets[i].x,player.bullets[i].y,player.bullets[i].r,0,2*Math.PI);
							ctx.fillStyle = 'black';
							ctx.fill();
						}
					}
				}
			}
		}
		if(player.bullets.length > 200) {
			player.bullets.splice(0,1)
		}
	}
	for(let i=0;i<pulse.length;i++) {
		if(pulse[i].size < pulse[i].r) {
			pulse[i].x += player.speedX/FPS;
			pulse[i].y += player.speedY/FPS;
			pulse[i].size += pulse[i].speed/FPS;
			pulse[i].lineWidth -= pulse[i].speed/pulse[i].r/FPS;
			if(pulse[i].lineWidth < 0) {
				pulse[i].lineWidth = 0;
			}
			ctx.lineWidth = 15;
			ctx.strokeStyle = 'rgb(200,200,255,'+pulse[i].lineWidth+')';
			ctx.beginPath();
			ctx.arc(pulse[i].x,pulse[i].y,pulse[i].size,0,2*Math.PI);
			ctx.stroke();
		}
		if(pulse[i].linWidth == 0) {
			pulse.splice(0,1)
		}
	}
	for(let i=0;i<explosions.length;i++) {
		explosions[i].sound.volume = .15;
		explosions[i].sound.play();
		explosions[i].r += 100/FPS;
		explosions[i].x += player.speedX/FPS;
		explosions[i].y += player.speedY/FPS;
		ctx.fillStyle = 'rgb(250,50,50)';
		ctx.beginPath();
		ctx.arc(explosions[i].x,explosions[i].y,explosions[i].r,0,2*Math.PI);
		ctx.fill();
		ctx.fillStyle = 'rgb(250,250,50)';
		ctx.beginPath();
		ctx.arc(explosions[i].x,explosions[i].y,explosions[i].r/2.5,0,2*Math.PI);
		ctx.fill();
		if(explosions[i].r > 35) {
			explosions.splice(i,1);
		}
	}
}

let jacks = [];
let distPlayer,distTree,turDists,dy,dx;

makeJack = function(x,y,size) {
	jacks.push({
		x:x,//Math.random()*canvas.width,
		y:y,//Math.random()*canvas.height,
		size:size,
		angle:0,
		speedX:0,
		speedY:0,
		health:size+player.kills/6-14,
		color:size*7+20,
		sound:new Audio('sounds/zombieEating'+Math.floor(Math.random()*5)+'.mp3'),
	});
}

lumberjacks = function() {
	if(jacks.length < player.kills/(10+player.kills/200)+3) {
		makeJack(tree.x-canvas.width/2+Math.random()*(canvas.width-50)-canvas.width,tree.y-canvas.height/2+Math.random()*canvas.height,20+Math.random()*10-5);
		makeJack(tree.x-canvas.width/2+Math.random()*(canvas.width-50)+50+canvas.width,tree.y-canvas.height/2+Math.random()*canvas.height,20+Math.random()*10-5);
		makeJack(tree.x-canvas.width/2+Math.random()*canvas.width,tree.y-canvas.height/2+Math.random()*(canvas.height-50)-canvas.height,20+Math.random()*10-5);
		makeJack(tree.x-canvas.width/2+Math.random()*canvas.width,tree.y-canvas.height/2+Math.random()*(canvas.height-50)+50+canvas.height,20+Math.random()*10-5);
	}
	let eating = false;
		for(let i=0;i<jacks.length;i++) {
			if(player.lose == false) {
			distTree = Math.sqrt(Math.pow(jacks[i].x-tree.x,2)+Math.pow(jacks[i].y-tree.y,2))-40;
			distPlayer = Math.sqrt(Math.pow(jacks[i].x-player.x,2)+Math.pow(jacks[i].y-player.y,2));
			if(distTree < distPlayer) {
				dx = tree.x - jacks[i].x;
				dy = tree.y - jacks[i].y;
				jacks[i].angle = Math.atan2(tree.y-jacks[i].y,tree.x-jacks[i].x)+90*Math.PI/180;
			} else {
				dx = player.x - jacks[i].x;
				dy = player.y - jacks[i].y;
				jacks[i].angle = Math.atan2(player.y-jacks[i].y,player.x-jacks[i].x)+90*Math.PI/180;
			}
			turDists = [];
			for(let I=0;I<turrets.length;I++) {
				turrets[I].dist = Math.sqrt(Math.pow(jacks[i].x-turrets[I].x,2)+Math.pow(jacks[i].y-turrets[I].y,2));
				turDists.push(Math.sqrt(Math.pow(jacks[i].x-turrets[I].x,2)+Math.pow(jacks[i].y-turrets[I].y,2)));
			}
			let turDist = Math.min(...turDists);
			if(turDist < distTree && turDist < distPlayer) {
				for(let I=0;I<turrets.length;I++) {
					if(turDist == Math.sqrt(Math.pow(jacks[i].x-turrets[I].x,2)+Math.pow(jacks[i].y-turrets[I].y,2))) {			
						dx = turrets[I].x - jacks[i].x;
						dy = turrets[I].y - jacks[i].y;
						jacks[i].angle = Math.atan2(turrets[I].y-jacks[i].y,turrets[I].x-jacks[i].x)+90*Math.PI/180;
					}
				}
			}
			let angle = Math.atan2(dy,dx);
			jacks[i].speedX = jacks[i].size*3*Math.cos(angle);
			jacks[i].speedY = jacks[i].size*3*Math.sin(angle);
			if(distTree < 10) {
				jacks[i].speedX = 0;
				jacks[i].speedY = 0;
				if(distTree < distPlayer) {
					jacks[i].sound.volume = .1;
					jacks[i].sound.play();
					eating = true;
					tree.health -= 1/FPS;
				}
			} else if(distPlayer < 20 && distPlayer < distTree) {
				jacks[i].speedX = 0;
				jacks[i].speedY = 0;
				jacks[i].sound.volume = .1;
				jacks[i].sound.play();
				eating = true;
				player.health -= 1/FPS;
			} else {
				for(let I=0;I<turrets.length;I++) {
					if(turrets[I].dist < 50) {
						jacks[i].speedX = 0;
						jacks[i].speedY = 0;
						jacks[i].sound.volume = .1;
						eating = true;
						jacks[i].sound.play();
						turrets[I].health -= 1/FPS;
						if(turrets[I].health <= 0) {
							turrets.splice(I,1);
						}
					}
				}
			}
			for(let I=0;I<pulse.length;I++) {
				if(pulse[I].lineWidth > 0 && Math.sqrt(Math.pow(jacks[i].x-pulse[I].x,2)+Math.pow(jacks[i].y-pulse[I].y,2)) < pulse[I].size) {
					jacks[i].health -= pulse[I].damage/FPS;
					jacks[i].speedX /= 4;
					jacks[i].speedY /= 4;
				}
			}
			for(let I=0;I<player.bullets.length;I++) {
				if(player.bullets[I].x != 0 || player.bullets[I].y !=0) {
					if(jacks.length > 0) {
					let bulletDist = Math.sqrt(Math.pow(jacks[i].x-player.bullets[I].x,2)+Math.pow(jacks[i].y-player.bullets[I].y,2));
						if(bulletDist < jacks[i].size) {
							jacks[i].speedX = player.bullets[I].xv/2;
							jacks[i].speedY = player.bullets[I].yv/2;
							if(player.bullets[I].r != 10) {
								jacks[i].health -= player.bullets[I].damage;
								if(player.bullets[I].r == 8.1) {
									explosions.push({
										x:player.bullets[I].x,
										y:player.bullets[I].y,
										r:0,
										damage:player.bullets[I].damage*40,
										sound:new Audio('sounds/explosion.mp3'),
									});
								}
								player.bullets.splice(I,1);
							} else {
								jacks[i].health -= player.bullets[I].damage/FPS;
							}
						}
					}
				}
			}
			for(let I=0;I<explosions.length;I++) {
				if(explosions[I].r > Math.sqrt(Math.pow(jacks[i].x-explosions[I].x,2)+Math.pow(jacks[i].y-explosions[I].y,2))) {
					jacks[i].health -= explosions[I].damage/FPS;
				}
			}
			if(jacks[i].health <= 0) {
				jacks[i].x = Math.random();
				jacks[i].y = Math.random();
				if(jacks[i].x >= .5) {
					jacks[i].x = Math.random()*(canvas.width-50)-canvas.width;
				} else {
					jacks[i].x = Math.random()*(canvas.width-50)+50+canvas.width
				}
				if(jacks[i].y >= .5) {
					jacks[i].y = Math.random()*(canvas.height-50)-canvas.height;
				} else {
					jacks[i].y = Math.random()*(canvas.height-50)+50+canvas.height;
				}
				player.mats += Math.round(jacks[i].size*10);
				jacks[i].size = 20+Math.random()*6-3;
				jacks[i].health = jacks[i].size+player.kills/5-14,
				player.kills++;
			}
			jacks[i].x += player.speedX/FPS;
			jacks[i].y += player.speedY/FPS;
			jacks[i].x += jacks[i].speedX/FPS;
			jacks[i].y += jacks[i].speedY/FPS;
		}
		if(eating == false && jacks[i].sound.volume > 0.01) {
			jacks[i].sound.volume -= 0.01;
		}
		if(jacks[i].x-jacks[i].size < canvas.width+20 && jacks[i].x+jacks[i].size > -20 && jacks[i].y+jacks[i].size > -20 && jacks[i].y-jacks[i].size < canvas.height+20) {
			ctx.strokeStyle = 'black';
			ctx.lineWidth = '2';
			ctx.fillStyle = 'rgb(60,'+jacks[i].color+',60)';
			ctx.beginPath();
			ctx.arc(jacks[i].x,jacks[i].y,jacks[i].size,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
			ctx.save();
			ctx.translate(jacks[i].x,jacks[i].y);
			ctx.rotate(jacks[i].angle);
			ctx.fillStyle = 'rgb(160,70,70)';
			ctx.beginPath();
			ctx.ellipse(-7,-8,6,3,2.5,0,2*Math.PI);
			ctx.fill();
			ctx.beginPath();
			ctx.ellipse(7,-8,6,3,-2.5,0,2*Math.PI);
			ctx.fill();
			if(jacks[i].health >= 15) {
				ctx.fillStyle = 'rgb(150,120,100)';
				ctx.fillRect(-25,-jacks[i].size*1.5,50,10);
				ctx.strokeRect(-25,-jacks[i].size*1.5,50,10);
				ctx.fillRect(-25,jacks[i].size*1.5-10,50,10);
				ctx.strokeRect(-25,jacks[i].size*1.5-10,50,10);
				ctx.fillRect(-jacks[i].size*1.5,-25,10,50);
				ctx.strokeRect(-jacks[i].size*1.5,-25,10,50);
				ctx.fillRect(jacks[i].size*1.5-10,-25,10,50);
				ctx.strokeRect(jacks[i].size*1.5-10,-25,10,50);
				if(jacks[i].health >= 30) {
					ctx.rotate(45*Math.PI/180);
					ctx.fillStyle = 'rgb(150,120,100)';
					ctx.fillRect(-25,-jacks[i].size*1.5,50,10);
					ctx.strokeRect(-25,-jacks[i].size*1.5,50,10);
					ctx.fillRect(-25,jacks[i].size*1.5-10,50,10);
					ctx.strokeRect(-25,jacks[i].size*1.5-10,50,10);
					ctx.fillRect(-jacks[i].size*1.5,-25,10,50);
					ctx.strokeRect(-jacks[i].size*1.5,-25,10,50);
					ctx.fillRect(jacks[i].size*1.5-10,-25,10,50);
					ctx.strokeRect(jacks[i].size*1.5-10,-25,10,50);
				}
			}
			ctx.restore();
		}
	}
	if(player.holding != 'bluePrint') {
		ctx.fillStyle = 'black';
		ctx.fillRect(mouseX-2,mouseY-15,4,10);
		ctx.fillRect(mouseX-2,mouseY+5,4,10);
		ctx.fillRect(mouseX-15,mouseY-2,10,4);
		ctx.fillRect(mouseX+5,mouseY-2,10,4);
	}
	ctx.fillStyle = 'black';
	ctx.fillRect(player.x-20,player.y-25,40,10);
	ctx.fillStyle = 'rgb(100,240,100)';
	ctx.fillRect(player.x-18,player.y-23,player.health*2.4,6);
}

let FPSes = [];

score = function() {
	if(player.survival) {
		if(player.kills > localStorage.getItem('TreeProtectorBest')) {
			localStorage.setItem('TreeProtectorBest',player.kills);
			player.highScore = player.kills;
		}
	} else if(player.sandbox) {
		if(player.kills > localStorage.getItem('TreeProtectorSandboxBest')) {
			localStorage.setItem('TreeProtectorSandboxBest',player.kills);
			player.sandboxHighScore = player.kills;
		}
	} else {
		if(player.scoreCount < 4) {
			player.scoreCount += 1/FPS;
		} else {
			player.scoreCount = 0;
		}
	}
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.font = '50px Impact';
	ctx.fillText(player.kills,canvas.width/2,100);
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width,50);
	ctx.fillStyle = 'white';
	ctx.font = '40px Impact';
	if(player.survival || player.scoreCount < 2 && player.scoreCount >= 0) {
		ctx.fillText('Survival Best: '+player.highScore,canvas.width/2,40);
	} else if(player.sandbox || player.scoreCount > 2) {
		ctx.fillText('Sandbox Best: '+player.sandboxHighScore,canvas.width/2,40);
	}
	ctx.fillText(player.mats,canvas.width-180,40);
	ctx.font = '20px Impact'
	FPSes.push(FPS);
	if(FPSes.length > 30) {
		FPSes.splice(0,1);
	}
	let total = 0;
	for(let i=0;i<FPSes.length;i++) {
		total += FPSes[i];
	}
	ctx.fillText("FPS: "+Math.round(total/FPSes.length),canvas.width-50,40);
}

survival = function() {
	player.survival = true;
	player.mats = 0;
}

sandbox = function() {
	player.sandbox = true;
	player.mats = 9999999;
}

play = function() {
	player.lose = false;
	player.scoreCount = -1;
	document.getElementById('survivalBtn').style.display = 'none';
	document.getElementById('sandboxBtn').style.display = 'none';
	jacks = [];
	if(tree.health <= 0) {
		tree.x = player.x+Math.random()*300-150;
		tree.y = player.y+Math.random()*300-150;
	}
	tree.health = 15;
	player.health = 15;
	player.kills = 0;
	turrets = [];
	pulse = [];
	player.bullets = [];
	explosions = [];
	for(let i=0;i<buyItem.length;i++) {
		buyItem[i].cost = buyItem[i].startCost;
	}
}

requestAnimationFrame(startGame);