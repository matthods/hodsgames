let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let FPS;

let canvasY = 0;
let canvasX = 0;

canvasSize = function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

const friction = .98;
const playerImg = document.getElementById('playerImg');

let player = {
	r:20,
	angle:0,
	up:false,
	down:false,
	left:false,
	right:false,
	xv:0,
	yv:0,
	maxV:250,
	control:101,
	score:0,
	health:100,
	img:playerImg,
	shootSound:new Audio('sounds/shoot.mp3'),
	damage:1,
	lose:true,
	best:localStorage.getItem('GalacticCollapseBest'),
}
if(player.best == null) player.best = 0;

let bullets = [];
let explosions = [];
let ships = [];

let powerUps = [];
let mouseX,mouseY

document.onmousemove = function(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

document.onmousedown = function(event) {
	shoot(event.clientY,player.y,event.clientX,player.x,3,player.damage);
	if(player.lose && explosions.length == 0) {
		player.x = window.innerWidth/2;
		player.y = window.innerHeight/2;
		player.health = 100;
		player.score = 0;
		player.damage = 1;
		player.control = 101;
		ships = [];
		powerUps = [];
		player.lose = false;
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
	if(event.keyCode == 37 || event.keyCode == 65) player.left = true;
	if(event.keyCode == 38 || event.keyCode == 87) player.up = true;
	if(event.keyCode == 39 || event.keyCode == 68) player.right = true;
	if(event.keyCode == 40 || event.keyCode == 83) player.down = true;
}

document.onkeyup = function(event) {
	if(event.keyCode == 37 || event.keyCode == 65) player.left = false;
	if(event.keyCode == 38 || event.keyCode == 87) player.up = false;
	if(event.keyCode == 39 || event.keyCode == 68) player.right = false;
	if(event.keyCode == 40 || event.keyCode == 83) player.down = false;
}

let startTime;

startGame = function(timeStamp) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	startTime = startTime || timeStamp;
	FPS = 1000/(timeStamp-startTime);
	ctx.fillText(Math.round(FPS),10,10);
	canvasSize();
	
	ctx.strokeStyle = 'white';
	ctx.fillStyle = 'white';
	if(player.lose == false) move.call(player);
	bullet.call(player);
	for(let i=0;i<ships.length;i++) {
		if(player.lose == false) move.call(ships[i]);
		draw.call(ships[i]);
	}
	hit.call(bullets);
	if(player.lose == false) {
		draw.call(player);
		checkShips.call(ships);
		makePowerUps.call(powerUps);
		for(let i in powerUps) {
			drawPowerUps.call(powerUps[i]);
		}
	}
	display();
	explosion.call();
	if(player.lose) {
		ctx.font = '40px impact';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.fillText('Click To Start',window.innerWidth/2,300);
	}
	startTime = timeStamp;
	requestAnimationFrame(startGame);
}

move = function() {
	if(this == player) {
		movePlayer.call(this);
	} else {
		moveShips.call(this);
	}
	
	this.x += this.xv/FPS;
	this.y += this.yv/FPS;
}

movePlayer = function() {
	if(this.health <= 0) {
		this.lose = true;
		pushExplosion(player.x,player.y,50);
	}
	if(this.left) this.xv -= 400/FPS;
	if(this.right) this.xv += 400/FPS;
	if(this.up) this.yv -= 400/FPS;
	if(this.down) this.yv += 400/FPS;
	
	if(this.left == false && this.right == false) this.xv *= 100/this.control;
	if(this.up == false && this.down == false) this.yv *= 100/this.control;
	
	if(this.xv > this.maxV) this.xv = this.maxV;
	if(this.xv < -this.maxV) this.xv = -this.maxV;
	if(this.yv > this.maxV) this.yv = this.maxV;
	if(this.yv < -this.maxV) this.yv = -this.maxV;
	
	if(this.x > canvas.width) this.x = canvas.width, this.xv = 0;
	if(this.x < 0) this.x = 0, this.xv = 0;
	if(this.y > canvas.height) this.y = canvas.height, this.yv = 0;
	if(this.y < 0) this.y = 0, this.yv = 0;
	
	this.angle = Math.atan2(mouseY-player.y,mouseX-player.x)+Math.PI/2;
}

moveShips = function() {
	let angle = Math.atan2(player.y-this.y,player.x-this.x);
	this.angle = angle+Math.PI/2
	if(Math.sqrt(Math.pow(player.y-this.y,2)+Math.pow(player.x-this.x,2)) > 150) {
		this.xv = (this.xv*100+this.maxV*Math.cos(angle))/101;
		this.yv = (this.yv*100+this.maxV*Math.sin(angle))/101;
	}
	
	if(this.x > 0 && this.x < canvas.width && player.lose == false) {
		this.shootCount += 1/FPS;
		if(this.shootCount > this.r/20) {
			shoot(player.y,this.y,player.x,this.x,this.r/20,this.r/5);
			this.shootCount = 0;
		}
	}
}

draw = function() {
	ctx.lineWidth = 2;
	ctx.save();
	ctx.translate(this.x,this.y);
	ctx.rotate(this.angle);
	ctx.drawImage(this.img,-this.r,-this.r,this.r*2,98/81*this.r*2);
	ctx.restore();
}

pushExplosion = function(x,y,r) {
	l = new Audio('sounds/explosion'+Math.floor(Math.random()*4)+'.mp3');
	l.volume = r/65.625;
	l.play();
	explosions.push({
		x:x,
		y:y,
		frame:0,
		count:0,
		r:r,
	});
}

explosion = function() {
	for(let i=0;i<explosions.length;i++) {
		e = explosions[i];
		e.count += 1/FPS;
		if(e.count > .1) {
			e.count = 0;
			e.frame++;
		}
		ctx.drawImage(document.getElementById('explosion'+e.frame),e.x-e.r,e.y-e.r,e.r*2,e.r*2);
		if(e.frame == 8) {
			explosions.shift();
			i--
		}
	}
}

checkShips = function() {
	if(ships.length <= player.score/700) {
		makeShip(Math.random()*-300-150);
		makeShip(Math.random()*300+canvas.width+150);
	}
}

makeShip = function(x) {
	ships.push({
		x:x,
		y:Math.random()*canvas.height,
		xv:0,
		yv:0,
		maxV:r=Math.random()*100+50,
		r:50-r/8,
		shootCount:0,
		health:(230-r)/15*(player.health/600+1),
		angle:0,
		img:document.getElementById('enemyImg'),
		control:1,
		shootSound:new Audio('sounds/shoot.mp3'),
	});
}

hit = function() {
	for(let I=0;I<this.length;I++) {
				b = this[I];
		if(b.r == 3) {
			for(let i=0;i<ships.length;i++) {
				ship = ships[i];
					let dist = Math.sqrt(Math.pow(ship.x-b.x,2)+Math.pow(ship.y-b.y,2));
					if(dist < ship.r) {
						ship.health -= b.damage;
						this.splice(I,1);
						I--;
						if(I < 0) I = 0;
						if(ship.health <= 0) {
							player.score += 100;
							pushExplosion(ship.x,ship.y,ship.r*1.5);
							ships.splice(i,1);
							i--;
							if(i < 0) {i = 0; return;}
						}
						pushExplosion(b.x,b.y,Math.random()*15+20);
					}
			}
		} else {
			let dist = Math.sqrt(Math.pow(player.x-b.x,2)+Math.pow(player.y-b.y,2));
			if(dist < player.r) {
				pushExplosion(b.x,b.y,Math.random()*10+10);
				player.health -= 4;
				this.splice(I,1);
				I--;
				if(I < 0) I = 0;
			}
		}
	}
}

shoot = function(y2,y1,x2,x1,r,d) {
	let angle = Math.atan2(y2-y1,x2-x1);
	bullets.push({
		x:x1,
		y:y1,
		xv:300*Math.cos(angle),
		yv:300*Math.sin(angle),
		r:r,
		damage:d,
	});
	let shoot = new Audio('sounds/shoot.mp3');
	shoot.play();
}

bullet = function() {
	for(let i=0;i<bullets.length;i++) {
		let b = bullets[i];
		b.x += b.xv/FPS;
		b.y += b.yv/FPS;
		
		if(b.x > canvas.width || b.x < 0 || b.y > canvas.height || b.y < 0) {
			bullets.splice(i,1);
			i--;
		}
		
		ctx.beginPath();
		ctx.arc(b.x,b.y,b.r,0,2*Math.PI);
		ctx.fill();
	}
}

addHealth = function(num) {
	player.health += num;
	if(player.health > 100) player.health = 100;
}

addControl = function(num) {
	player.control += num;
}

makePowerUps = function() {
	if(this.length <= 1 && player.score >= 0 && Math.random() < 0.007) {
		this.push({
			x:Math.random()*(canvas.width-200)+100,
			y:Math.random()*(canvas.height-190)+110,
			r:0,
			type:t=pickPowerUp(),
			img:document.getElementById(t),
		});
	}
	for(let i=0;i<this.length;i++) {
		let pu = this[i];
		if(pu.r < 12) pu.r += 10/FPS;
		let dist = Math.sqrt(Math.pow(player.x-pu.x,2)+Math.pow(player.y-pu.y,2));
		if(dist < player.r+15) {
			if(pu.type == 'health') addHealth(15);
			else if(pu.type == 'control') addControl(1);
			else if(pu.type == 'damage') player.damage += .4;
			powerUps.splice(i,1);
		}
	}
}

pickPowerUp = function() {
	if(player.damage < 8 || player.control < 90) {
		if(player.damage > 6) player.damage = 6;
		else if(player.control > 115) player.control = 115;
		let r;
		if(player.health > 90) r = Math.floor(Math.random()*2+1);
		else r = Math.floor(Math.random()*3);
		if(r == 2) return 'control';
		else if(r == 1) return 'damage';
		else if(r == 0) return 'health';
	} else return 'health';
}

drawPowerUps = function() {
	ctx.fillStyle = 'lightgrey';
	ctx.beginPath();
	ctx.arc(this.x,this.y,this.r*1.5,0,2*Math.PI);
	ctx.fill();
	ctx.drawImage(this.img,this.x-this.r,this.y-this.r,this.r*2,this.r*2);
}

display = function() {
	ctx.fillStyle = 'white';
	ctx.font = '40px Impact';
	ctx.textAlign = 'center';
	ctx.fillText(player.score,canvas.width/2,100);
	if(player.score > player.best) {
		player.best = player.score;
		localStorage.setItem('GalacticCollapseBest',player.best);
	}
	ctx.font = '20px Impact';
	ctx.fillText('Best: '+player.best,window.innerWidth-150,80);
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width,40);
	ctx.fillStyle = 'lightgreen';
	ctx.fillRect(0,0,player.health/100*canvas.width,40);
}

requestAnimationFrame(startGame);