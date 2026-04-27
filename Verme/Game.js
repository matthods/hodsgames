let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let canvasY = 0;
let canvasX = 0;

canvasSize = function() {
	document.getElementById('canvas').style.height = canvasY+'px';
	document.getElementById('canvas').style.width = canvasX+'px';
	//document.getElementById('canvas').style.top = canvasY/2+'px';
	
	if(canvasY < window.innerHeight && canvasX < window.innerWidth) {
		canvasY += 100;
		canvasX += 160;
	} else {
		if(canvasX > window.innerWidth) {
			canvasX = window.innerWidth;
			canvasY = canvasX/1.639;
		}
		if(canvasY > window.innerHeight) {
			canvasY = window.innerHeight;
			canvasX = canvasY*1.639;
		}
	}
	document.getElementById('canvas').style.marginLeft = -canvasX/2+'px';
	document.getElementById('canvas').style.marginTop = -canvasY/2+'px';
	
	document.getElementById('customizeBtn').style.left = (window.innerWidth-canvasX)/2+canvasX/7+'px';
	document.getElementById('customizeBtn').style.top = (window.innerHeight-canvasY)/2+canvasY/50+'px';
	document.getElementById('customizeBtn').style.fontSize = canvasX/40+'px';
	
	
	
	
	//document.querySelector('buyArea').style.left = (window.innerWidth-canvasX)/2+canvasX/20+'px';
	//document.getElementsByClassName('buyArea').style.top = (window.innerHeight-canvasY)/2+canvasY/50+'px';
	for(let i=0;i<buyArea.length;i++) {
		if(document.getElementById('color').contains(buyArea[i])) {
			buyArea[i].style.left = (window.innerWidth-canvasX)/2+canvasX/30+'px';
		}
		if(document.getElementById('bodyShape').contains(buyArea[i])) {
			buyArea[i].style.left = (window.innerWidth-canvasX)/2+canvasX/4+'px';
		}
		if(document.getElementById('foodType').contains(buyArea[i])) {
			buyArea[i].style.left = window.innerWidth-canvasX/5-((window.innerWidth-canvasX)/2+canvasX/4)+'px';
		}
		buyArea[i].style.fontSize = canvasX/50+'px';
		buyArea[i].style.width = canvasX/10+'px';
		buyArea[i].style.padding = canvasX/60+'px';
	}
	
	document.getElementById('black').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY/10+'px';
	document.getElementById('white').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY/2.6+'px';
	document.getElementById('blue').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY/1.5+'px';
	document.getElementById('orange').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY/1.05+'px';
	document.getElementById('green').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY*1.24+'px';
	document.getElementById('red').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY*1.53+'px';
	document.getElementById('yellow').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY*1.82+'px';
	
	document.getElementById('blocks').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY/10+'px';
	document.getElementById('circles').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY/2.6+'px';
	document.getElementById('diamonds').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY/1.5+'px';
	document.getElementById('scribbles').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY/1.05+'px';
	document.getElementById('hourGlass').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY*1.24+'px';
	
	document.getElementById('apple').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY/10+'px';
	document.getElementById('orangeFood').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY/2.6+'px';
	document.getElementById('banana').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY/1.5+'px';
	document.getElementById('grape').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY/1.05+'px';
	document.getElementById('watermelon').style.top = (window.innerHeight-canvasY)/2+canvasY/50+canvasY*1.24+'px';
	
	let display = document.getElementsByClassName('display');
	
	for(let i=0;i<display.length;i++) {
		if(document.getElementById('bodyShape').contains(display[i])) {
			display[i].style.backgroundSize = canvasX/6.7+'px';
		} else if (document.getElementById('foodType').contains(display[i])) {
			display[i].style.backgroundSize = canvasX/48+'px';
		}
		display[i].style.padding = canvasX/100+'px';
	}
	
	for(let i=0;i<buyBtn.length;i++) {
		buyBtn[i].style.fontSize = canvasX/50+'px';
	}
}

let buyArea = document.getElementsByClassName('buyArea');

