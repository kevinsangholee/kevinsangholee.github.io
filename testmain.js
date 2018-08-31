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

	/***********************/
	/* ANIMATION FUNCTIONS */
	/***********************/

	var createSemicircle = function(x, y, water) {
		var c = {};
		c.x = x;
		c.y = y;
		c.alpha = 1;
		c.draw = function() {
			if(water) {
				ctxWater.fillStyle = "#89d3ff";
				ctxWater.beginPath();
				ctxWater.arc(c.x, c.y, 50, 0, Math.PI, true);
				ctxWater.lineTo(c.x-50, c.y+500);
				ctxWater.lineTo(c.x+50, c.y+500);
				ctxWater.lineTo(c.x+50, c.y);
				ctxWater.fill();				
			} else {
				ctxWet.fillStyle = "rgba(214,203,152," + c.alpha + ")";
				ctxWet.beginPath();
				ctxWet.arc(c.x, c.y, 50, 0, Math.PI, true);
				ctxWet.lineTo(c.x-50, c.y+500);
				ctxWet.lineTo(c.x+50, c.y+500);
				ctxWet.lineTo(c.x+50, c.y);
				ctxWet.fill();
			}


		}
		return c;
	}

	function renderWaterAnimation(anim) {
		ctxWater.clearRect(0, 0, waterCanvas.width, waterCanvas.height);
		for(var i = 0; i < anim.animatables.length; i++) {
			anim.animatables[i].target.draw();
		}		
	}

	function renderSandAnimation(anim) {
		ctxWet.clearRect(0, 0, wetSandCanvas.width, wetSandCanvas.height);
		for(var i = 0; i < anim.animatables.length; i++) {
			anim.animatables[i].target.draw();
		}		
	}

	function animateWater() {
		// Draw initial waves
		var semiCircles = [];
		for(var i = 50; i < waterCanvas.width + 100; i += 100) {
			semiCircles.push(createSemicircle(i, waterCanvas.height, true));
		}
		var duration = anime.random(1500,2500);
		bobWater(semiCircles, duration);

	}

	function setWaveHeight(semiCircles) {
		var wavePoint = anime.random(0, semiCircles.length - 1);
		maxHeight = anime.random(300, 500)
		semiCircles.forEach(function(semi, idx) {
			semi.height = anime.random(Math.max(maxHeight - 100 - (50 * Math.abs(wavePoint - idx)), 0), Math.max(maxHeight - (50 * Math.abs(wavePoint - idx)), 0));
		})
	}

	function bobWater(semiCircles, duration) {
		sandSemis = [];
		setWaveHeight(semiCircles);
		anime.timeline().add({
			targets: semiCircles,
			y: function(c) { 
				return c.y - c.height 
			},
			duration: duration,
			easing: 'easeOutCubic',
			update: renderWaterAnimation,
			complete: function() {
				semiCircles.forEach(function(semi) {
					sandSemis.push(createSemicircle(semi.x, semi.y, false))
				})
			}
		}).add({
			targets: semiCircles,
			y: 600,
			duration: duration+2000,
			easing: [0.620, -0.010, 0.400, 0.955],
			update: renderWaterAnimation,
			begin: function() {
				anime({
					targets: sandSemis,
					alpha: 0,
					duration: anime.random(2500,3000),
					easing: 'easeInQuad',
					update: renderSandAnimation,
					delay: 1000,
				})
			},
			complete: function(anim) {
				anim.pause();
				anime({
					targets: semiCircles,
					y: function(c) { return c.y + anime.random(-10,10) },
					duration: 1500,
					loop: true,
					direction: 'alternate',
					easing: 'easeInOutQuad',
					update: renderWaterAnimation,
					begin: function(anim) {
						setTimeout(function() {
							anim.pause();
							bobWater(semiCircles, anime.random(1500,2500));
						}, anime.random(2000,3000))
					}
				})
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
    	ctxFace.beginPath();
	    ctxFace.lineWidth = 20;
	    ctxFace.shadowColor = "black";
	    ctxFace.strokeStyle = "rgba(255, 178, 137,0.5)";
	    ctxFace.shadowBlur = 50;
	    ctxFace.shadowOffsetX = 0;
	    ctxFace.shadowOffsetY = 0;
		ctxFace.arc(faceCanvas.width/2, 300, 150, 0, 2 * Math.PI, false);
		ctxFace.stroke();
	    ctxFace.save();
	    ctxFace.beginPath();
	    ctxFace.arc(faceCanvas.width/2, 300, 150, 0, Math.PI * 2);
	    ctxFace.closePath();
	    ctxFace.clip();
	    ctxFace.drawImage(imageObj, faceCanvas.width/2 - 150, 150, 300, 300);
	};
	
	window.addEventListener('resize', canvasResize, false);
	animateWater();

}

function canvasResize() {
	var faceCanvas = document.getElementById("faceCanvas");
	var ctxFace = faceCanvas.getContext("2d");
	faceCanvas.width = window.innerWidth;
	faceCanvas.height = 600;
	ctxFace.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
	var imageObj = document.createElement('img')
	imageObj.src = 'me.jpg';
	imageObj.onload = function()
	{
    	ctxFace.beginPath();
	    ctxFace.lineWidth = 20;
	    ctxFace.shadowColor = "black";
	    ctxFace.strokeStyle = "rgba(255, 178, 137,0.5)";
	    ctxFace.shadowBlur = 50;
	    ctxFace.shadowOffsetX = 0;
	    ctxFace.shadowOffsetY = 0;
		ctxFace.arc(faceCanvas.width/2, 300, 150, 0, 2 * Math.PI, false);
		ctxFace.stroke();
	    ctxFace.save();
	    ctxFace.beginPath();
	    ctxFace.arc(faceCanvas.width/2, 300, 150, 0, Math.PI * 2);
	    ctxFace.closePath();
	    ctxFace.clip();
	    ctxFace.drawImage(imageObj, faceCanvas.width/2 - 150, 150, 300, 300);
	};		
}