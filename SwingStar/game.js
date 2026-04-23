let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize',() => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	if(!player.start) {
		coins = [{x:canvas.width/2,y:canvas.height/3,r:30}];
		ceil.x = course[0] = canvas.width/2;
	}
})

let player = {
	r:10,
	frames:8,
	width:275/4,
	height:485/4,
	start:false,
	hitBox:[{},{},{},{},{}],
	hitBoxR:12,
	showHitBox:false,
	highscore:localStorage.getItem('SwingProBest'),
}

if(player.highscore == null) {
	player.highscore = 0;
}

harpoonImg = document.getElementById('harpoon');
circleBladeImg = document.getElementById('circleBlade');

let ceil = {
	x:canvas.width/2,
	y:120,
	color:'rgb(100,100,100)',
}

let coins = [{x:canvas.width/2,y:canvas.height/3,r:30}];

let weapons = [];

let half = true;
let otherHalf = true;
let startTime;
let FPS = 60;
let averageFPS = [];

let mouseX = canvas.width/2;
let mouseY = canvas.height/2;

let dist
let OgAngle = -1.57;

let blood = [];
let angle, m;
let course = [];

let shootSound = new Audio('sounds/shoot.mp3');
let ceilHitSound = new Audio('sounds/ceilHit.mp3');
let coinSound = new Audio('sounds/coin.mp3');
let sawSound = new Audio('sounds/saw.mp3');
let sawHitSound = new Audio('sounds/sawHit.mp3');

restart();

function runGame(timeStamp) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	startTime = startTime || timeStamp;
	
	half != half;
	if(half) {
		otherHalf != otherHalf;
	}
	if(!player.start) {
		startScreen();
	}
	
	drawCeil();
	move.call(player);
	updateHitBox();
	if(player.shooting) {
		shoot();
	}
	
	weaponsStuff();
	
	for(let i=0;i<player.hitBox.length;i++) {
		coinsCol.call(player.hitBox[i]);
	}
	
	healing();
	
	if(player.lost) {
		lost();
	}
	
	draw();
	
	requestAnimationFrame(runGame);
	FPS = 1000/(timeStamp-startTime);
	startTime = timeStamp;
}

function startScreen() {
	player.swinging = true;
	player.rv *= 1.01;
	ctx.textAlign = 'center';
	ctx.font = '70px Impact';
	ctx.fillStyle = 'white';
	ctx.fillText('Click To Start',canvas.width/2,canvas.height/2);
	
	
	ctx.fillStyle = 'black';
	ctx.font = '40px Impact';
	ctx.fillText('Click To Shoot',canvas.width/4,canvas.height*2/3);
	ctx.fillText('Space To Jump',canvas.width*3/4,canvas.height*2/3);
	
	document.getElementById('canvas').style.cursor = 'default';
	
	if(player.y > canvas.height/2+100) {
		player.y = canvas.height/2+100;
	}
	if(player.rv > 500) {
		player.rv = 500;
	}
}

function start() {
	document.getElementById('canvas').style.cursor = 'none';
	player.start = true;
	player.score = 0;
	player.health = 100;
}

function lost() {
	player.swinging = false;
	player.shooting = false;
	player.jump = false;
	player.allowJump = false;
	
	moreBlood(player.x+Math.random()*50-25,player.y+40,player.xv*Math.random(),Math.random()*-80-50);
			
	player.xv /= 1.004;
	player.yv -= 200/FPS;
}

function restart() {
	player.x = canvas.width/3;
	player.y = canvas.height/2;
	player.xv = 0;
	player.yv = 0;
	player.rv = 0;
	player.frame = 0;
	showHitBox = false;
	player.score = 0;
	player.health = 100;
	ceil.x = canvas.width/2;

	coins = [{x:canvas.width/2,y:canvas.height/3,r:30}];
	course = [canvas.width/2,ceil.y];
}

function updateHitBox() {
	for(let i=2;i<7;i++) {
		player.hitBox[i-2].x = player.x-Math.sin(angle+1.57)*i*(29-player.hitBoxR);
		player.hitBox[i-2].y = player.y+Math.cos(angle+1.57)*i*(29-player.hitBoxR);
	}
}