let buyBtn = document.getElementsByClassName('buyBtn');

let player = {
	x: 475, //25*((canvas.width/25)/2)
	y: 310,
	size: 25,
	bodyShape: localStorage.getItem('vermeBodyShape'),
	color: localStorage.getItem('vermeColor'),
	foodType: localStorage.getItem('vermeFoodType'),
	start: false,
	left: false,
	up: false,
	right: false,
	down: false,
	moved: false,
	moveCount: 0,
	length: 5,
	prePos: [],
	dead: false,
	deadCount: 0,
	restart: false,
	score: 0,
	highScore: localStorage.getItem('vermeHighScore'),
}

let changeDirectionSound = new Audio('changeDirectionSound.mp3');
let eatSound = new Audio('eatSound.mp3');
let clickCustBtnSound = new Audio('clickCustBtnSound.mp3');
let dieSound = new Audio('dieSound.mp3');
let restartSound = new Audio('restartSound.mp3');
let buyAreaSound = new Audio('buyAreaSound.mp3');

if(player.foodType == null) {
	player.foodType = 'apple';
}

if(player.bodyShape == null) {
	player.bodyShape = 'block';
}

if(player.color == null) {
	player.color = 'black';
}

if(player.highScore == null) {
	player.highScore = 0;
}

let food = {
	x:Math.floor(Math.random()*(canvas.width/player.size-1))*player.size,
	y:Math.floor(Math.random()*((canvas.height-60)/player.size-1))*player.size+60,
	size: player.size,
	eaten: false,
}

let appleImg = document.getElementById('appleImg');
let orangeImg = document.getElementById('orangeImg');
let bananaImg = document.getElementById('bananaImg');
let grapeImg = document.getElementById('grapeImg');
let watermelonImg = document.getElementById('watermelonImg');

let screenCount = 0;

restart = function() {
	
	restartSound.currentTime = 0;
	restartSound.play();
	
	player.x = 475;
	player.y = 310;
	player.start = false;
	player.length = 5;
	player.prePos = [];
	player.dead = false;
	player.score = 0;
	
	dieSound.currentTime = 0;

	food.x = Math.floor(Math.random()*(canvas.width/player.size-1))*player.size;
	food.y = Math.floor(Math.random()*((canvas.height-60)/player.size-1))*player.size+60;
	food.eaten = false;
}

let startTime;
let passedTime;

startGame = function(timestamp) {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	canvasSize();
	
	startTime = startTime || timestamp;
	
	passedTime = timestamp - startTime;
	passedTime = Math.min(passedTime,100);
	
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	playerDead();
	eat();
	movePlayer();
	
	storeInfo();
	checkCust();
	
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
	if(player.dead == false) {
	if(event.keyCode == 37) {
		if(player.left == false) {
			if(player.moved == false) {
		if(player.right == false) {
			changeDirectionSound.currentTime = 0;
			changeDirectionSound.play();
			player.left = true;
			player.up = false;
			player.right = false;
			player.down = false;
			player.moved = true;
		}
		}
		}
	}
	if(event.keyCode == 38) {
		if(player.up == false) {
			if(player.moved == false) {
		if(player.down == false) {
			changeDirectionSound.currentTime = 0;
			changeDirectionSound.play();
			player.up = true;
			player.left = false;
			player.right = false;
			player.down = false;
			player.moved = true;
		}
		}
		}
	}
	if(event.keyCode == 39) {
		if(player.right == false) {
			if(player.moved == false) {
		if(player.left == false) {
			changeDirectionSound.currentTime = 0;
			changeDirectionSound.play();
			player.right = true;
			player.up = false;
			player.left = false;
			player.down = false;
			player.moved = true;
		}
		}
		}
	}
	if(event.keyCode == 40) {
		if(player.down == false) {
			if(player.moved == false) {
		if(player.up == false) {
			changeDirectionSound.currentTime = 0;
			changeDirectionSound.play();
			player.down = true;
			player.up = false;
			player.right = false;
			player.left = false;
			player.moved = true;
		}
		}
		}
	}
	}
	if(player.start == false) {
		if(document.getElementById('customize').style.display == 'block') {
			document.getElementById('customize').style.display = 'none';
		}
		if(player.dead) {
			player.restart = true;
		}
	}
}

