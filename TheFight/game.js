let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let FPS;

let canvasY = 0;
let canvasX = 0;

canvasSize = function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ground = canvas.height-80;
}

let ground = canvas.height-80;

const mullet = document.getElementById('mullet');
const plant = document.getElementById('plant');
const blob = document.getElementById('blob');


let players = [];

const friction = .85;

let startTime;
startGame = function(timeStamp) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	startTime = startTime || timeStamp;
	FPS = 1000/(timeStamp-startTime);
	if(canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
		canvasSize();
	}
	ctx.fillStyle = 'rgb(170,170,170)';
	ctx.fillRect(0,ground-30,canvas.width,canvas.height-ground+30);
	if(players.length == 2) {
		for(let i=0;i<players.length;i++) {
			move.call(players[i]);
		}
		for(let i=0;i<players.length;i++) {
			draw.call(players[i]);
		}
	}
	startTime = timeStamp;
	requestAnimationFrame(startGame);
}

document.onkeydown = function(event) {
	if(players.length == 2) {
	if(players[0].dead == false) {
		if(event.keyCode == 37) {
			players[0].left = true;
		}
		if(event.keyCode == 38) {
			players[0].jump = true;
		}
		if(event.keyCode == 39) {
			players[0].right = true;
		}
		if(event.keyCode == 40) {
			players[0].duck = true;
		}
		if(players[0].duck == false) {
			if(players[0].kick == false) {
				if(event.keyCode == 188) {
					players[0].kick = true;
					players[0].frame = 0;
				}
				if(players[0].jab == false) {
					if(event.keyCode == 77) {
						players[0].jab = true;
						players[0].frame = 0;
					}
				}
			}
			if(event.keyCode == 78) {
				players[0].block = true;
			}
		}
		if(event.keyCode == 190 && players[0].charge >= 100 && players[1].useCharge == false) {
			players[0].useCharge = true;
		}
	}
	
	if(players[1].dead == false) {
		if(event.keyCode == 65) {
			players[1].left = true;
		}
		if(event.keyCode == 87) {
			players[1].jump = true;
		}
		if(event.keyCode == 68) {
			players[1].right = true;
		}
		if(event.keyCode == 83) {
			players[1].duck = true;
		}
		if(players[1].duck == false) {
			if(players[1].kick == false) {
				if(event.keyCode == 67) {
					players[1].kick = true;
					players[1].frame = 0;
				}
				if(players[1].jab == false) { 
					if(event.keyCode == 86) {
						players[1].jab = true;
						players[1].frame = 0;
					}
				}
			}
			if(event.keyCode == 66) {
				players[1].block = true;
			}
		}
		if(event.keyCode == 88 && players[1].charge >= 100 && players[0].useCharge == false) {
			players[1].useCharge = true;
		}
	}
	}
	if(event.keyCode == 123) {
      return false;
    } else if(event.ctrlKey && event.shiftKey && event.keyCode == 73) {
      return false;
    } else if(event.ctrlKey && event.keyCode == 85) {
      return false;
    }
}

document.onkeyup = function(event) {
	if(players.length == 2) {
	if(players[0].dead == false) {
		if(event.keyCode == 37) {
			players[0].left = false;
		}
		if(event.keyCode == 38) {
			players[0].jump = false;
		}
		if(event.keyCode == 39) {
			players[0].right = false;
		}
		if(players[0].duck) {
			if(event.keyCode == 40) {
				players[0].up = false;
			}
		}
		if(players[0].kick == false && players[0].block && players[0].duck == false) {
			if(event.keyCode == 78) {
				players[0].up = false;
			}
		}
	}
	
	if(players[1].dead == false) {
		if(event.keyCode == 65) {
			players[1].left = false;
		}
		if(event.keyCode == 87) {
			players[1].jump = false;
		}
		if(players[1].duck) {
			if(event.keyCode == 83) {
				players[1].up = false;
			}
		}
		if(event.keyCode == 68) {
			players[1].right = false;
		}
		if(players[1].kick == false && players[1].block && players[1].duck == false) {
			if(event.keyCode == 66) {
				players[1].up = false;
			}
		}
	}
	}
}

let moveNum,playerDist;