function drawCeil() {
	ctx.fillStyle = 'rgb(160,160,160)';
	ctx.fillRect(0,ceil.y-70,canvas.width,30);
	ctx.fillStyle = ceil.color;
	ctx.fillRect(0,ceil.y-40,canvas.width,60);
	
	ctx.fillStyle = 'black';
	ctx.fillRect(0,ceil.y-40,canvas.width,3);
	ctx.fillRect(0,ceil.y-70,canvas.width,3);
	ctx.fillRect(0,ceil.y+20,canvas.width,2);
}

document.onmousemove = function(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

document.onmousedown = function(event) {
	if(!player.start) {
		start();
	}
	shootSound.currentTime = 0;
	shootSound.play();
	player.shooting = true;
	OgAngle = angle = Math.atan2(mouseY-player.y,mouseX-player.x);
	let OgM = Math.sin(OgAngle)/Math.cos(OgAngle);
	ceil.x = (mouseX*OgM-mouseY+ceil.y)/OgM;
	course = [player.x,player.y];
}

document.onmouseup = function(event) {
	player.swinging = false;
	player.shooting = false;
}

document.onkeydown = function(event) {
	if(event.keyCode == 32) {
		player.jump = true;
	} else if(event.keyCode == 123) {
      return false;
    } else if(event.ctrlKey && event.shiftKey && event.keyCode == 73) {
      return false;
    } else if(event.ctrlKey && event.keyCode == 85) {
      return false;
    }
}

document.onkeyup = function(event) {
	if(event.keyCode == 32) {
		player.jump = false;
	}
}

function distance(x1,y1,x2,y2) {
	return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

function shoot() {
	course[0] += 1400*Math.cos(OgAngle)/FPS;
	course[1] += 1400*Math.sin(OgAngle)/FPS;
	if(course[1] <= ceil.y) {
		course[0] = ceil.x;
		course[1] = ceil.y;
		startSwing();
		ceilHitSound.currentTime = 0;
		ceilHitSound.play();
	}
}

function drawRope() {
	ctx.strokeStyle = 'rgb(70,20,20)';
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.setLineDash([10,1,1,1]);
	ctx.moveTo(player.x,player.y);
	ctx.lineTo(course[0],course[1]);
	ctx.stroke();
	
	ctx.save();
	ctx.translate(course[0],course[1]);
	ctx.rotate((OgAngle*2+(angle||OgAngle)-2)/4+Math.PI/2);
	ctx.drawImage(harpoonImg,-129/8,-15-154/8,129/4,154/4);
	ctx.restore();
	
	if(player.swinging) {
		ctx.fillStyle = ceil.color;
		ctx.fillRect(ceil.x-40+(OgAngle+Math.PI/2)*8,ceil.y-35,80,23);
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.setLineDash([2,1,20,2]);
		ctx.moveTo(ceil.x-25+(OgAngle+Math.PI/2)*8,ceil.y-12);
		ctx.lineTo(ceil.x-25+(OgAngle+Math.PI/2)*8+50,ceil.y-12);
		ctx.stroke();
	}
}

function startSwing() {
	angle = Math.atan2(ceil.y-player.y,ceil.x-player.x);
	if(Math.PI/angle < -1.3 && Math.PI/angle > -6) {
		player.rv = player.xv/-Math.sin(angle);
	} else {
		player.rv = player.yv/Math.cos(angle);
	}
	player.swinging = true;
	player.shooting = false;
	dist = distance(ceil.x,ceil.y,player.x,player.y)
	player.allowJump = true;
}

function move() {
	if(player.swinging) {// && dist < Math.sqrt(Math.pow(ceil.x-(player.x+player.xv/FPS),2)+Math.pow(ceil.y-(player.y+player.yv/FPS),2))) {
		angle = Math.atan2(ceil.y-player.y,ceil.x-player.x);
		m = Math.sin(angle)/Math.cos(angle);
		
		if(player.x < ceil.x) {
			player.rv += (1600*(angle+Math.PI/2))/FPS;
		} else if(player.x > ceil.x) {
			player.rv += (1600*(angle+Math.PI/2))/FPS;
		}
		player.rv /= 1.01;
		
		player.xv = player.rv*-Math.sin(angle);
		player.yv = player.rv*Math.cos(angle);
	} else {
		if(player.jump && player.allowJump) {
			player.yv = -400;
			player.jump = false;
			player.allowJump = false;
			player.frame = 2;
		} else {
			player.yv += 400/FPS;
		}
		angle = -1.57;
	}	
	
	this.x += this.xv/FPS;
	this.y += this.yv/FPS;
	
	if(player.y < ceil.y+1) {
		player.yv = -player.yv/5;
		player.y = ceil.y+1;
		player.rv = -player.rv/2;
	}
	if(player.x < 0) {
		player.xv = -player.xv/1.1;
		player.x = player.r;
		player.rv = -player.rv/2;
	} else if(player.x > canvas.width) {
		player.xv = - player.xv/1.1;
		player.x = canvas.width-player.r;
		player.rv = -player.rv/2;
	}
	
	if(player.health <= 0) {
		player.health = 0;
		player.lost = true;
	} else {
		player.lost = false;
	}
	
	if(player.y >= canvas.height+1500) {
		player.lost = player.start = false;
		restart();
	}
}

function weaponsStuff() {
	if(player.start) {
		if(weapons.length < Math.min(player.score*2/7,13)) {
			r = Math.floor(Math.random()*2);
			if(r == 0) {
				addWeapon('gsaw',Math.floor(Math.random()*2)*(canvas.width+500)-250,canvas.height+1000,30,Math.random()*160+280,-Math.random()*(canvas.height/4)-canvas.height/3);
			} else if(r == 1) {
				addWeapon('ssaw',Math.floor(Math.random()*2)*(canvas.width+500)-250,Math.random()*(canvas.height-ceil.y-100)+ceil.y,30,Math.random()*200+400,Math.random()*50-10);
			}
		}
	}
	
	for(let i=0;i<weapons.length;i++) {
		w = weapons[i];
		w.sound.play();
		if(w.x > 0 && w.x < canvas.width && w.y < canvas.height) {
			w.sound.volume = Math.min(w.sound.volume+1/FPS,1);
			if(w.sound.currentTime > 4.1) w.sound.currentTime = 0;
		} else {
			w.sound.volume = Math.max(w.sound.volume-1/FPS,0);
			if(w.sound.volume == 0) w.sound.pause();
		}
		if(!hitWeapons.call(w)) {
			w.hit = false;
		}
		if(!w.hit && sawHitSound.currentTime > .5) {
			sawHitSound.volume = Math.max(sawHitSound.volume-.2/FPS,0);
			if(sawHitSound.volume == 0) sawHitSound.pause();
		}
		drawWeapons.call(w);
		if(moveWeapons.call(w)) {
			weapons.splice(i,1);
			i--;
		}
	}
	for(let i in blood) {
		if(doBlood.call(blood[i])) {
			blood.splice(i,1);
			i--;
		}
	}
}

function addWeapon(type,x,y,r,xv,yv) {
	weapons.push({
		type:type,
		x:x,
		y:y,
		r:r,
		xv:((x+250)/(canvas.width+500))*-xv+xv/2,
		yv:yv,
		s:(x+250)/(canvas.width+500),
		hit:false,
		sound:new Audio('sounds/saw.mp3'),
	});
	weapons[weapons.length-1].sound.volume = 0;
}

function moveWeapons() {
	if(this.y < canvas.height && this.x > 0 && this.x < canvas.width || this.yv > 0 || this.x < 0 && this.xv < 0 || this.x > canvas.width && this.xv > 0) {
		this.yv += 150/FPS;
	}
	
	this.x += this.xv/FPS;
	this.y += this.yv/FPS;
	
	if(this.y > canvas.height+this.r+1000) {
		return true;
	} else if(this.y-this.r < ceil.y) {
		this.y = ceil.y+this.r;
		this.yv = -this.yv;
	}
}

function hitWeapons() {
	for(let i=0;i<player.hitBox.length;i++) {
		p = player.hitBox[i];
		if(distance(this.x,this.y,p.x,p.y) < this.r+player.hitBoxR) {
			if(!this.hit) {
				sawHitSound.currentTime = 0;
				sawHitSound.volume = 1;
				player.health -= 8;
			}
			this.xv = player.xv*1.6;
			this.yv = player.yv*1.3;
			player.health -= 10/FPS;
			sawHitSound.play();
			if(blood.length < 90) {
				moreBlood((this.x+p.x*2)/3+Math.random()*20-10,(this.y+p.y*2)/3+Math.random()*20-10,(this.x-p.x)*(Math.random()+1),Math.random()*-60-60);
				moreBlood((this.x+p.x*2)/3+Math.random()*20-10,(this.y+p.y*2)/3+Math.random()*20-10,(this.x-p.x)*(Math.random()+1),Math.random()*-60-60);
			}
			this.hit = true;
			return true;
		}
	}
}

function moreBlood(x,y,xv,yv) {
	blood.push({
		x:x,
		y:y,
		xv:xv,
		yv:yv,
	});
}

function doBlood() {
	this.yv += 160/FPS;
	if(this.yv >= 350) this.yv = 350;
	
	this.x += this.xv/FPS;
	this.y += this.yv/FPS;
	
	if(this.y >= canvas.height) {
		return true;
	}
	
	ctx.beginPath();
	ctx.fillStyle = 'red';
	ctx.arc(this.x,this.y,3.5,0,2*Math.PI);
	ctx.fill();
}

function drawWeapons() {
	ctx.save();
	ctx.translate(this.x,this.y);
	ctx.rotate(Math.random()*3);
	ctx.drawImage(circleBladeImg,-this.r,-this.r,this.r*2,this.r*2);
	ctx.restore();
	
	ctx.fillStyle = 'rgb(250,10,10)';
	
	if(this.type == 'gsaw') {
		if(this.y-this.r > canvas.height && this.yv < 0) {
			ctx.fillRect(this.x,canvas.height-100,20,50);
			ctx.fillRect(this.x,canvas.height-40,20,20);
		}
	} else if(this.type == 'ssaw') {
		if(this.x/this.xv < 0) {
			if(this.x+this.r < 0 || this.x-this.r > canvas.width) {
				let x = this.s*(canvas.width-120)+50;
				ctx.fillRect(x,this.y-20,20,50);
				ctx.fillRect(x,this.y+40,20,20);
			}
		}
	}
}

let healthCounter;

let limit = Math.random()*5+15;

let health = {
	width:60,
	height:40,
};

function healing() {
	if(healthCounter > limit) {
		avHealth();
	} else {
		if(player.health < 95) {
			if(healthCounter == 0) {
				health.x = Math.random()*(canvas.width-200)+100;
				health.y = Math.random()*(canvas.height-ceil.y-200)+100+ceil.y/2;
			}
			healthCounter += 1/FPS;
			if(player.health < 75) {
				limit -= 1/FPS;
			}
			if(player.health < 55) {
				limit -= 1/FPS;
			}
		} else {
			healthCounter = 0;
		}
	}
}

function avHealth() {
	if(!player.start) {
		healthCounter = 0;
		limit = Math.random()*5+15;
		return;
	}
	for(let i=0;i<player.hitBox.length;i++) {
		if(distance(player.hitBox[i].x,player.hitBox[i].y,health.x,health.y) < player.hitBoxR+40) {
			player.health = Math.min(100,player.health+30);
			healthCounter = 0;
			limit = Math.random()*5+15;
			coinSound.currentTime = 0;
			coinSound.play();
			return;
		}
	}
	
	ctx.setLineDash([]);
	ctx.fillStyle = 'white';
	ctx.fillRect(health.x-health.width/2,health.y-health.height/2,health.width,health.height);
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 3;
	ctx.strokeRect(health.x-health.width/2,health.y-health.height/2,health.width,health.height);
	ctx.fillStyle = 'green';
	ctx.fillRect(health.x-5,health.y-15,10,30);
	ctx.fillRect(health.x-15,health.y-5,30,10);
}

function draw() {
	if(player.swinging || player.shooting) {
		drawRope();
	}
	drawCoins();
	drawPlayer();
	for(let i=0;i<30;i += 1115/canvas.width) {
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.setLineDash([i/10,10-i/10,i/10,i/2,i/14]);
		ctx.lineWidth = 1;
		let sp = i*canvas.width/30;
		ctx.moveTo(sp+(sp-canvas.width/2)/6,ceil.y-25);
		ctx.lineTo(sp,ceil.y+5);
		ctx.stroke();
	}
	drawScoreboard();
}

function drawPlayer() {
	if(!player.lost) {
		if(player.swinging || player.shooting) {
			player.frame = Math.max(player.frame-35/FPS,0);
		} else {
			player.frame = Math.min(player.frame+25/FPS,8);
		}
	} else {
		if(player.frame < 8) {
			player.frame = 8;
		}
		player.frame = Math.min(player.frame+15/FPS,14);
	}
	if(player.xv > 0) {
		drawPDir(false,document.getElementById('playerSwing'+Math.floor(player.frame)),-player.width/2,0);
	} else {
		drawPDir(true,document.getElementById('playerSwing'+Math.floor(player.frame)),player.width/2,0);
	}
	
	if(player.showHitBox) {
		for(let i=0;i<player.hitBox.length;i++) {
			h = player.hitBox[i];
			ctx.setLineDash([]);
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'white';
			ctx.beginPath();
			ctx.arc(h.x,h.y,player.hitBoxR,0,2*Math.PI);
			ctx.stroke();
		}
	}
}

function drawPDir(flip,img,x,y) {
	ctx.save();
	ctx.translate(player.x,player.y);
	ctx.rotate(angle+Math.PI/2);
	if(flip) {
		ctx.scale(-1,1);
		ctx.drawImage(img,x,y,-player.width,player.height);
	} else {
		ctx.drawImage(img,x,y,player.width,player.height);
	}
	ctx.restore();
	
	ctx.fillStyle = 'black';
	ctx.fillRect(mouseX-20,mouseY-3,15,6);
	ctx.fillRect(mouseX+5,mouseY-3,15,6);
	ctx.fillRect(mouseX-3,mouseY-20,6,15);
	ctx.fillRect(mouseX-3,mouseY+5,6,15);
}

function coinsCol() {
	for(let i=0;i<coins.length;i++) {
		c = coins[i];
		if(distance(this.x,this.y,c.x,c.y) < c.r+player.hitBoxR) {
			gotCoin(c);
		}
	}
}

function gotCoin(c) {
	coinSound.currentTime = 0;
	coinSound.play();
	c.x = Math.random()*(canvas.width-120)+60;
	c.y = Math.random()*(canvas.height-ceil.y-120)+ceil.y+60;
	
	if(distance(player.x,player.y,c.x,c.y) < 200) {
		gotCoin(c);
	} else {
		player.score += 1;
	}
}

function drawCoins() {
	for(let i=0;i<coins.length;i++) {
		c = coins[i];
		
		ctx.setLineDash([]);
		ctx.fillStyle = 'rgb(220,220,0)'
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(c.x,c.y,c.r,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
		
		ctx.fillStyle = 'rgb(190,190,0)'
		ctx.beginPath();
		ctx.arc(c.x,c.y,c.r/1.5,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
	}
}

function drawScoreboard() {
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width,ceil.y-70);
	
	ctx.fillRect(canvas.width/2-153,ceil.y-64,306,20);
	ctx.fillStyle = 'rgb(10,200,10)';
	ctx.fillRect(canvas.width/2-150,ceil.y-61,player.health*3,14);
	
	ctx.fillStyle = 'white';
	ctx.font = '30px Impact';
	ctx.fillText(player.score,canvas.width/2,40);
	
	averageFPS.push(FPS);
	if(averageFPS.length > 15) {
		averageFPS.splice(0,1);
	}
	let sum = 0;
	for(let i=0;i<averageFPS.length;i++) {
		sum += averageFPS[i]
	}
	ctx.fillText('FPS: '+Math.round(sum/averageFPS.length),100,40);
	
	if(player.score > player.highscore) {
		player.highscore = player.score;
		localStorage.setItem('SwingProBest',player.score);
	}
	
	ctx.fillText('Best: '+player.highscore,canvas.width-150,40);
}

requestAnimationFrame(runGame);