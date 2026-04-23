const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const FPS = 80;

let canvasX = 0;
let canvasY = 0;

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






let leftPaddle = {
	x: 50,
	y: canvas.height/2-80,
	sizeY: 160,
	sizeX: 20,
	img: document.getElementById('leftPaddle'),
	speed: 0,
	moveUp: false,
	moveDown: false,
	score: 0,
}

let rightPaddle = {
	x: canvas.width-70,
	y: canvas.height/2-80,
	sizeY: 160,
	sizeX: 20,
	img: document.getElementById('rightPaddle'),
	speed: 0,
	moveUp: false,
	moveDown: false,
	strafe: true,
	score: 0,
}

let playersNum = undefined;
let survivalMode = undefined;
let crazyMode = undefined;

let survivalScore = 0;
let survivalCount = 0;

let playerChosen = false;
let challangeChosen = false;
let modeChosen = false;

let ball = {
	x: canvas.width/2,
	y: canvas.height/2,
	size: 10,
	speedY: Math.random(),
	speedX: Math.random(),
	vertBounce: false,
	horBounce: false,
}

if(ball.speedY < .5) {
	ball.speedY = -(Math.random()*70+350)/FPS;
} else {
	ball.speedY = (Math.random()*70+350)/FPS;
}

if(ball.speedX < .5) {
	ball.speedX = -(Math.random()*200+300)/FPS;
} else {
	ball.speedX = (Math.random()*200+300)/FPS;
}

let fogImage = document.getElementById('fog');

let whichChallange = 1;//Math.floor(Math.random()*4);
let challangeTime = 0;
let challangeCount = Math.random()*2+5;

let speedBoost = {
	img: document.getElementById('speedBoost'),
	rightImg: false,
	leftImg: false,
	sizeX: 300,
	sizeY: 200,
	x: canvas.width/2-150,
}

let speedBoostFlip = {
	img: document.getElementById('speedBoostFlip'),
}

let speedBoost1 = {
	y: 5,
}

let speedBoost2 = {
	y: canvas.height-205,
}

let teleport = {
	sizeX: 40,
	sizeY: 100,
}

let teleport1 = {
	x: Math.random()*(canvas.width-1200)+600,
	y: 150,
}

let teleport2 = {
	x: Math.random()*(canvas.width-1200)+600,
	y: 450,
}

let crownImage = document.getElementById('crown');

let playCountDown = true;
let showCountDown = 3;
let countDown = 0;

let gameOver = false;

startGame = function() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	canvasSize();
	movePaddles();
	moveBall();
	if(crazyMode) {
		challanges();
	}
	startNscore();
}

let startInt;

document.onkeydown = function() {
	if(event.keyCode == 123) {
      return false;
    } else if(event.ctrlKey && event.shiftKey && event.keyCode == 73) {
      return false;
    } else if(event.ctrlKey && event.keyCode == 85) {
      return false;
    }
	if(event.keyCode == 87) {
		leftPaddle.moveUp = true;
	} else if(event.keyCode == 83) {
		leftPaddle.moveDown = true;
	}
	
	if(playersNum == 2) {
		if(event.keyCode == 38) {
			rightPaddle.moveUp = true;
		} else if(event.keyCode == 40) {
			rightPaddle.moveDown = true;
		}
	}
}

document.onkeyup = function() {
	if(event.keyCode == 87) {
		leftPaddle.moveUp = false;
	}
	if(event.keyCode == 83) {
		leftPaddle.moveDown = false;
	}
	
	if(playersNum == 2) {
		if(event.keyCode == 38) {
			rightPaddle.moveUp = false;
		}
		if(event.keyCode == 40) {
			rightPaddle.moveDown = false;
		}
	}
}

