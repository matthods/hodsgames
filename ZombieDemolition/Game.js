let canvas = document.getElementById('canvas').getContext('2d');

canvasX = 0;
canvasY = 0;

canvasSize = function() {
	document.getElementById('canvas').style.height = canvasY+'px';
	document.getElementById('canvas').style.width = canvasX+'px';
	
	if(canvasY < window.innerHeight && canvasX < window.innerWidth) {
		canvasY += 10000/250;
		canvasX += 19355/250;
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

playBtn = function() {
	document.getElementById('Playbtn').style.display = 'none';
	document.getElementById('ready').style.display = 'none';
	document.querySelector('body').style.background = '#c03434';
	document.getElementById('canvas').style.display = 'block';
	document.getElementById('canvas').style.border = 'none';
	document.getElementById('header').style.display = 'none';
	document.getElementById('canvas').style.cursor = 'none';
	document.getElementById('highScoreLine').style.display = 'none';
	document.getElementById('howToPlay').style.display = 'none';
	
	startGame();
}

let player = {
	x:133,
	y:90,
	speed:.3,
	moveRight: false,
	moveLeft: false,
	ammo: 15,
	health: 1001,
	alive: playerImage,
	score: 0,
	scoreY: 40,
	highScore: localStorage.getItem('saveScore'),
	highScoreY: 10,
}

if(player.highScore == null) {
	player.highScore = 0;
}
document.getElementById('highScore').innerHTML = player.highScore;

let leftBullet = {
	x: 1,
	y: 122,
	shoot: false,
	speed: .6,
}

let rightBullet = {
	x: 1,
	y: 122,
	shoot: false,
	speed: .6,
}

let ammo = {
	x: -15,
	y: 0,
	width: 0,
}

let leftZombie = {
	x:-200,
	y:75,
	speed: .25,
}

let rightZombie = {
	x:445,
	y:75,
	speed: .25,
}

let heart1 = {
	x:240,
	y:10,
	image: fullHeartImage,
}

let heart2 = {
	x:260,
	y:10,
	image: fullHeartImage,
}

let heart3 = {
	x:280,
	y:10,
	image: fullHeartImage,
}

let rightMegaGun = {
	x:10,
	y:10,
	width: 15,
}

let leftMegaGun = {
	x:70,
	y:10,
}

let rightMegaBullet = {
	x:10,
	y:10,
	speed: .4,
	shoot:false,
}

let leftMegaBullet = {
	x:10,
	y:10,
	speed: .4,
	shoot: false,
}

let leftBabyZombie = {
	x:-100,
	y:100,
	speed: .4,
}

let rightBabyZombie = {
	x:400,
	y:100,
	speed: .4,
}

let rightGiantZombie = {
	x:500,
	y:50,
	speed: .05,
	health: 30,
}

let leftGiantZombie = {
	x:-200,
	y:50,
	speed: .05,
	health: 30,
}

let end = 0;

startGame = function() {
	
	canvas.clearRect(0,0,300,450);
	canvasSize();
	setTimeout(startGame,4);
	drawGame();
	changePlayerPosition();
}

drawGame = function() {
	let playerImage = document.getElementById('playerImage');
	let ammoImage = document.getElementById('ammoImage');
	let rightGiantZombieImage = document.getElementById('rightGiantZombieImage');
	let leftGiantZombieImage = document.getElementById('leftGiantZombieImage');
	let leftZombieImage = document.getElementById('leftZombieImage');
	let rightZombieImage = document.getElementById('rightZombieImage');
	let fullHeartImage = document.getElementById('fullHeartImage');
	let halfHeartImage = document.getElementById('halfHeartImage');
	let emptyHeartImage = document.getElementById('emptyHeartImage');
	let playerDeadImage = document.getElementById('playerDeadImage');
	let leftBabyZombieImage = document.getElementById('leftBabyZombieImage');
	let rightBabyZombieImage = document.getElementById('rightBabyZombieImage');
	//let rightMegaBulletImage = document.getElementById('rightMegaBulletImage');
	//let leftMegaBulletImage = document.getElementById('leftMegaBulletImage');
	//let rightMegaGunImage = document.getElementById('rightMegaGunImage');
	//let leftMegaGunImage = document.getElementById('leftMegaGunImage');
	
	canvas.fillStyle = "#0040ff";
	canvas.fillRect(0,0,300,140);
	canvas.fillStyle = "#331a00";
	canvas.fillRect(0,140,300,10);
	canvas.fillStyle = 'black';
	canvas.fillRect(leftBullet.x,leftBullet.y,2,2);
	canvas.fillRect(rightBullet.x,rightBullet.y,2,2);
	canvas.fillStyle = 'grey';
	canvas.fillRect(leftBullet.x+2,leftBullet.y,2,2);
	canvas.fillRect(rightBullet.x-2,rightBullet.y,2,2);
	canvas.fillStyle = 'black';
	canvas.font = '20px behold';
	canvas.fillText('AMMO:  ', 10,24);
	canvas.font = '20px fantasy';
	canvas.fillText(player.ammo , 90,25);
	canvas.fillStyle = '#a20000';
	canvas.fillRect(100,30,end,100);
	canvas.fillStyle = 'white';
	canvas.font = '25px notable';
	canvas.textAlign = 'center';
	canvas.fillText(player.score, 150,player.scoreY);
	canvas.font = '15px wq';
	canvas.fillText('Best: ' + player.highScore, 150,player.highScoreY);
	canvas.textAlign = 'left';
	canvas.fillStyle = 'black';
	canvas.fillRect(rightGiantZombie.x +20, rightGiantZombie.y -15, 32,10);
	canvas.fillRect(leftGiantZombie.x+20, leftGiantZombie.y -15, 32,10);
	canvas.fillStyle = 'red';
	canvas.fillRect(rightGiantZombie.x +21, rightGiantZombie.y -14, rightGiantZombie.health, 8);
	canvas.fillRect(leftGiantZombie.x +21, leftGiantZombie.y -14, leftGiantZombie.health, 8);

	
	canvas.drawImage(player.alive,player.x,player.y,30,60);
	canvas.drawImage(leftZombieImage, leftZombie.x,leftZombie.y,35,75);
	canvas.drawImage(leftBabyZombieImage, leftBabyZombie.x,leftBabyZombie.y,20,50);
	canvas.drawImage(rightZombieImage, rightZombie.x,rightZombie.y,35,75);
	canvas.drawImage(rightBabyZombieImage, rightBabyZombie.x,rightBabyZombie.y,20,50);
	canvas.drawImage(ammoImage, ammo.x,ammo.y,ammo.width,15);
	canvas.drawImage(heart1.image, heart1.x,heart1.y,15,20);
	canvas.drawImage(heart2.image, heart2.x,heart2.y,15,20);
	canvas.drawImage(heart3.image, heart3.x,heart3.y,15,20);
	canvas.drawImage(rightGiantZombieImage, rightGiantZombie.x,rightGiantZombie.y,80,100);
	canvas.drawImage(leftGiantZombieImage, leftGiantZombie.x,leftGiantZombie.y,80,100);
	//canvas.drawImage(rightMegaBulletImage,rightMegaBullet.x,rightMegaBullet.y,15,15);
	//canvas.drawImage(leftMegaBulletImage,leftMegaBullet.x,leftMegaBullet.y,15,15);
	//canvas.drawImage(rightMegaGunImage,rightMegaGun.x,rightMegaGun.y,rightMegaGun.width,20);
	//canvas.drawImage(leftMegaGunImage,leftMegaGun.x,leftMegaGun.y,15,20);
}


document.onkeydown = function(event){
	if(event.keyCode == 123) {
      return false;
    } else if(event.ctrlKey && event.shiftKey && event.keyCode == 73) {
      return false;
    } else if(event.ctrlKey && event.keyCode == 85) {
      return false;
    }
	if(event.keyCode === 39)     //right arrow
		player.moveRight = true;
	else if(event.keyCode === 37) //left arrow
		player.moveLeft = true;
	if(event.keyCode === 88) {//x
		//rightMegaBullet.x = rightMegaGun.x;
		//rightMegaBullet.y = rightMegaGun.y;
		rightBullet.shoot = true;
		//rightMegaBullet.shoot = true;
	}
		if(event.keyCode === 90) {//z
		//leftMegaBullet.x = leftMegaGun.x;
		//leftMegaBullet.y = leftMegaGun.y;
		leftBullet.shoot = true;
		//leftMegaBullet.shoot = true;
		
	}
}

 
document.onkeyup = function(event){
        if(event.keyCode === 39)
            player.moveRight = false;
        else if(event.keyCode === 37)
            player.moveLeft = false;
}
 
changePlayerPosition = function(){

		if(leftBullet.x < player.x - 300) {
			leftBullet.shoot = false;
			leftBullet.y = 122;
		}
		
		if(leftBullet.shoot === false) {
			leftBullet.x = player.x;
		}
		
		if(leftBullet.x + 30 < -3) {
			leftBullet.y = -10;
		}
		
		if(rightBullet.x > player.x + 300) {
			rightBullet.shoot = false;
			rightBullet.y = 122;
		}
		
		if(rightBullet.shoot === false) {
			rightBullet.x = player.x + 23;
		}
		
		if(rightBullet.x - 30 > 301) {
			rightBullet.y = -10;
		}
	
        if(player.moveRight) {
            player.x += player.speed;
		if(leftBullet.shoot === false && rightBullet.shoot === false) {
			leftBullet.x = player.x;
			rightBullet.x = player.x + 23;
		}
		}

        if(player.moveLeft) {
			
            player.x -= player.speed;
			if(player.moveRight === false) {
		if(leftBullet.shoot === false && rightBullet.shoot === false) {
			leftBullet.x = player.x;
			rightBullet.x = player.x + 23;
		}
		}
		}
		if(leftBullet.shoot) {
			if(player.moveLeft) {
				if(player.moveRight === false)
				if(leftBullet.x > player.x -1) {
				if(leftBullet.x < player.x ) {
				player.ammo -= 1;
			}
			}
			}
			
			if(player.moveLeft === false) {
			if(player.moveRight === false) {
				if(leftBullet.x > player.x -1) {
				if(leftBullet.x < player.x +.2){
				player.ammo -= 1;
			}
			}
			}
			}
			
			if(player.moveLeft === true) {
			if(player.moveRight === true) {
				if(leftBullet.x > player.x -1) {
				if(leftBullet.x < player.x +.2){
				player.ammo -= 1;
			}
			}
			}
			}
			
			if(player.moveRight) {
				if(player.moveLeft === false) {
				if(leftBullet.x > player.x -1) {
				if(leftBullet.x < player.x ){
				player.ammo -= 1;
			}
			}
			}
			}
			leftBullet.x -= leftBullet.speed*2;
		}
		
		if(rightBullet.shoot) {
			if(player.moveRight) {
				if(player.moveLeft === false) {
				if(rightBullet.x > player.x +25) {
				if(rightBullet.x < player.x +25.6) {
				player.ammo -= 1;
			}
			}
			}
			}
			if(player.moveRight === false)	{
			if(player.moveLeft === false)		{
				if(rightBullet.x > player.x +24) {
				if(rightBullet.x < player.x +24.6){
				player.ammo -=1;
			}
			}
			}
			}
			if(player.moveRight === true)	{
			if(player.moveLeft === true)		{
				if(rightBullet.x > player.x +24) {
				if(rightBullet.x < player.x +24.6){
				player.ammo -=1;
			}
			}
			}
			}
			
			if(player.moveLeft) {
				if(player.moveRight === false) {
				if(rightBullet.x > player.x +25.7) {
				if(rightBullet.x < player.x +26.9){
				player.ammo -= 1;
			}
			}
			}
			}
			rightBullet.x += rightBullet.speed*2;
		}

			
			if(player.ammo < 0) {
				player.ammo = 0;
				leftBullet.shoot = false;
				rightBullet.shoot = false;
				leftBullet.x = player.x +10;
				rightBullet.x = player.x +10;
				leftBullet.y = 122;
				rightBullet.y = 122;
				}
		
		if(player.x < 0) {
			player.x = 0;
			player.moveLeft = false;
		}
		if(player.x > 270) {
			player.x = 270;
			player.moveRight = false;
		}
		
		let randomAmmo = Math.random();
		let ammoPosition = 4;
		
		if(player.ammo === ammoPosition +1 || player.ammo === ammoPosition) {
			ammo.y = 10;
			if(randomAmmo < .5) {
			ammo.x = Math.random() * 70 + 20;
		}
		if(randomAmmo > .5) {
			ammo.x = Math.random() * 70 + 200;
		}
		}
		if(player.ammo < ammoPosition) {
			ammo.width = 10;
			ammo.y = 130;
		}
		
		
	
		if(player.y + 40 === ammo.y) {
		if(player.x > ammo.x -20 && player.x < ammo.x) {
		
			player.ammo += 4;
			ammo.width = 0;
			ammo.x = -10;
			ammo.y = 10;
			if(player.score > 500) {
				player.ammo +=2;
			}
			if(player.score > 1000) {
				player.ammo +=1;
			}
			if(player.score > 2000) {
				player.ammo +=1;
			}
			if(player.score > 3000){
				player.ammo +=1;
			}
		}
		}
		
		//newGun();
		levelUp();
		zombieActions();
}

levelUp = function() {
	if(player.score > 100){
	leftBabyZombie.x += leftBabyZombie.speed;
	rightBabyZombie.x -= rightBabyZombie.speed;
	}
	if(player.score === 100 || player.score === 110) {
	canvas.font = '35px butcherman';
	canvas.fillStyle = 'red';
	canvas.textAlign = 'center';
	canvas.fillText('LEVEL UP!', 150,70);
	canvas.textAlign = 'left';
	leftBabyZombie.x = Math.random() * -350 - 50;
	rightBabyZombie.x = Math.random() * 350 + 350;
	if(player.health < 1000) {
		player.health = 1000;
	}
	}
	
		if(leftBullet.x - 10 < leftBabyZombie.x) {
		if(leftBullet.y > 100) {
		leftBabyZombie.x = Math.random() * -500 - 200;
		player.score +=15;
		leftBullet.y = -10;
	}
	}
	if(rightBullet.x -17 > rightBabyZombie.x) {
		if(rightBullet.y > 100) {
		rightBabyZombie.x = Math.random() * 500 + 600;
		player.score +=15;
		rightBullet.y = -10;
	}
	}
	if(leftBabyZombie.x > player.x -11) {
		leftBabyZombie.x = player.x -11;
		player.health -= .7;
	}
	if(rightBabyZombie.x < player.x +8) {
		rightBabyZombie.x = player.x +8;
		player.health -= .7;
	}
	
	
	
	
	if(player.score > 500){
	leftGiantZombie.x += leftGiantZombie.speed;
	rightGiantZombie.x -= rightGiantZombie.speed;
	}
	if(player.score === 500 || player.score === 505 || player.score === 510) {
	canvas.font = '35px butcherman';
	canvas.fillStyle = 'red';
	canvas.textAlign = 'center';
	canvas.fillText('LEVEL UP!', 150,70);
	canvas.textAlign = 'left';
	leftGiantZombie.x = Math.random() * -200 - 80;
	rightGiantZombie.x = Math.random() * 200 + 300;
	if(player.health < 1000) {
		player.health = 1000;
	}
	}
	
		if(leftBullet.x - 40 < leftGiantZombie.x) {
		if(leftBullet.y > 100) {
		leftBullet.y = -10;
		leftGiantZombie.health -= 10;
	}
	}
	if(leftGiantZombie.health === 0) {
		leftGiantZombie.x = Math.random() * -250 - 100;
		leftGiantZombie.health = 30;
		player.score += 50;
	}
	if(rightBullet.x -30 > rightGiantZombie.x) {
		if(rightBullet.y > 100) {
		rightBullet.y = -10;
		rightGiantZombie.health  -= 10;
	}
	}
	if(rightGiantZombie.health === 0) {
		rightGiantZombie.x = Math.random() * 200 + 350;
		rightGiantZombie.health = 30;
		player.score += 50;
	}
	if(leftGiantZombie.x > player.x -45) {
		leftGiantZombie.x = player.x -45;
		player.health -= 2;
	}
	if(rightGiantZombie.x < player.x-5) {
		rightGiantZombie.x = player.x-5;
		player.health -= 2;
	}
	if(player.score > 1000) {
		if(player.score < 1050) {
		canvas.font = '35px butcherman';
		canvas.fillStyle = 'red';
		canvas.textAlign = 'center';
		canvas.fillText('LEVEL UP!', 150,70);
		canvas.textAlign = 'left';
		if(player.health < 1000) {
		player.health = 1000;
	}
		}
		rightGiantZombie.speed = .07;
		leftGiantZombie.speed = .07;
		rightBabyZombie.speed = .47;
		leftBabyZombie.speed = .47;
		rightZombie.speed = .29;
		leftZombie.speed = .29;
	}
	if(player.score > 2000) {
		if(player.score < 2050) {
		canvas.font = '35px butcherman';
		canvas.fillStyle = 'red';
		canvas.textAlign = 'center';
		canvas.fillText('LEVEL UP!', 150,70);
		canvas.textAlign = 'left';
		if(player.health < 1000) {
		player.health = 1000;
	}
		}
		rightGiantZombie.speed = .09;
		leftGiantZombie.speed = .09;
		rightBabyZombie.speed = .5;
		leftBabyZombie.speed = .5;
		rightZombie.speed = .35;
		leftZombie.speed = .35;
	}
	if(player.score > 3000) {
		if(player.score < 3050) {
		canvas.font = '35px butcherman';
		canvas.fillStyle = 'red';
		canvas.textAlign = 'center';
		canvas.fillText('LEVEL UP!', 150,70);
		canvas.textAlign = 'left';
		if(player.health < 1000) {
		player.health = 1000;
	}
		}
		rightGiantZombie.speed = .12;
		leftGiantZombie.speed = .12;
		rightBabyZombie.speed = .6;
		leftBabyZombie.speed = .6;
		rightZombie.speed = .4;
		leftZombie.speed = .4;
	}
}

newGun = function () {
	
	let randomMega = Math.random();
	
	if(player.score === 90) {
		if(randomMega <= .5) {
			rightMegaGun.x = Math.random() * 70 + 20;
		}
		if(randomMega > .5) {
			rightMegaGun.x = Math.random() * 70 + 200;
		}
		}
		if(player.score > 90) {
			rightMegaGun.width = 15;
			rightMegaGun.y = 91;
	}
	if(player.x > rightMegaGun.x -23 && player.x < rightMegaGun.x+10) {
		if(player.y < rightMegaGun.y) {
			rightMegaGun.x = player.x +22;
			rightMegaGun.y = player.y +18;
			leftMegaGun.x = player.x - 8;
			leftMegaGun.y = player.y +18;
			
		if(leftMegaBullet.shoot) {
			leftMegaBullet.x -= leftMegaBullet.speed;
			if(leftMegaBullet.y > 100){
			rightMegaBullet.y = 10;
			rightMegaBullet.x = 10;
			rightMegaBullet.shoot = false;
	}
	}
		if(rightMegaBullet.shoot) {
			rightMegaBullet.x += rightMegaBullet.speed;
			if(rightMegaBullet.y > 100){
			leftMegaBullet.shoot = false;
			leftMegaBullet.y = 10;
			leftMegaBullet.x = 10;
	}
	}
		}
		}
	if(rightMegaGun.x === player.x +22) {
		leftBullet.shoot = false;
		rightBullet.shoot = false;
		
		player.ammo = 1;
	}
}

zombieActions = function() {
	if(heart1.image === emptyHeartImage) {
	if(player.score > player.highScore) {
		player.highScore = player.score;
	}
	}
	leftZombie.x += leftZombie.speed;
	rightZombie.x -= rightZombie.speed;
	
	if(leftBullet.x - 10 < leftZombie.x) {
		if(leftBullet.y > 100) {
		leftZombie.x = Math.random()* -200 - 100;
		player.score +=10;
		leftBullet.y = -10;
	}
	}
	if(rightBullet.x -25 > rightZombie.x) {
		if(rightBullet.y > 100) {
		rightZombie.x = Math.random()*200 +400;
		player.score +=10;
		rightBullet.y = -10;
	}
	}
	
	if(player.score > player.highScore) {
		player.highScore = player.score;
		localStorage.setItem('saveScore',player.highScore);
		player.highScore = localStorage.getItem('saveScore');
		player.highScore = parseInt(player.highScore);
	}
	
	if(leftZombie.x > player.x -13) {
		leftZombie.x = player.x -13;
		player.health -= 1;
	}
	if(rightZombie.x < player.x +8) {
		rightZombie.x = player.x +8;
		player.health -= 1;
	}

	if(player.health === 1000) {
		heart3.image = fullHeartImage;
		heart2.image = fullHeartImage;
		heart1.image = fullHeartImage;
	}

	if(player.health < 833.33) {
		heart3.image = halfHeartImage;
	}
	if(player.health < 666.66) {
		heart3.image = emptyHeartImage;
	}
	if(player.health < 500) {
		heart2.image = halfHeartImage;
	}
	if(player.health < 333.33) {
		heart2.image = emptyHeartImage;
	}
	if(player.health < 166.66) {
		heart1.image = halfHeartImage;
	}
	if(player.health < 0) {
		heart1.image = emptyHeartImage;
		endScreen();
	}
}

endScreen = function() {
	

	canvas.fillStyle = 'white';
	canvas.font = '20px pangolin';
	canvas.fillText('YOU DIED!',120,60);
	player.x = 135;
	player.alive = playerDeadImage;
	leftZombie.x = 85;
	leftZombie.y = 40;
	rightZombie.x = 205;
	rightZombie.y = 40;
	leftBabyZombie.x = 70;
	leftBabyZombie.y = 70;
	rightBabyZombie.x = 230;
	rightBabyZombie.y = 70;
	leftGiantZombie.x = 0;
	leftGiantZombie.y = 50;
	rightGiantZombie.x = 240;
	rightGiantZombie.y = 50;
	end = 120;
	leftBullet.shoot = false;
	rightBullet.shoot = false;
	player.scoreY = 85;
}

howTo = function() {
	canvas.fillStyle = 'black';
	canvas.font = '10px';
	canvas.fillText('- Use the left and right arrow keys to move.', 10,15);
	canvas.fillText('- Use the key "X" to shoot right and the key "Z" to shoot left.', 10,25);
	canvas.fillText('- You can only shoot from each side every couple seconds.',10,35);
	canvas.fillText('If you try to shoot before then, the gun will not fire.',16,45);
	canvas.fillText('- Kill the zombies to gain points.',10,55);
	canvas.fillText('Both the Normal Zombies and the Baby Zombies take one',16,65);
	canvas.fillText('hit to kill. The Giant Zombies take three hits.',16,75);
	canvas.fillText('- ZOMBIE DEMOLITION progressivly gets harder as your', 10, 85);
	canvas.fillText('points go up, introducing each zombie one by one and', 16,95);
	canvas.fillText('eventually speeding them up.', 16,105);
	canvas.fillText('- When your ammo count gets down to 3, an ammo pack will', 10,115);
	canvas.fillText('show up somehwere on the screen. Collecting it will give you', 16,125);
	canvas.fillText('more ammo.',16,135);
	canvas.fillText('- You keep playing until you die. CAN YOU GET PAST 4000!', 10,145);
}