move = function() {
	if(this.health <= 0) {
		this.dead = true;
		this.health = 0;
		this.left = this.right = false;
	} else {
		this.charge += 5/FPS;
		if(this.charge > 100) {
			this.charge = 100;
		}
	}
	if(this == players[0]) moveNum=1;
	else moveNum=0;
	if(this.jumping == false) {
		this.xv *= friction;
	} else {
		this.xv *= friction+.1;
	}
	if(this.left) this.xv -= 2000/FPS;
	if(this.right) this.xv += 2000/FPS;
	if(this.charge == 100 && this.useCharge && this.frame == 11) {
		this.yv = -2800;
		this.jumping = true;
	}
	if(this.jump && this.jumping == false) {
		this.jumping = true;
		this.jump = false;
		this.yv = -500;
	}
	if(this.y < ground-this.height || this.y > ground-this.height) {
		this.jumping = true;
	}
	this.x += this.xv/FPS;
	this.y += this.yv/FPS;
	if(this.jumping) {
		this.yv += 650/FPS;
		if(this.y+this.height > ground) {
			this.jumping = false;
			this.jump = false;
			this.y = ground-this.height;
			this.yv = 0;
		}
	}
	if(this.dead) action.call(this,'Death',true,this.deathFrms,this.deathSpd,0,0,0,0);
	else if(this.dead == false) {
		if(this.useCharge) {
				useCharge.call(this,'Charge',14,0.1,40);
		} else {		/*img,hold,frms,spd,mom,range,damage,needen,*/
			if(this.kick) action.call(this,'Kick',false,this.kickFrms,this.kickSpd,0,180,this.kickDamage,15);
			else if(this.jab) action.call(this,'Jab',false,this.jabFrms,this.jabSpd,0,200,this.jabDamage,10);
			if(this.duck) action.call(this,'Duck',true,this.duckFrms,this.duckSpd,0,0,0,0);
			else if(this.block) action.call(this,'Block',true,this.blockFrms,this.blockSpd,0,0,0,0);
		}
				if(players[moveNum].dead == false && this.y > 110 && players[moveNum].y > 110) {
					if(this.x+this.width/1.5 > players[moveNum].x && this.x+this.width < players[moveNum].x+players[moveNum].width) {
						this.xv = 0;
						this.x = players[moveNum].x-players[moveNum].width/1.5;
						players[moveNum].x += 150/FPS;
					} else if(this.x+this.width > players[moveNum].x+players[moveNum].width && this.x < players[moveNum].x+players[moveNum].width/1.5) {
						this.xv = 0;
						this.x = players[moveNum].x+players[moveNum].width/1.5;
						players[moveNum].x -= 150/FPS;
					}
				}
	}
	if(this.x+this.width < 0) this.x = -this.width, this.xv = 0;
	if(this.x+this.width > canvas.width) this.x = canvas.width-this.width, this.xv = 0;
	playerDist = Math.sqrt(Math.pow((this.x+this.width)-(players[moveNum].x+players[moveNum].width),2),Math.pow((this.y+this.height/2)-(players[moveNum].y+players[moveNum].height/2),2));
}

action = function(img,hold,frames,spd,momentum,range,damage,needen) {
	this.frameCount += 1/FPS;
	if(this.frameCount == 0.01+1/FPS && hold == false) {
		if(this.charge >= needen) this.charge -= needen;
		else this.kick = false, this.jab = false, this.frameCount = 0.01;
		return;
	}
	if(this.frameCount > spd) {
		if(this.frame < frames && this.up) {
			this.frame++;
			this.frameCount = 0;
		} else if(this.frame > 0 && this.up == false) {
			this.frame--;
			this.frameCount = 0;
		} else if(this.up == true && hold == false) {
			if(this.frameCount >= spd*10) this.up = false;
			if(players[moveNum].dead == false && playerDist < range) {
				if(players[moveNum].duck == false && img == 'Jab' || img == 'Kick') {
					if(players[moveNum].block) damage /= 3;
					if(this.frameCount >= spd && this.frameCount-spd < 1/FPS) players[moveNum].health -= damage, this.charge += needen+3;
					ctx.fillStyle = 'rgb('+(255-damage*2)+',100,100)';
					ctx.textAlign = 'center';
					ctx.font = '40px impact';
					ctx.fillText('-'+10*Math.round(damage*10),players[moveNum].x+players[moveNum].width,players[moveNum].y);
				}
			}
		}
	}
	if(this.frame == 0 && this.up == false) {
		this.kick = false;
		this.jab = false;
		this.block = false;
		this.duck = false;
		if(this.type == 'mullet') {
			this.img = mullet;
		} else if(this.type == 'plant') {
			this.img = plant;
		} else if(this.type == 'blob') {
			this.img = blob;
		}
		this.up = true;
		this.frameCount = 0.01;
		this.frame = 0;
	} else {
		if(this.frame > frames) {
			this.frame = frames;
		}
		this.img = document.getElementById(this.type+img+this.frame);
	}
}