movePaddles = function() {
	ctx.drawImage(leftPaddle.img,leftPaddle.x,leftPaddle.y,leftPaddle.sizeX,leftPaddle.sizeY);
	ctx.drawImage(rightPaddle.img,rightPaddle.x,rightPaddle.y,rightPaddle.sizeX,rightPaddle.sizeY);

	if(gameOver == false) {
		if(playCountDown == false) {
			if(leftPaddle.moveUp) {
				leftPaddle.speed = -350/FPS;
			} else {
				if(leftPaddle.moveDown == false) {
					leftPaddle.speed = 0;
				}
			}
			
			if(leftPaddle.moveDown) {
				leftPaddle.speed = 350/FPS;
			} else {
				if(leftPaddle.moveUp == false) {
					leftPaddle.speed = 0;
				}
			}
			
			if(leftPaddle.y < 0) {
				leftPaddle.y = 0;
			}
			if(leftPaddle.y > canvas.height-leftPaddle.sizeY) {
				leftPaddle.y = canvas.height-leftPaddle.sizeY;
			}
			
			if(ball.x-ball.size <= leftPaddle.x+leftPaddle.sizeX && ball.x+ball.size >= leftPaddle.x) {
				if(ball.y <= ball.size*3.5 && leftPaddle.y <= ball.size*3.5 || ball.y >= canvas.height-ball.size*3.5 && leftPaddle.y+leftPaddle.sizeY >= canvas.height-ball.size*3.5) {
					leftPaddle.speed = 0;
				}
			}
			
			leftPaddle.y += leftPaddle.speed;
			if(playersNum == 1) {
				if(rightPaddle.strafe == false) {
					if(ball.speedX > 0) {
						if(ball.x > 500) {
							if(rightPaddle.y+rightPaddle.sizeY/2 > ball.y) {
								if(survivalMode != true) {
									rightPaddle.speed = -350/FPS;
								} else {
									if(ball.x > 1200) {
										rightPaddle.y = ball.y-rightPaddle.sizeY/2;
									} else {
										rightPaddle.speed = -Math.abs(ball.speedY);
									}
								}
							}
							if(rightPaddle.y+rightPaddle.sizeY/2 < ball.y) {
								if(survivalMode != true) {
									rightPaddle.speed = 350/FPS;
								} else {
									if(ball.x > 1200) {
										rightPaddle.y = ball.y-rightPaddle.sizeY/2;
									} else {
										rightPaddle.speed = Math.abs(ball.speedY);
									}
								}
							}
						}
					}
				}
				
			} else {
				if(rightPaddle.moveUp) {
					rightPaddle.speed = -350/FPS;
				} else {
					if(rightPaddle.moveDown == false) {
						rightPaddle.speed = 0;
					}
				}
				if(rightPaddle.moveDown) {
					rightPaddle.speed = 350/FPS;
				} else {
					if(rightPaddle.moveUp == false) {
						rightPaddle.speed = 0;
					}
				}
			}
			
			if(ball.x+ball.size >= rightPaddle.x && ball.x-ball.size <= rightPaddle.x+rightPaddle.sizeX) {
				if(ball.y <= ball.size*3.5 && rightPaddle.y <= ball.size*3.5 || ball.y >= canvas.height-ball.size*3.5 && rightPaddle.y+rightPaddle.sizeY >= canvas.height-ball.size*3.5) {
					rightPaddle.speed = 0;
				}
			}
			
			rightPaddle.y += rightPaddle.speed;
			
			if(rightPaddle.y < 0) {
				rightPaddle.y = 0;
			}
			if(rightPaddle.y > canvas.height-rightPaddle.sizeY) {
				rightPaddle.y = canvas.height-rightPaddle.sizeY;
			}
		}
		if(rightPaddle.strafe) {
			if(rightPaddle.y+rightPaddle.sizeY > canvas.height-150) {
				rightPaddle.speed = -350/FPS;
			}
			if(rightPaddle.y < 150) {
				rightPaddle.speed = 350/FPS;
			}
		}
		if(ball.speedX <= 0 || ball.x <= 500) {
			rightPaddle.strafe = true;
		} else {
			rightPaddle.strafe = false;
		}
	}
}

