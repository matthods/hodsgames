let date = new Date;
let body = document.querySelector('body');
let h = document.getElementsByClassName('holidayTitle');
let g = document.getElementsByClassName('game');

if(date.getMonth() == 0 && date.getDate() <= 10) {
	document.getElementById('newYear').style.display = 'block';
	document.getElementById('year').innerHTML = '20 '+(date.getYear()-100);
}
if(date.getMonth() == 1 && date.getDay() == 1 && date.getDate() >= 15 && date.getDate() <= 21) {
	document.getElementById('presDay').style.display = 'block';
	for(let i=0;i<h.length;i++) {
		h[i].style.fontSize = '40px';
	}
	body.style.backgroundColor = 'rgb(100,140,255)';
	for(let i=0;i<g.length;i++) {
		g[i].style.backgroundColor = 'rgb(255,50,50)';
	}
}
if(date.getMonth() == 10 && date.getDate() >= 10) {
	document.getElementById('thanksDay').style.display = 'block';
	for(let i=0;i<h.length;i++) {
		h[i].style.fontSize = '50px';
	}
	body.style.backgroundColor = 'rgb(255,190,145)';
	for(let i=0;i<g.length;i++) {
		g[i].style.backgroundColor = 'rgb(185,100,100)';
	}
}
if(date.getMonth() == 11) {
	document.getElementById('happyHolidays').style.display = 'block';
	body.style.backgroundColor = '#b1f0b5';
}

document.onkeydown = function(event) {
	if(event.keyCode == 123) {
      return false;
    } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
      return false;
    } else if (event.ctrlKey && event.keyCode == 85) {
      return false;
    }
}