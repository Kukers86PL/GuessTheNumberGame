window.onload = () => {
  'use strict';

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