let x = y = 0;

useCharge = function(img,frames,spd,damage) {
	if(this.type == 'mullet') {
		this.frameCount += 1/FPS;
		if(this.frameCount > spd && this.frame < frames) {
			this.frame++;
			this.frameCount = 0;
		}
		this.img = document.getElementById(img+this.frame);
		if(this.frame >= 12) {
			this.charge = 0;
		}
		if(this.y < 0) {
			ctx.fillStyle = 'rgba(0,0,0,.2)';
			ctx.beginPath();
			ctx.ellipse(this.x+this.width,ground,100-this.y/100,10-this.y/1000,0,0,2*Math.PI);
			ctx.fill();
		} else if(this.y == ground-this.height && this.frame == frames) {
			this.img = mullet;
			this.useCharge = false;
			if(playerDist <= 300) {
				if(players[moveNum].type == 'blob' && players[moveNum].block) {
					players[moveNum].health -= (65-playerDist/8)/1.4;
				} else players[moveNum].health -= 65-playerDist/8;
			}
			this.frame = 0;
		}
	} else if(this.type == 'plant') {
		if(x == 0) {
			x = players[moveNum].x+players[moveNum].width;
			y = players[moveNum].y+110;
			players[moveNum].health -= 15;
			this.charge = 0;
		}
		players[moveNum].xv = 0;
		players[moveNum].yv -= 10/FPS;
		players[moveNum].jump = false;
		this.frameCount += 1/FPS;
		if(this.x+100 < x && this.x+this.actualWidth-90 > x) {
			if(this.y < y-this.frameCount*30 && this.y+this.height > y-this.frameCount) {
				this.health += 30;
				if(this.health > 100) {
					this.health = 100;
				}
				this.useCharge = false;
				x = y = 0;
			}
		}
		if(y-this.frameCount < -30) {
			this.useCharge;
			x = y = 0;
		}
	} else if(this.type == 'blob') {
		this.frameCount += 1/FPS;
		if(this.frameCount > 0.05 && this.frame < 2) {
			this.frame++;
			this.frameCount = 0;
		} else if(this.frame == 2) {
			ctx.fillStyle = 'rgb(255,0,0)';
			if(this.x+this.width < players[moveNum].x+players[moveNum].width) {
				ctx.fillRect(this.x+this.width,this.y+165,this.frameCount*10000,20);
			} else {
				ctx.fillRect(this.x+this.width,this.y+165,-this.frameCount*10000,20);
			}
			if(players[moveNum].y+players[moveNum].height > this.y+20+165 && players[moveNum].y < this.y+165) {
				if(players[moveNum].duck) {
					if(players[moveNum].type != 'blob') {
						if(players[moveNum].block) players[moveNum].health -= 4/FPS;
						else players[moveNum].health -= 12/FPS;
					}
				} else if(players[moveNum].block) players[moveNum].health -= 4/FPS;
					else players[moveNum].health -= 12/FPS;
			}
		}
		this.img = document.getElementById('blobCharge'+this.frame);
		if(this.frameCount > 6) {
			this.frameCount = 0;
			this.charge = 0
			this.useCharge = false;
			this.frame = 0;
			this.img = blob;
		}
	}
}

let drawNum;