moveBall = function() {
	ctx.beginPath();
	ctx.arc(ball.x,ball.y,ball.size,0,2*Math.PI);
	ctx.strokeStyle = 'white';
	ctx.lineWidth = '5';
	ctx.stroke();
	ctx.fillStyle = 'black';
	ctx.fill();
	
	if(playCountDown == false) {
		if(gameOver == false) {
			if(ball.x < 500 || ball.x > canvas.width-500) {
				document.getElementById('canvas').style.background = 'black';
				document.querySelector('body').style.background = '#c03434';
			}
			ball.x += ball.speedX;
			ball.y += ball.speedY;
			
			if(ball.y-ball.size < 0) {
				ball.y = ball.size;
				ball.speedY = -ball.speedY;
			}
			if(ball.y+ball.size > canvas.height) {
				ball.y = canvas.height-ball.size;
				ball.speedY = -ball.speedY;
			}
			
			if(ball.x > canvas.width+200) {
				leftPaddle.score += 1;
			}
			
			if(ball.x < -200) {
				rightPaddle.score += 1;
			}
			
			if(ball.x > canvas.width+200 || ball.x < -200) {
				if(survivalMode) {
					gameOver = true;
				}
				teleport1.x = Math.random()*(canvas.width-1200)+600;
				teleport2.x = Math.random()*(canvas.width-1200)+600;
				rightPaddle.sizeY = 160;
				leftPaddle.sizeY = 160;
				rightPaddle.x = canvas.width-70;
				leftPaddle.x = 50;
				leftPaddle.y = canvas.height/2-leftPaddle.sizeY/2;
				rightPaddle.y = canvas.height/2-rightPaddle.sizeY/2;
				ball.x = canvas.width/2;
				ball.y = canvas.height/2;
				challangeTime = 0;
				challangeCount = Math.random()*2+5;
				whichChallange = Math.floor(Math.random()*4);
				playCountDown = true;
				ball.speedY = Math.random();
				if(ball.speedY < .5) {
					ball.speedY = -(Math.random()*70+350)/FPS;
				} else {
					ball.speedY = (Math.random()*70+350)/FPS;
				}
				ball.speedX = Math.random();
				if(ball.speedX < .5) {
					ball.speedX = -(Math.random()*200+240)/FPS;
				} else {
					ball.speedX = (Math.random()*200+240)/FPS;
				}
			}
			
			if(ball.x-ball.size <= leftPaddle.x+leftPaddle.sizeX && ball.x+ball.size >= leftPaddle.x) {
				if(ball.horBounce == false) {
					if(ball.y+ball.size < leftPaddle.y && ball.y-ball.size > leftPaddle.y-ball.size*2.3-10) {
						ball.y = leftPaddle.y-ball.size*2.3-10;
						ball.speedY = -ball.speedY;
						ball.vertBounce = true;	
					} else {
						ball.vertBounce = false;
					}
					
					if(ball.y+ball.size < leftPaddle.y+leftPaddle.sizeY+ball.size*2.3+10 && ball.y-ball.size > leftPaddle.y+leftPaddle.sizeY) {
						ball.y = leftPaddle.y+leftPaddle.sizeY+ball.size*2.3+10;
						ball.speedY = -ball.speedY;
						ball.vertBounce = true;
					} else {
						ball.vertBounce = false;
					}
				}
				
				if(ball.y+ball.size >= leftPaddle.y && ball.y-ball.size <= leftPaddle.y+leftPaddle.sizeY) {
					if(ball.vertBounce == false) {
						ball.speedX = -ball.speedX;
						if(ball.speedY > 0) {
							ball.speedY += (Math.random()*20+20)/FPS;
						} else {
							ball.speedY -= (Math.random()*20-20)/FPS;
						}
						ball.speedX += (Math.random()*7+15)/FPS;
						ball.horBounce = true;
					}
				} else {
					ball.horBounce = false;
				}
			}
			
			if(ball.x+ball.size <= rightPaddle.x+rightPaddle.sizeX && ball.x+ball.size >= rightPaddle.x) {
				if(ball.horBounce == false) {
					if(ball.y+ball.size < rightPaddle.y && ball.y-ball.size > rightPaddle.y-ball.size*2.3-10) {
						ball.y = rightPaddle.y-ball.size*2.3-10;
						ball.speedY = -ball.speedY;
						ball.vertBounce = true;
					} else {
						ball.vertBounce = false;
					}
					
					if(ball.y+ball.size < rightPaddle.y+rightPaddle.sizeY+ball.size*2.3+10 && ball.y-ball.size > rightPaddle.y+rightPaddle.sizeY) {
						ball.y = rightPaddle.y+rightPaddle.sizeY+ball.size*2.3+10;
						ball.speedY = -ball.speedY;
						ball.vertBounce = true;
					} else {
						ball.vertBounce = false;
					}
				}
				
				if(ball.y+ball.size >= rightPaddle.y && ball.y-ball.size <= rightPaddle.y+rightPaddle.sizeY) {
					if(ball.vertBounce == false) {
						ball.speedX = -ball.speedX;
						if(ball.speedY > 0) {
							ball.speedY += (Math.random()*20+20)/FPS;
						} else {
							ball.speedY -= (Math.random()*20+20)/FPS;
						}
						ball.speedX -= (Math.random()*7+15)/FPS;
						ball.horBounce = true;
					} 
				} else {
					ball.horBounce = false;
				}
			}
		}
	}
}

