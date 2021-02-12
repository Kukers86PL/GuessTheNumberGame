window.onload = () => {
	'use strict';
	newGame();
	getClientData();

	if ("serviceWorker" in navigator) {
		if (!navigator.serviceWorker.controller) {
			// Register the service worker
			navigator.serviceWorker
			.register("../sw.js", {
				scope: "./"
			})
		}
	}
	
	var inc = document.getElementsByClassName("stepper");
	for (var i = 0; i < inc.length; i++) {
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
}

function setStyleSheet(url){
   var stylesheet = document.getElementById("stylesheet");
   stylesheet.setAttribute('href', url);
   document.getElementById("mode").value = url;
   updateClientData();
}

function getClientData() {
	var request = self.indexedDB.open('GuessTheNumberGameDB', 1);

	request.onsuccess = function (event) {

		// get database from event
		var db = event.target.result;

		// create transaction from database
		var transaction = db.transaction('client_data', 'readwrite');

		// get store from transaction
		var client_data_store = transaction.objectStore('client_data');

		client_data_store.count().onsuccess = function (event) {
			if (event.target.result == 0) {
				var client_id = getRandom();
				var client_nickname = 'quest_' + client_id;
				var client_mode = "/css/dark.css";
				var client_data = {
					id: 1,
					client: client_id,
					nickname: client_nickname,
					mode: client_mode
				};
				client_data_store.add(client_data);
				setStyleSheet(client_mode);
			} else if (event.target.result == 1){
				client_data_store.get(1).onsuccess = function (event) {
					setStyleSheet(event.target.result.mode);
				};
			} else {
				client_data_store.clear().onsuccess = function (event) {
					getClientData();
				};
			}
		};
	};

	request.onerror = function (event) {
		console.log('[onerror]', request.error);
	};

	request.onupgradeneeded = function (event) {
		var db = event.target.result;
		var client_data_store = db.createObjectStore('client_data', {
				keyPath: 'id'
			});
	};
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
		number = Math.floor(document.getElementById('thenumber').value);
		pick = Math.floor(document.getElementById('stepper').value);
		picks = document.getElementById('thepicks').value;
		picks++;
		result = "Twoj strzał jest ";
		if (number == pick) {
			result += "poprawny";
			document.getElementById('thegame').value = 0;
		} else if (pick < number) {
			result += "poniżej";
		} else if (pick > number){
			result += "powyżej";
		}
		document.getElementById('result').value = result;
		document.getElementById('picks').value = picks;
		document.getElementById('thepicks').value = picks;
	}
}

function newGame() {
	getRandom();
	document.getElementById('result').value = "Strzel";
	document.getElementById('picks').value = 0;
	document.getElementById('thepicks').value = 0;
	document.getElementById('thegame').value = 1;
}
