window.onload = function() {

	/****************************/
	/* VARIABLE INITIALIZATIONS */
	/****************************/

	// Canvas init
	var sandCanvas = document.getElementById("sandCanvas");
	var wetSandCanvas = document.getElementById("wetSandCanvas");
	var waterCanvas = document.getElementById("waterCanvas");
	var faceCanvas = document.getElementById("faceCanvas");

	// Context init
	var ctxSand = sandCanvas.getContext("2d");
	var ctxWet = wetSandCanvas.getContext("2d");
	var ctxWater = waterCanvas.getContext("2d");
	var ctxFace = faceCanvas.getContext("2d");

	// helpers init
	var semiCircles = [];
	var circlesSet = false;

	// Semicircle
	var semiCircle = function(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.wavelength = 100;
		this.t = 0;
		this.current = 0;
		this.rising = false;
		this.falling = false;
		this.tInterval = 0.01
	}

	/***********************/
	/* ANIMATION FUNCTIONS */
	/***********************/

	var drawSemicircle = function(x, y) {
		ctxWater.fillStyle = "#89d3ff";
		ctxWater.beginPath();
		ctxWater.arc(x, y, 50, 0, Math.PI, true);
		ctxWater.fill();
		if(y < waterCanvas.height) {
			ctxWater.fillRect(x - 50, y, 100, waterCanvas.height - y)
		}
		var semi = new semiCircle(x, y, 50);
		if(!circlesSet) {
			semiCircles.push(semi);
		} 
	}
	
	var alpha = 1
	var drawWetSand = function(x, y, falling) {		
		if(falling) {
			alpha -= 0.001;
		} else {
			alpha = 1;
		}
		ctxWet.fillStyle = "rgba(214,203,152," + alpha + ")";
		ctxWet.beginPath();
		ctxWet.arc(x, y, 50, 0, Math.PI, true);
		ctxWet.fill();
		ctxWet.fillRect(x - 50, y, 100, waterCanvas.height - y)
	}

	function animateWater() {
		ctxWater.globalAlpha = 1;
		ctxWater.clearRect(0,0,waterCanvas.width, waterCanvas.height);
		ctxWet.clearRect(0,0,waterCanvas.width, waterCanvas.height);
		getSemiValues(semiCircles);

		semiCircles.forEach(function(semi) {
			if(semi.rising) {
				drawSemicircle(semi.x, semi.y - semi.current);
				drawWetSand(semi.x, semi.y - semi.current, false);
			} else if(semi.falling) {
				drawSemicircle(semi.x, semi.y - semi.wavelength + semi.current);
				drawWetSand(semi.x, semi.y - semi.wavelength, true);
			} else {
				drawSemicircle(semi.x, semi.y);
			}
		})

		window.requestAnimationFrame(animateWater)
	}

	var waveNum = -1;
	function getSemiValues(semiCircles) {
		if(waveNum == -1) {
			waveNum = Math.floor(Math.random() * semiCircles.length);
			setRisingValues(semiCircles, waveNum);
		}
		semiCircles.forEach(function(semi) {
			if(semi.rising) {
				semi.current = EasingFunctions.easeOutQuad(semi.t) * semi.wavelength;

				if(semi.t < 1) {
					semi.t += semi.tInterval;
				} else {
					semi.rising = false;
					semi.falling = true;
					semi.t = 0;
					semi.tInterval = 0.007;
				}
			}
			if(semi.falling) {
				semi.current = EasingFunctions.easeInOutQuad(semi.t) * semi.wavelength;

				if(semi.t < 1) {
					semi.t += semi.tInterval;
				} else {
					semi.falling = false;
					semi.tInterval = 0.02;
					semi.t = 0;
				}
			}
		})
		var done = true;
		var doneCount = 0;
		semiCircles.forEach(function(semi) {
			if(semi.rising || semi.falling) {
				done = false;
			}
		})
		if(done) {
			waveNum = -1;
		}
	}

	function setRisingValues(semiCircles, waveNum) {
		semiCircles[waveNum].rising = true;
		semiCircles[waveNum].wavelength = Math.floor(Math.random() * 50) + 125;
		if(waveNum - 1 >= 0){ 
			semiCircles[waveNum - 1].rising = true;
			semiCircles[waveNum - 1].wavelength = Math.floor(Math.random() * 50) + 75;
		}
		if(waveNum - 2 >= 0){ 
			semiCircles[waveNum - 2].rising = true;
			semiCircles[waveNum - 2].wavelength = Math.floor(Math.random() * 50) + 25;
		}
		if(waveNum + 1 < semiCircles.length){ 
			semiCircles[waveNum + 1].rising = true; 
			semiCircles[waveNum + 1].wavelength = Math.floor(Math.random() * 50) + 75;
		}
		if(waveNum + 2 < semiCircles.length){ 
			semiCircles[waveNum + 2].rising = true; 
			semiCircles[waveNum + 2].wavelength = Math.floor(Math.random() * 50) + 25;
		}
		semiCircles.forEach(function(semi) {
			if(!semi.rising) {
				semi.rising = true;
				semi.wavelength = Math.floor(Math.random() * 25) + 15;
			}
		})
	}
	
	/*******************/
	/* START MAIN CODE */
	/*******************/

	// Sand canvas setting
	sandCanvas.width = window.innerWidth;
	sandCanvas.height = 600;
	ctxSand.fillStyle = "#fff7c9";
	ctxSand.fillRect(0,0,sandCanvas.width,sandCanvas.height);

	for(var i = 0; i < sandCanvas.width; i += 4) {
		for(var j = 0; j < sandCanvas.height; j += 4) {
			var num = Math.floor(Math.random() * 100);
			if(num == 0) {
				ctxSand.fillStyle = "#d6cb98";
				ctxSand.fillRect(i,j,4,4);
			}
		}
	}

	// Water canvas setting
	wetSandCanvas.width = window.innerWidth;
	wetSandCanvas.height = 600;
	waterCanvas.width = window.innerWidth;
	waterCanvas.height = 600;
	faceCanvas.width = window.innerWidth;
	faceCanvas.height = 600;

	
	var imageObj = document.createElement('img')
	imageObj.src = 'me.jpg';
	imageObj.onload = function()
	{
	    ctxFace.save();
	    ctxFace.beginPath();
	    ctxFace.arc(faceCanvas.width/2, 300, 150, 0, Math.PI * 2);
	    ctxFace.closePath();
	    ctxFace.clip();
	    ctxFace.drawImage(imageObj, faceCanvas.width/2 - 150, 150, 300, 300);
	};

	// Draw initial waves
	for(var i = 50; i < waterCanvas.width + 100; i += 100) {
		drawSemicircle(i, waterCanvas.height)
	}
	circlesSet = true;

	// Start animation
	window.requestAnimationFrame(animateWater);
}

EasingFunctions = {
    linear: function (t) {
        return t
    },
    easeInQuad: function (t) {
        return t * t
    },
    easeOutQuad: function (t) {
        return t * (2 - t)
    },
    easeInOutQuad: function (t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },
    easeInCubic: function (t) {
        return t * t * t
    },
    easeOutCubic: function (t) {
        return (--t) * t * t + 1
    },
    easeInOutCubic: function (t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },
    easeInQuart: function (t) {
        return t * t * t * t
    },
    easeOutQuart: function (t) {
        return 1 - (--t) * t * t * t
    },
    easeInOutQuart: function (t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    },
    easeInQuint: function (t) {
        return t * t * t * t * t
    },
    easeOutQuint: function (t) {
        return 1 + (--t) * t * t * t * t
    },
    easeInOutQuint: function (t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    }
}