challanges = function() {
	challangeTime += 1/FPS;
	if(challangeTime >= challangeCount) {
		if(whichChallange == 0) {
			ctx.drawImage(fogImage,300,-100,canvas.width-600,canvas.height+200);
			if(playersNum == 1) {
				if(ball.x > 200 && ball.x < canvas.width-400) {
					rightPaddle.strafe = true;
				}
			}
			if(challangeTime >= challangeCount+10) {
				challangeTime = 0;
				challangeCount = Math.random()*2+5;
				whichChallange = Math.ceil(Math.random()*3);
			}
		}
		if(whichChallange == 1) {
				if(ball.x > speedBoost.x+speedBoost.sizeX+40) {
					speedBoost.rightImg = false;
					speedBoost.leftImg = true;
				} 
				if(ball.x < speedBoost.x-40){
					speedBoost.leftImg = false;
					speedBoost.rightImg = true;
				}
				if(speedBoost.rightImg) {
					ctx.drawImage(speedBoostFlip.img,speedBoost.x,speedBoost1.y,speedBoost.sizeX,speedBoost.sizeY);
					ctx.drawImage(speedBoostFlip.img,speedBoost.x,speedBoost2.y,speedBoost.sizeX,speedBoost.sizeY);
					if(ball.x >= speedBoost.x && ball.x <= speedBoost.x+speedBoost.sizeX) {
						if(ball.y <= speedBoost1.y+speedBoost.sizeY || ball.y >= speedBoost2.y) {
							ball.speedX += 1.6/FPS;
						}
					}
				}
				if(speedBoost.leftImg) {
					ctx.drawImage(speedBoost.img,speedBoost.x,speedBoost1.y,speedBoost.sizeX,speedBoost.sizeY);
					ctx.drawImage(speedBoost.img,speedBoost.x,speedBoost2.y,speedBoost.sizeX,speedBoost.sizeY);
					if(ball.x >= speedBoost.x && ball.x <= speedBoost.x+speedBoost.sizeX) {
						if(ball.y <= speedBoost1.y+speedBoost.sizeY || ball.y >= speedBoost2.y) {
							ball.speedX -= 1.6/FPS;
						}
					}
				}
			if(ball.speedX >= 650/FPS && ball.speedX <= -650/FPS || challangeTime >= challangeCount+12) {
				challangeTime = 0;
				challangeCount = Math.random()*2+5;
				whichChallange = Math.floor(Math.random()*3);
				if(whichChallange >= 1) whichChallange++;
			}
		}
		if(whichChallange == 2) {
			ctx.lineWidth = '2';
			ctx.strokeStyle = '#54f6ff';
			ctx.fillStyle = '#54f6ff';
			ctx.fillRect(teleport1.x-teleport.sizeX-Math.random()*6-3,teleport1.y-5,10,10);
			ctx.fillRect(teleport1.x+teleport.sizeX-Math.random()*6-3,teleport1.y-5,10,10);
			ctx.fillRect(teleport2.x-teleport.sizeX-Math.random()*6-3,teleport2.y-5,10,10);
			ctx.fillRect(teleport2.x+teleport.sizeX-Math.random()*6-3,teleport2.y-5,10,10);
			
			ctx.beginPath();
			ctx.ellipse(teleport1.x,teleport1.y,teleport.sizeX,teleport.sizeY,0,0,2*Math.PI);
			ctx.ellipse(teleport1.x+Math.random()*10-5,teleport1.y+Math.random()*10-5,teleport.sizeX,teleport.sizeY,0,0,2*Math.PI);
			ctx.ellipse(teleport1.x+Math.random()*10-5,teleport1.y+Math.random()*10-5,teleport.sizeX,teleport.sizeY,0,0,2*Math.PI);
			ctx.ellipse(teleport1.x+Math.random()*10-5,teleport1.y+Math.random()*10-5,teleport.sizeX,teleport.sizeY,0,0,2*Math.PI);
			ctx.ellipse(teleport1.x+Math.random()*10-5,teleport1.y+Math.random()*10-5,teleport.sizeX,teleport.sizeY,0,0,2*Math.PI);
			ctx.stroke();
			ctx.beginPath();
			ctx.ellipse(teleport2.x,teleport2.y,teleport.sizeX,teleport.sizeY,0,0,2*Math.PI);
			ctx.ellipse(teleport2.x+Math.random()*10-5,teleport2.y+Math.random()*10-5,teleport.sizeX,teleport.sizeY,0,0,2*Math.PI);
			ctx.ellipse(teleport2.x+Math.random()*10-5,teleport2.y+Math.random()*10-5,teleport.sizeX,teleport.sizeY,0,0,2*Math.PI);
			ctx.ellipse(teleport2.x+Math.random()*10-5,teleport2.y+Math.random()*10-5,teleport.sizeX,teleport.sizeY,0,0,2*Math.PI);
			ctx.ellipse(teleport2.x+Math.random()*10-5,teleport2.y+Math.random()*10-5,teleport.sizeX,teleport.sizeY,0,0,2*Math.PI);
			ctx.stroke();
			
			if(ball.x-ball.size > teleport1.x-teleport.sizeX+15 && ball.x+ball.size < teleport1.x+teleport.sizeX-15) {
				if(ball.y > teleport1.y-teleport.sizeY && ball.y < teleport1.y+teleport.sizeY) {
					if(ball.speedX > 0) {
						ball.x = teleport2.x+16;
					} else {
						ball.x = teleport2.x-16;
					}
					ball.y = teleport2.y;
					teleport1.x = Math.random()*(canvas.width-600)+300;
				}
			}
			if(ball.x-ball.size > teleport2.x-teleport.sizeX+15 && ball.x+ball.size < teleport2.x+teleport.sizeX-15) {
				if(ball.y > teleport2.y-teleport.sizeY && ball.y < teleport2.y+teleport.sizeY) {
					if(ball.speedX > 0) {
						ball.x = teleport1.x+16;
					} else {
						ball.x = teleport1.x-16;
					}
					ball.y = teleport1.y;
					teleport2.x = Math.random()*(canvas.width-600)+300;
				}
			}
			if(challangeTime >= challangeCount+15) {
				teleport1.x = Math.random()*(canvas.width-1200)+600;
				teleport2.x = Math.random()*(canvas.width-1200)+600;
				challangeTime = 0;
				challangeCount = Math.random()*2+5;
				whichChallange = Math.floor(Math.random()*3);
				if(whichChallange >= 2) whichChallange++;
			}
		}
		if(whichChallange == 3) {
			if(challangeTime < challangeCount+10) {
				if(rightPaddle.sizeY > 90) {
					rightPaddle.sizeY -= 50/FPS;
					rightPaddle.y += 25/ FPS;
				}
				if(leftPaddle.sizeY > 90) {
					leftPaddle.sizeY -= 50/FPS;
					leftPaddle.y += 25/ FPS;
				}
				
				if(rightPaddle.x > canvas.width-270) {
					rightPaddle.x -= 50/FPS;
				}
				if(leftPaddle.x < 250) {
					leftPaddle.x += 50/FPS;
				}
			}
			if(challangeTime >= challangeCount+13) {
				if(rightPaddle.sizeY < 160) {
					rightPaddle.sizeY += 50/FPS;
					rightPaddle.y -= 25/FPS;
				}
				if(rightPaddle.sizeY > 160) {
					rightPaddle.sizeY = 160;
				}
				if(leftPaddle.sizeY < 160) {
					leftPaddle.sizeY += 50/FPS;
					leftPaddle.y -= 25/FPS;
				}
				if(leftPaddle.sizeY > 160) {
					leftPaddle.sizeY = 160;
				}
				
				if(rightPaddle.x < canvas.width-70) {
					rightPaddle.x += 50/FPS;
				}
				if(leftPaddle.x > 50) {
					leftPaddle.x -= 50/FPS;
				}
				if(rightPaddle.x > canvas.width-70) {
					rightPaddle.x = canvas.width-70;
				}
				if(leftPaddle.x < 50) {
					leftPaddle.x = 50;
				}
				
				if(challangeTime >= challangeCount+20) {
					challangeTime = 0;
					challangeCount = Math.random()*2+5;
					whichChallange = Math.floor(Math.random()*3);
				}
			}
		}
	}
}

