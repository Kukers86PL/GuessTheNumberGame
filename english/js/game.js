window.onload = () => {
	'use strict';
	newGame();

	if ("serviceWorker" in navigator) {
		if (!navigator.serviceWorker.controller) {
			// Register the service worker
			navigator.serviceWorker
			.register("./sw.js", {
				scope: "./"
			})
		}
	}
}

var inc = document.getElementsByClassName("stepper");
for (i = 0; i < inc.length; i++) {
	var incI = inc[i].querySelector("input"),
	id = incI.getAttribute("id"),
	min = incI.getAttribute("min"),
	max = incI.getAttribute("max"),
	step = incI.getAttribute("step");
	document
	.getElementById(id)
	.previousElementSibling.setAttribute(
		"onclick",
		"stepperInput('" + id + "', -" + step + ", " + min + ")");
	document
	.getElementById(id)
	.nextElementSibling.setAttribute(
		"onclick",
		"stepperInput('" + id + "', " + step + ", " + max + ")");
}

function stepperInput(id, s, m) {
	var el = document.getElementById(id);
	if (s > 0) {
		if (parseInt(el.value) < m) {
			el.value = parseInt(el.value) + s;
		}
	} else {
		if (parseInt(el.value) > m) {
			el.value = parseInt(el.value) + s;
		}
	}
}

function getRandom() {
	min = Math.ceil(0);
	max = Math.floor(100);
	document.getElementById('thenumber').value = Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkPick() {
	game = document.getElementById('thegame').value;
	if (game == 1) {
		number = document.getElementById('thenumber').value;
		pick = document.getElementById('stepper').value;
		picks = document.getElementById('thepicks').value;
		picks++;
		result = "Your pick is ";
		if (number == pick) {
			result += "correct";
			document.getElementById('thegame').value = 0;
		} else if (pick < number) {
			result += "below";
		} else if (pick > number){
			result += "abowe";
		}
		document.getElementById('result').value = result;
		document.getElementById('picks').value = picks;
		document.getElementById('thepicks').value = picks;
	}
}

function newGame() {
	getRandom();
	document.getElementById('result').value = "Take a pick";
	document.getElementById('picks').value = 0;
	document.getElementById('thepicks').value = 0;
	document.getElementById('thegame').value = 1;
}