draw = function() {
	if(this == players[0]) drawNum=1;
	else drawNum=0;
	if(this.x > players[drawNum].x && this.dead == false) {
		ctx.save();
		ctx.translate(this.x+this.actualWidth/20,this.y);
		ctx.scale(-1,1);
		ctx.drawImage(this.img,0,0,-this.actualWidth,this.height);
		ctx.restore();
	} else {
		ctx.drawImage(this.img,this.x,this.y,this.actualWidth,this.height);
	}
	if(this.charge == 100 && this.dead == false) {
		this.chargeCount += 1/FPS;
		if(this.chargeCount > .07) {
			this.chargeCount = 0;
			this.chargeFrame++;
			if(this.chargeFrame > 5) {
				this.chargeFrame = 0;
			}
		}
		ctx.drawImage(document.getElementById('charge'+this.chargeFrame),this.x,this.y,this.actualWidth,this.height);
	}
	ctx.fillStyle = 'black';
	ctx.fillRect(drawNum*(canvas.width/1.7)+canvas.width/30,36,canvas.width/3,48);
	ctx.fillStyle = 'rgb(240,10,10)';
	ctx.fillRect(drawNum*(canvas.width/1.7)+canvas.width/30+4,40,this.health*canvas.width/300-this.health/12,40);
	ctx.fillStyle = 'rgb(240,110,110)';
	ctx.fillRect(drawNum*(canvas.width/1.7)+canvas.width/30+4,65,this.health*canvas.width/300-this.health/12,15);
	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.arc(drawNum*(canvas.width/1.7)+canvas.width/2.95,116,30,0,2*Math.PI);
	ctx.fill();
	ctx.fillRect(drawNum*(canvas.width/1.7)+canvas.width/30,106,canvas.width/3.5,20);
	ctx.fillStyle = 'rgb(100,255,100)';
	ctx.fillRect(drawNum*(canvas.width/1.7)+canvas.width/30+4,110,this.charge*canvas.width/350-this.charge/12,12);
	if(this.charge == 100) {
		ctx.fillStyle = 'rgb(100,255,100)';
		ctx.beginPath();
		ctx.arc(drawNum*(canvas.width/1.7)+canvas.width/2.95,116,25,0,2*Math.PI);
		ctx.fill();
	}
	ctx.fillStyle = 'black';
	ctx.fillRect(this.x+this.width-2,this.y+this.height/2-2,4,4);
	ctx.fillRect(this.x+this.width-2,this.y+this.height/2-2,4,4);
	if(players[drawNum].type == 'plant' && players[drawNum].useCharge) {
		ctx.fillStyle = 'rgb(20,200,20,.4)';
		ctx.beginPath();
		ctx.arc(x,y-players[drawNum].frameCount*30,30,0,2*Math.PI);
		ctx.fill();
	}
	if(players[drawNum].dead) {
		document.getElementById('playAgainBtn').style.display = 'block';
		ctx.font = '50px impact';
		ctx.fillStyle = 'rgb(150,20,20)';
		ctx.fillText('WINNER',this.x+this.width,this.y);
	}
}

makePlayer = function(which,t,aW,h,x,img,duckFrms,duckSpd,jabFrms,jabSpd,jabDamage,kickFrms,kickSpd,kickDamage,blockFrms,blockSpd,deathFrms,deathSpd) {
	players[which] = {
		type:t,
		width:aW/2,
		actualWidth:aW,
		height:h,
		x:(x*-1+1)*canvas.width-350*(x*-1+1),
		y:ground-h,
		left:false,
		right:false,
		jump:false,
		jumping:false,
		duck:false,
		kick:false,
		jab:false,
		block:false,
		up:true,
		charge:0,
		useCharge:false,
		chargeFrame:0,
		chargeCount:0,
		xv:0,
		yv:0,
		img:img,
		frame:0,
		frameCount:0.01,
		duckFrms:duckFrms,
		duckSpd:duckSpd,
		jabFrms:jabFrms,
		jabSpd:jabSpd,
		jabDamage:jabDamage,
		kickFrms:kickFrms,
		kickSpd:kickSpd,
		kickDamage:kickDamage,
		blockFrms:blockFrms,
		blockSpd:blockSpd,
		deathFrms:deathFrms,
		deathSpd:deathSpd,
		health:100,
		dead:false,
	};
}

playAgain = function() {
	players = [];
	document.getElementById('player1Choice').style.visibility = 'hidden';
	document.getElementById('player2Choice').style.visibility = 'visible';
	document.getElementById('playAgainBtn').style.display = 'none';
	document.getElementById('keys').style.visibility = 'visible';
}

playerChose = function(avtr,whichPlyr) {
	if(avtr == 'mullet') {
		makePlayer(whichPlyr,'mullet',300,300,whichPlyr,mullet,5,0.014,3,0.01,3,8,0.014,10,2,0.02,18,0.06);
	} else if(avtr == 'plant') {
		makePlayer(whichPlyr,'plant',300,300,whichPlyr,plant,6,0.032,6,0.02,4.5,4,0.04,6,5,0.03,11,0.1);
	} else if(avtr == 'blob') {
		makePlayer(whichPlyr,'blob',300,300,whichPlyr,blob,3,0.04,4,0.025,4,4,0.03,7,8,0.01,6,0.1);
	}
}

player2Chose = function() {
	document.getElementById('player2Choice').style.visibility = 'hidden';
	document.getElementById('player1Choice').style.visibility = 'visible';
		
}
player1Chose = function() {
	document.getElementById('player1Choice').style.visibility = 'hidden';
	document.getElementById('keys').style.visibility = 'hidden';
}

requestAnimationFrame(startGame);