startNscore = function() {
	if(survivalMode == false) {
		ctx.fillStyle = 'white';
		ctx.font = '200px Courier New';
		ctx.fillText(leftPaddle.score,200,200);
		ctx.fillText(rightPaddle.score,canvas.width-200,200);
		if(rightPaddle.score >= 7) {
			playCountDown = false;
			gameOver = true;
			ctx.font = '80px Courier New';
			ctx.fillText('RED WINS!',canvas.width-350,300);
			ctx.fillText('BLUE LOSES!',350,300);
			ctx.drawImage(crownImage,canvas.width-550,400,350,180);
		}
		if(leftPaddle.score >= 7) {
			playCountDown = false;
			gameOver = true;
			ctx.font = '80px Courier New';
			ctx.fillText('BLUE WINS!',350,300);
			ctx.fillText('RED LOSES!',canvas.width-350,300);
			ctx.drawImage(crownImage,200,400,350,180);
		}
	} else {
		if(gameOver == false) {
			survivalCount += 10/FPS;
			if(survivalCount >= 1) {
				survivalCount = 0;
				survivalScore += 1;
			}
			ctx.fillStyle = 'white';
			ctx.font = '100px Impact';
			ctx.fillText(survivalScore,200,100);
		}
	}
	if(gameOver) {
		document.getElementById('endScreen').style.display = 'block';
		document.getElementById('canvas').style.cursor = 'default';
		ball.y = canvas.height/2;
		playCountDown = false;
		if(survivalMode) {
			ctx.fillStyle = 'white';
			ctx.font = '300px Impact';
			ctx.fillText(survivalScore,canvas.width/2,500);
		}
	}
	playAgain = function() {
		document.getElementById('endScreen').style.display = 'none';
		document.getElementById('canvas').style.cursor = 'none';
		survivalCount = 0;
		survivalScore = 0;
		whichChallange = Math.floor(Math.random()*3);
		challangeTime = 0;
		challangeCount = Math.random()*2+5;
		gameOver = false;
		leftPaddle.score = 0;
		rightPaddle.score = 0;
		playCountDown = true;
	}
	
	goToMenu  = function() {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		document.getElementById('endScreen').style.display = 'none';
		document.getElementById('menu').style.display = 'block';
		document.querySelector('body').style.background = 'black';
		gameOver = false;
		leftPaddle.score = 0;
		rightPaddle.score = 0;
		playCountDown = true;
		clearInterval(startInt);
	}
	
	if(playCountDown) {
		ctx.textAlign = 'center';
		ctx.font = '300px Courier New';
		ctx.fillStyle = 'white';
		ctx.fillText(showCountDown,canvas.width/2,200);
		countDown += 1/FPS;
		if(countDown >= 1) {
			countDown = 0;
			showCountDown -= 1;
			if(showCountDown == 0) {
				showCountDown = 3;
				countDown = 0;
				document.getElementById('canvas').style.background = '#1cc70c';
				playCountDown = false;
			}
		}
	}
}

