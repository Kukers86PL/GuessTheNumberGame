window.onload = () => {
	'use strict';
	getClientData();

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
				var client_data = {
					id: 1,
					client: client_id,
					nickname: client_nickname
				};
				client_data_store.add(client_data);
				document.getElementById('nickname').value = client_nickname;
			} else if (event.target.result == 1){
				client_data_store.get(1).onsuccess = function (event) {
					document.getElementById('nickname').value = event.target.result.nickname;
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

function getRandom() {
	var min = Math.ceil(0);
	var max = Math.floor(1000000000);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateClientData() {
	var request = self.indexedDB.open('GuessTheNumberGameDB', 1);

	request.onsuccess = function (event) {

		// get database from event
		var db = event.target.result;

		// create transaction from database
		var transaction = db.transaction('client_data', 'readwrite');

		// get store from transaction
		var client_data_store = transaction.objectStore('client_data');
		
		var client_nickname = document.getElementById('nickname').value;

		client_data_store.count().onsuccess = function (event) {
			if (event.target.result == 1) {
				client_data_store.get(1).onsuccess = function (event) {
					var client_data = event.target.result;
					client_data.nickname = client_nickname;
					client_data_store.clear().onsuccess = function (event) {
						client_data_store.add(client_data);
					};
				};
			} else {
				client_data_store.clear().onsuccess = function (event) {
					getClientData();
				};
			}
		};
	};
}