movePlayer = function() {
	
	player.moveCount += 1*passedTime
	
	if(player.moveCount >= 100) {
		if(player.start) {
			player.prePos.push(player.x);
			player.prePos.push(player.y);
		}
		if(player.left) {
			player.x -= player.size;
			player.start = true;
		}
		if(player.up) {
			player.y -= player.size;
			player.start = true;
		}
		if(player.right) {
			player.x += player.size;
			player.start = true;
		}
		if(player.down) {
			player.y += player.size;
			player.start = true;
		}
		player.moveCount = 0;
		if(player.start) {
			for(let i=0;i<player.prePos.length;i+=2) {
				if(player.x == player.prePos[i] && player.y == player.prePos[i+1]) {
					player.dead = true;
				}
			}
		
		
			if(player.x+player.size > canvas.width || player.x < 0 || player.y+player.size > canvas.height || player.y < 60) {
				player.dead = true;
			}
		
			
		}
			player.moved = false;
		
	
		if(player.prePos.length >= player.length*2) {
			player.prePos.shift();
			player.prePos.shift();
		}
	}

	for(let i=0;i<player.prePos.length;i+=2) {
		ctx.fillStyle = player.color;
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 2;
		if(player.bodyShape == 'circle') {
			ctx.beginPath();
			ctx.arc(player.prePos[i]+player.size/2,player.prePos[i+1]+player.size/2,player.size/2,0,2*Math.PI);
			ctx.fill();
			ctx.stroke();
		} else if(player.bodyShape == 'block') {
			ctx.fillRect(player.prePos[i],player.prePos[i+1],player.size,player.size);
			ctx.strokeRect(player.prePos[i],player.prePos[i+1],player.size,player.size);
		} else if(player.bodyShape == 'diamond') {
			ctx.beginPath();
			ctx.moveTo(player.prePos[i],player.prePos[i+1]+player.size/2);
			ctx.lineTo(player.prePos[i]+player.size/2,player.prePos[i+1]);
			ctx.lineTo(player.prePos[i]+player.size,player.prePos[i+1]+player.size/2);
			ctx.lineTo(player.prePos[i]+player.size/2,player.prePos[i+1]+player.size);
			ctx.lineTo(player.prePos[i],player.prePos[i+1]+player.size/2);
			ctx.fill();
			ctx.stroke();
		} else if(player.bodyShape == 'scribble') {
			ctx.beginPath();
			ctx.moveTo(player.prePos[i]+Math.random()*player.size,player.prePos[i+1]+Math.random()*player.size);
			ctx.lineTo(player.prePos[i]+Math.random()*player.size,player.prePos[i+1]+Math.random()*player.size);
			ctx.lineTo(player.prePos[i]+Math.random()*player.size,player.prePos[i+1]+Math.random()*player.size);
			ctx.lineTo(player.prePos[i]+Math.random()*player.size,player.prePos[i+1]+Math.random()*player.size);
			ctx.lineTo(player.prePos[i]+Math.random()*player.size,player.prePos[i+1]+Math.random()*player.size);
			ctx.lineTo(player.prePos[i]+Math.random()*player.size,player.prePos[i+1]+Math.random()*player.size);

			ctx.fill();
			ctx.stroke();
		} else if(player.bodyShape == 'hourGlass') {
			ctx.beginPath();
			ctx.moveTo(player.prePos[i],player.prePos[i+1]);
			ctx.lineTo(player.prePos[i]+player.size,player.prePos[i+1]+player.size);
			ctx.lineTo(player.prePos[i],player.prePos[i+1]+player.size);
			ctx.lineTo(player.prePos[i]+player.size,player.prePos[i+1]);
			ctx.lineTo(player.prePos[i],player.prePos[i+1]);
			ctx.fill();
			ctx.stroke();
		}
	}
	ctx.fillStyle = player.color;
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 2;
	if(player.bodyShape == 'circle') {
		ctx.beginPath();
		ctx.arc(player.x+player.size/2,player.y+player.size/2,player.size/2,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
	} else if(player.bodyShape == 'block') {
		ctx.fillRect(player.x,player.y,player.size,player.size);
		ctx.strokeRect(player.x,player.y,player.size,player.size);
	} else if(player.bodyShape == 'diamond') {
		ctx.beginPath();
		ctx.moveTo(player.x,player.y+player.size/2);
		ctx.lineTo(player.x+player.size/2,player.y);
		ctx.lineTo(player.x+player.size,player.y+player.size/2);
		ctx.lineTo(player.x+player.size/2,player.y+player.size);
		ctx.lineTo(player.x,player.y+player.size/2);
		ctx.fill();
		ctx.stroke();
	} else if(player.bodyShape == 'scribble') {
		ctx.beginPath();
		ctx.moveTo(player.x+Math.random()*player.size,player.y+Math.random()*player.size);
		ctx.lineTo(player.x+Math.random()*player.size,player.y+Math.random()*player.size);
		ctx.lineTo(player.x+Math.random()*player.size,player.y+Math.random()*player.size);
		ctx.lineTo(player.x+Math.random()*player.size,player.y+Math.random()*player.size);
		ctx.lineTo(player.x+Math.random()*player.size,player.y+Math.random()*player.size);
		ctx.lineTo(player.x+Math.random()*player.size,player.y+Math.random()*player.size);
		ctx.lineTo(player.x+Math.random()*player.size,player.y+Math.random()*player.size);
		ctx.fill();
		ctx.stroke();
	} else if(player.bodyShape == 'hourGlass') {
		ctx.beginPath();
		ctx.moveTo(player.x,player.y);
		ctx.lineTo(player.x+player.size,player.y+player.size);
		ctx.lineTo(player.x,player.y+player.size);
		ctx.lineTo(player.x+player.size,player.y);
		ctx.lineTo(player.x,player.y);
		ctx.fill();
		ctx.stroke();
	}
}

eat = function() {
	if(player.x+player.size > food.x && player.x < food.x+food.size && player.y+player.size > food.y && player.y < food.y+food.size) {
		food.eaten = true;
	}
	
	if(food.eaten) {
		eatSound.currentTime = 0;
		eatSound.play();
		food.x = Math.floor(Math.random()*(canvas.width/player.size-1))*player.size;
		food.y = Math.floor(Math.random()*((canvas.height-60)/player.size-1))*player.size+60;
		player.length += 4;
		player.score += 10;
		food.eaten = false;
	}
	
	for(let i=0;i<player.prePos.length;i+=2) {
		if(player.prePos[i]+player.size > food.x && player.prePos[i] < food.x+food.size && player.prePos[i+1]+player.size > food.y && player.prePos[i+1] < food.y+food.size) {
			food.x = Math.floor(Math.random()*(canvas.width/player.size-1))*player.size;
			food.y = Math.floor(Math.random()*((canvas.height-60)/player.size-1))*player.size+60;
		}
	}
	
	if(player.foodType == 'apple') {
		ctx.drawImage(appleImg,food.x-2.5,food.y-5,food.size+5,food.size+5);
	} else if(player.foodType == 'orange') {
		ctx.drawImage(orangeImg,food.x-1,food.y-3,food.size+2,food.size+2);
	} else if(player.foodType == 'banana') {
		ctx.drawImage(bananaImg,food.x-1,food.y-5.5,food.size+2,food.size+7);
	} else if(player.foodType == 'grape') {
		ctx.drawImage(grapeImg,food.x-2,food.y,food.size+4,food.size);
	} else if(player.foodType == 'watermelon') {
		ctx.drawImage(watermelonImg,food.x,food.y,food.size,food.size);
	}
}

playerDead = function() {
	if(player.dead) {
		player.left = false;
		player.right = false;
		player.up = false;
		player.down = false;
		player.start = false;
		
		player.deadCount += 1*passedTime;
		if(dieSound.currentTime == 0) {
			dieSound.play();
		}
		if(dieSound.ended) {
			if(player.restart) {
				restart();
				player.deadCount = 0;
			}
		}
		
		player.restart = false;
	}
}

storeInfo = function() {
	ctx.fillStyle = '#0e1e4a';
	ctx.fillRect(0,0,canvas.width,60);
	
	ctx.textAlign = 'center';
	ctx.fillStyle = 'white';
	ctx.font = '50px impact';
	ctx.fillText(player.score,canvas.width-200,50);
	
	if(player.score > player.highScore) {
		
		player.highScore = player.score;
		localStorage.setItem('vermeHighScore',player.highScore);
	}
	
	if(player.start) {
		ctx.font = '35px impact';
		ctx.fillText('HIGH SCORE '+player.highScore,canvas.width/2,45);
	}
		
	if(player.start == false) {
		screenCount += 1*passedTime
		if(screenCount >= 1600) {
			ctx.fillStyle = 'white';
			ctx.font = '35px impact';
			ctx.fillText('Move To Start',canvas.width/2, 45);
		} else {
			ctx.font = '35px impact';
			ctx.fillText('HIGH SCORE '+player.highScore,canvas.width/2,45);
		}
		if(screenCount >= 2800) {
			screenCount = 0;
		}
	}
	
	if(player.color != localStorage.getItem('vermeColor')) {
		localStorage.setItem('vermeColor',player.color);
	}
	
	if(player.bodyShape != localStorage.getItem('vermeBodyShape')) {
		localStorage.setItem('vermeBodyShape',player.bodyShape);
	}
	
	if(player.foodType != localStorage.getItem('vermeFoodType')) {
		localStorage.setItem('vermeFoodType',player.foodType);
	}
}

noCust = function() {
	
	if(document.getElementById('customize').style.display == 'block') {
		clickCustBtnSound.currentTime = 0;
		clickCustBtnSound.play();
		document.getElementById('customize').style.display = 'none';
	}
}

customize = function() {
	if(player.start == false) {
		clickCustBtnSound.currentTime = 0;
		clickCustBtnSound.play();
		if(document.getElementById('customize').style.display == 'block') {
			document.getElementById('customize').style.display = 'none';
		} else {
			document.getElementById('customize').style.display = 'block';
		}
		
		if(player.dead) {
			player.deadCount = 1200;
			player.restart = true;
		}
	}
	
}

playCustSound = function() {
	buyAreaSound.currentTime = 0;
	buyAreaSound.play();
}

let buyColor = document.getElementsByClassName('buyColor');

let blackBtn = document.getElementById('blackBtn');
bodyBlack = function() {
	if(blackBtn.innerHTML == 'Use') {
		player.color = 'black';
	}
}

let whiteBtn = document.getElementById('whiteBtn');
bodyWhite = function() {
	if(whiteBtn.innerHTML == 'Use') {
		player.color = 'white';
	}
}

let blueBtn = document.getElementById('blueBtn');
bodyBlue = function() {
	if(blueBtn.innerHTML == 'Use') {
		player.color = 'blue';
	}
}

let orangeBtn = document.getElementById('orangeBtn');
bodyOrange = function() {
	if(orangeBtn.innerHTML == 'Use') {
		player.color = 'orange';
	}
}

let greenBtn = document.getElementById('greenBtn');
bodyGreen = function() {
	if(greenBtn.innerHTML == 'Use') {
		player.color = 'lightgreen';
	}
}

let redBtn = document.getElementById('redBtn');
bodyRed = function() {
	if(redBtn.innerHTML == 'Use') {
		player.color = 'red';
	}
}

let yellowBtn = document.getElementById('yellowBtn');
bodyYellow = function() {
	if(yellowBtn.innerHTML == 'Use') {
		player.color = 'yellow';
	}
}

useColor = function() {
	for(let i=0;i<buyColor.length;i++) {
		if(buyColor[i].innerHTML == 'Using') {
			buyColor[i].innerHTML = 'Use';
			buyColor[i].style.background = 'rgba(0,0,0,0)';
		}
	}
}

let buyShape = document.getElementsByClassName('buyShape');

let blockBtn = document.getElementById('blockBtn');
bodyBlocks = function() {
	player.bodyShape = 'block';
}

let circlesBtn = document.getElementById('circlesBtn');
bodyCircles = function() {
	player.bodyShape = 'circle';
}

let diamondsBtn = document.getElementById('diamondsBtn');
bodyDiamonds = function() {
	player.bodyShape = 'diamond';
}

let scribblesBtn = document.getElementById('scribblesBtn');
bodyScribbles = function() {
	player.bodyShape = 'scribble';
}

let hourGlassBtn = document.getElementById('hourGlassBtn');
bodyHourGlass = function() {
	player.bodyShape = 'hourGlass';
}

useShape = function() {
	for(let i=0;i<buyShape.length;i++) {
		if(buyShape[i].innerHTML == 'Using') {
			buyShape[i].innerHTML = 'Use';
			buyShape[i].style.background = 'rgba(0,0,0,0)';
		}
	}
}

let buyFood = document.getElementsByClassName('buyFood');

let appleBtn = document.getElementById('appleBtn');
foodApple = function() {
	player.foodType = 'apple';
}

let orangeFoodBtn = document.getElementById('orangeFoodBtn');
foodOrange = function() {
	player.foodType = 'orange';
}

let bananaBtn = document.getElementById('bananaBtn');
foodBanana = function() {
	player.foodType = 'banana';
}

let grapeBtn = document.getElementById('grapeBtn');
foodGrape = function() {
	player.foodType = 'grape';
}

let watermelonBtn = document.getElementById('watermelonBtn');
foodWatermelon = function() {
	player.foodType = 'watermelon';
}

useFood = function() {
	for(let i=0;i<buyFood.length;i++) {
		if(buyFood[i].innerHTML == 'Using') {
			buyFood[i].innerHTML = 'Use';
			buyFood[i].style.background = 'rgba(0,0,0,0)';
		}
	}
}

checkCust = function() {
	if(player.color == 'black') {
		blackBtn.innerHTML = 'Using';
		blackBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.color == 'white') {
		whiteBtn.innerHTML = 'Using';
		whiteBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.color == 'blue') {
		blueBtn.innerHTML = 'Using';
		blueBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.color == 'orange') {
		orangeBtn.innerHTML = 'Using';
		orangeBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.color == 'lightgreen') {
		greenBtn.innerHTML = 'Using';
		greenBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.color == 'red') {
		redBtn.innerHTML = 'Using';
		redBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.color == 'yellow') {
		yellowBtn.innerHTML = 'Using';
		yellowBtn.style.background = 'rgb(50,155,50)';
	}
	
	if(player.bodyShape == 'block') {
		blockBtn.innerHTML = 'Using';
		blockBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.bodyShape == 'circle') {
		circlesBtn.innerHTML = 'Using';
		circlesBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.bodyShape == 'diamond') {
		diamondsBtn.innerHTML = 'Using';
		diamondsBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.bodyShape == 'scribble') {
		scribblesBtn.innerHTML = 'Using';
		scribblesBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.bodyShape == 'hourGlass') {
		hourGlassBtn.innerHTML = 'Using';
		hourGlassBtn.style.background = 'rgb(50,155,50)';
	}
	
	if(player.foodType == 'apple') {
		appleBtn.innerHTML = 'Using';
		appleBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.foodType == 'orange') {
		orangeFoodBtn.innerHTML = 'Using';
		orangeFoodBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.foodType == 'banana') {
		bananaBtn.innerHTML = 'Using';
		bananaBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.foodType == 'grape') {
		grapeBtn.innerHTML = 'Using';
		grapeBtn.style.background = 'rgb(50,155,50)';
	}
	if(player.foodType == 'watermelon') {
		watermelonBtn.innerHTML = 'Using';
		watermelonBtn.style.background = 'rgb(50,155,50)';
	}
}

requestAnimationFrame(startGame);