onePlayer = function() {
	document.getElementById('onePlayerBtn').style.backgroundColor = '#ffce47';
	document.getElementById('twoPlayerBtn').style.backgroundColor = '#fc3a3a';
	playersNum = 1;
	playerChosen = true;
}

twoPlayers = function() {
	document.getElementById('twoPlayerBtn').style.backgroundColor = '#ffce47';
	document.getElementById('onePlayerBtn').style.backgroundColor = '#fc3a3a';
	playersNum = 2;
	playerChosen = true;
}

crazyClick = function() {
	document.getElementById('crazyBtn').style.backgroundColor = '#ffce47';
	document.getElementById('normalBtn').style.backgroundColor = '#fc3a3a';
	crazyMode = true;
	challangeChosen = true;
}

normalClick = function() {
	document.getElementById('normalBtn').style.backgroundColor = '#ffce47';
	document.getElementById('crazyBtn').style.backgroundColor = '#fc3a3a';
	crazyMode = false;
	challangeChosen = true;
}

survivalClick = function() {
	document.getElementById('survivalBtn').style.backgroundColor = '#ffce47';
	document.getElementById('scoreBtn').style.backgroundColor = '#fc3a3a';
	survivalMode = true;
	modeChosen = true;
}

scoreClick = function() {
	document.getElementById('scoreBtn').style.backgroundColor = '#ffce47';
	document.getElementById('survivalBtn').style.backgroundColor = '#fc3a3a';
	survivalMode = false;
	modeChosen = true;
}

playClick = function() {
	if(playerChosen && challangeChosen && modeChosen) {
		document.getElementById('menu').style.display = 'none';
		document.getElementById('canvas').style.cursor = 'none';
		document.querySelector('body').style.background = '#c03434';
		document.getElementById('canvas').style.display = 'block';
		startInt = setInterval(startGame,1000/FPS);
	}
}