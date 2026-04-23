let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let FPS;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
	x:canvas.width/2,
	y:canvas.height/2-20,
	xv:0,
	xr:213,
	yr:296,
	img:document.getElementById('max'),
	mask: {
		img:'mask',
		width:243*2,
		height:153*2,
	},
	highScore:localStorage.getItem('maskUpBest'),
};

if(player.highScore == null) {
	player.highScore = 0;
	localStorage.setItem('maskUpBest',0);
}

let gameSpeed = 300;

player.move = function() {
	this.mask.x += gameSpeed/FPS;
	if(gameSpeed > 0 && this.mask.x > canvas.width-100-this.mask.width/2 || gameSpeed < 0 && this.mask.x < 100-this.mask.width/2) {
		player.putOnMask();
	}
	if(this.img == document.getElementById('skikus')) {
		if(this.xv <= 0) {
			if(this.xv > -Math.abs(gameSpeed)/3-150) {
				this.xv -= Math.abs(gameSpeed)/FPS;
			}
			if(this.x < 300) {
				this.xv = 1;
			}
		} else {
			if(this.xv < Math.abs(gameSpeed)/3+150) {
				this.xv += Math.abs(gameSpeed)/FPS;
			}
			if(this.x > canvas.width-300) {
				this.xv = -1;
			}
		}
		this.x += this.xv/FPS;
	}
};

let dist,absDist;

player.putOnMask = function() {
	dist = this.mask.x+this.mask.width/2-this.x;
	dist -= gameSpeed/100;
	absDist = Math.abs(dist);
	this.mask.well = '';
	if(absDist < 70) {
		this.mask.well = 'Ok';
		if(absDist < 15) this.mask.well = 'Perfect', this.combo++;
		else if(absDist < 40) this.mask.well = 'Great';
		else if(absDist < 55) this.mask.well = 'Good', this.combo = 1;
		else if(absDist < 70) this.mask.well = 'Ok', this.combo = 1;
		this.score += 100*this.combo;
		this.mask.img = 'mask';
	} else if(absDist >= 70 && absDist < 120) {
		this.mask.well = 'closeFail';
		this.mask.img = 'leftMask';
	} else {
		this.mask.well = 'Fail';
		this.mask.img = 'fallMask';
	}
	if(dist < -40) {
		if(gameSpeed > 0) {
			this.mask.closeness = 'Early';
		} else {
			this.mask.closeness = 'Late';
		}
	} else if(dist > 40) {
		if(gameSpeed > 0) {
			this.mask.closeness = 'Late';
		} else {
			this.mask.closeness = 'Early';
		}
	}
	this.mask.put = true;
};

player.afterMask = function() {
	dist = this.mask.x+this.mask.width/2-this.x;
	absDist = Math.abs(dist);
	this.count -= 1/FPS;
	this.mask.count += 1/FPS;
	if(this.mask.well != 'closeFail' && this.mask.well != 'Fail') {
		if(this.mask.frame < 3) {
			if(this.mask.count >= .1) {
				this.mask.frame += 1
				this.mask.count = 0;
			}
		}
	} else if(this.mask.well == 'closeFail') {
		if(this.mask.frame < 9) {
			if(this.mask.count >= .05) {
				this.mask.frame += 1
				this.mask.count = 0;
			}
		}
		this.count += .7/FPS;
	} else {
		if(this.mask.frame < 9) {
			if(this.mask.count >= .05) {
				this.mask.frame += 1
				this.mask.count = 0;
			}
		}
		this.count += .7/FPS;
	}
	if(absDist > 3 && this.mask.well != 'Fail') this.mask.x += (-dist*15)/FPS;
	else if (this.mask.well == 'Fail') {
		this.mask.x += (gameSpeed*this.count/2)/FPS;
		this.mask.y += (1-this.count)*14;
	}
	if(this.count < .5) {
		this.alpha *= (this.count+.5);
		if(this.count <= 0) {
			if(this.mask.well != 'closeFail' && this.mask.well != 'Fail') {
				this.mask.frame = 0;
				if(Math.random() < .5) {
					this.mask.x = -this.mask.width;
					gameSpeed = Math.abs(gameSpeed);
					gameSpeed += 30;
				} else {
					this.mask.x = canvas.width;
					gameSpeed = -Math.abs(gameSpeed);
					gameSpeed -= 30;
				}
				this.alpha = 1;
				this.count = 1;
				this.mask.put = false;
				this.mask.img = 'mask';
				this.mask.closeness = '';
				if(this.score >= 5000 && this.img != document.getElementById('skikus')) {
					this.img = document.getElementById('skikus');
					if(gameSpeed < 0) {
						gameSpeed = -250;
					} else {
						gameSpeed = 250;
					}
				}
			} else {
				this.start = false;
			}
		}
	}
}

player.drawFace = function() {
	ctx.drawImage(this.img,this.x-this.xr,this.y-this.yr,this.xr*2,this.yr*2);
};

player.drawMask = function() {
	if(this.mask.well != 'closeFail' && this.mask.well != 'Fail' || this.mask.x+this.mask.width/2 >= canvas.width/2) {
		ctx.drawImage(document.getElementById(this.mask.img+this.mask.frame),this.mask.x,this.mask.y,this.mask.width,this.mask.height);
	} else {
		ctx.save();
		ctx.translate(this.mask.x,this.mask.y);
		ctx.scale(-1,1);
		ctx.drawImage(document.getElementById(this.mask.img+this.mask.frame),-this.mask.width,0,this.mask.width,this.mask.height);
		ctx.restore();
	}
};

player.display = function() {
	ctx.fillStyle = 'white';
	ctx.textAlign = 'center';
	ctx.font = '60px impact';
	ctx.fillText(this.score,canvas.width/2,60);
	if(this.score > this.highScore) {
		this.highScore = this.score;
		localStorage.setItem('maskUpBest',this.score);
	}
	if(this.mask.put) {
		if(this.mask.well != 'closeFail' && this.mask.well != 'Fail') {
			ctx.font = '80px impact';
			ctx.fillStyle = 'rgb(255,255,255,'+this.alpha+')';
			ctx.fillText(this.mask.well,200,100);
		}
		ctx.fillText('100',canvas.width-220,100);
		if(this.combo > 1) ctx.fillText('x'+this.combo,canvas.width-120,100);
		ctx.fillStyle = 'rgb(255,105,105,'+this.alpha+')';
		ctx.font = '60px impact';
		ctx.fillText(this.mask.closeness,this.x,canvas.height-2);
	}
};

document.onkeydown = function(event) {
	if(event.keyCode == 32) {
		if(player.start) {
			if(player.mask.put == false) {
				player.mask.put = true, player.putOnMask();
			}
		} else {
			player.start = true;
			player.begin();
		}
	}
	
	if(event.keyCode == 123) {
      return false;
    } else if(event.ctrlKey && event.shiftKey && event.keyCode == 73) {
      return false;
    } else if(event.ctrlKey && event.keyCode == 85) {
      return false;
    }
};

document.onmousedown = function(event) {
	player.start = true;
	player.begin();
};

window.addEventListener('resize',function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	player.x = canvas.width/2;
	player.y = canvas.height/2;
});

let startTime;

player.begin = function() {
	this.x = canvas.width/2;
	gameSpeed = 300;
	this.img = document.getElementById('max');
	this.count = 1;
	this.alpha = 1;
	this.combo = 1;
	this.score = 0;
	this.mask.put = false;
	this.mask.well = '';
	this.mask.count = 0;
	this.mask.x = -350;
	this.mask.y = canvas.height/2-20;
	this.mask.frame = 0;
	this.mask.closeness = '';
}

startGame = function(timeStamp) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	startTime = startTime || timeStamp;
	FPS = 1000/(timeStamp-startTime);
	player.drawFace();
	if(player.start) {
		if(player.mask.put) player.afterMask();
		else player.move();
		player.drawMask();
		player.display();
	} else {
		ctx.font = '70px impact';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.fillText('Click to Start',canvas.width/2,100);
	}
	ctx.font = '30px impact';
	ctx.fillStyle = 'white';
	ctx.fillText('Best: '+player.highScore,canvas.width-150,30);
	startTime = timeStamp;
	requestAnimationFrame(startGame);
}

requestAnimationFrame(startGame);