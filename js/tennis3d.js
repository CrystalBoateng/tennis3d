"use strict";
console.clear();

// Event listeners for keyboard and mouse activity
window.addEventListener("keydown", function(e) {
	switch (e.keyCode || e.which) {
		case 37: // left arrow key
			e.preventDefault(); racket.moveLeft(); break;
		case 38: // up arrow key
			e.preventDefault(); racket.moveNearer(); break;
		case 39: // right arrow key
			e.preventDefault(); racket.moveRight(); break;
		case 40: // down arrow key
			e.preventDefault(); racket.moveFarther(); break;
		case 32: // ignore space bar
			e.preventDefault(); break;
		case 13: // ignore enter key
			e.preventDefault(); break;
	}
});
document.getElementById("start-button").addEventListener("click", startTimer);


class item {
	constructor(de, pos, vel) {
		this.domElement = de;
		this.position = pos;
		this.velocity = vel;
		this.depthStyles = [
			{
				name: 'far',
				color: 'purple',
				minDepth: 100,
				maxDepth: 132,
				backgroundColor: "#0e001b",
				border: "5px solid #7b00f6",
				zIndex: "116"
			},
			{
				name: 'middle',
				color: 'pink',
				minDepth: 132,
				maxDepth: 164,
				backgroundColor: "#c08cff",
				border: "5px solid #d3a7ff",
				zIndex: "148"
			},
			{
				name: 'near',
				color: 'white',
				minDepth: 164,
				maxDepth: 196,
				backgroundColor: "#f1e2ff",
				border: "5px solid #fff5fb",
				zIndex: "180"
			}
		]
	}
	applyDepthStyle(element, newDepth) {
		let newDepthStyle;
		for (let i = 0; i < this.depthStyles.length; i++) {
			if ((newDepth >= this.depthStyles[i].minDepth) 
				&& (newDepth < this.depthStyles[i].maxDepth))
				newDepthStyle = this.depthStyles[i];
		}
		element.style.backgroundColor = newDepthStyle.backgroundColor;
		element.style.border = newDepthStyle.border;
		element.style.zIndex = newDepthStyle.zIndex;
	}
}


// Create a racket
let racket = new item(
	document.getElementsByClassName("racket")[0],
	{ // set starting position
		left: 40, // in %
		depth: 148 // range is 100 to 196 (no unit)
	},
	{ // set starting velocity (step size for animation)
		left: 10, // in %
	},
);
racket.moveNearer = function() {
	if (this.position.depth + 32 >= 196) // enforce a maximum racket.position.depth of 196
		return false;
	this.position.depth += 32;
	this.applyDepthStyle(this.domElement, this.position.depth)
},
racket.moveFarther = function() {
	if (this.position.depth - 32 <= 100) // enforce a minimum racket.position.depth of 100
		return false;
	this.position.depth -= 32;
	this.applyDepthStyle(this.domElement, this.position.depth)
},
racket.moveLeft = function() {
	if (this.position.left <= 0) // enforce a minimum horiz position of 0
		return false;
	this.position.left -= this.velocity.left;
	this.domElement.style.left = this.position.left + "%";
},
racket.moveRight = function() {
	if (this.position.left >= 79) // enforce a maximum horiz position of 79
		return false;
	this.position.left += this.velocity.left;
	this.domElement.style.left = this.position.left + "%";
}
racket.applyDepthStyle(racket.domElement, racket.position.depth);


// Create a ball
let ball = new item(
	document.getElementsByClassName("ball")[0],
	{ // set starting position
		left: 50, // in %
		top: 300,
		depth: 148, // range is 100 to 196 (no unit)
		apply: function(x, y, z) {
			ball.domElement.style.left = ball.position.left + "%"; // x
			ball.domElement.style.top = ball.position.top + "px";  // y
			ball.applyDepthStyle(ball.domElement, ball.position.depth); // z
		}
	}, 
	{ // set starting velocity (step size for animation)
		Left: (3 * Math.random()) - 1, // in px
		Top: -10, // in %
		depth: (2 * Math.random()) - 1, // no unit
	},
)
ball.checkForBounce = function() {
	//removing 'bouncing' class


	// bounce into/out of screen if needed
	if (ball.position.depth < 101 || (ball.position.depth) > 195) {
		ball.velocity.depth = 0 - ball.velocity.depth;
		console.log('BOUNCE')
		// add 'bouncing' class
	}
	// bounce horizontally if needed
	if (ball.position.left <= 0 || (ball.position.left + 5) >= 100)
		ball.velocity.left = 0 - ball.velocity.left;
	// bounce vertically if needed
	if ( // if ball touches racket
		(ball.position.left + 2) > (racket.position.left - 5) &&
		(ball.position.left + 2) < (racket.position.left + 25) &&
		ball.position.top == 480
	)
		ball.velocity.top = 0 - ball.velocity.top;
	else if (ball.position.top == 0) // if ball touches top of wrapper
		ball.velocity.top = 0 - ball.velocity.top;
	else if (ball.position.top == 550) { // if ball touches bottom of wrapper
		// end the game
		stopTimer();
		splashScreen.style.display = "block"; // show the splashScreen
	}
}
ball.applyDepthStyle(ball.domElement, ball.position.depth);


// Set starting values
let splashScreen = document.getElementById("splash-screen");
let timeRunning = document.getElementById("time-running");
let scoreString = document.getElementById("score-string");
let highScoreString = document.getElementById("high-score-string");
let timerID;
let stopWatch = 0;
let score;
let highScore;
let firstScore = JSON.parse(window.localStorage.getItem("tennis3d_high_score"));
if (firstScore)
	highScoreString.innerHTML = firstScore;


// Timing and animation
function startTimer() {
	restart();
	timerID = setTimerId();
	console.log("----starting timer #" + timerID);
}
function setTimerId() {
	return function(){
		return(setInterval(animateOneFrame, 30));
	}();
}
function animateOneFrame() {
	ball.checkForBounce();
	ball.position.top += ball.velocity.top;
	ball.position.left += ball.velocity.left;
	ball.position.depth += ball.velocity.depth;
	ball.position.apply(
		ball.position.left + 17.5, 
		ball.position.top, 
		ball.position.depth
		);
	stopWatch += (33.3 / 1000) // convert milliseconds to seconds
	timeRunning.innerHTML = stopWatch.toFixed(2); // round seconds
}
function stopTimer() {
	console.log("----stopping timer #" + timerID);
	clearInterval(timerID);
	score = (stopWatch + 0.03).toFixed(2);
	scoreString.innerHTML = score + " "; // show final score
	displayHighScore();
	document.getElementById("start-button").focus();
}

// Navigation and scoring
function restart() {
	splashScreen.style.display = "none"; // hide the splashScreen
	stopWatch = 0;
	// reset position of ball, but not of racket
	ball.position.left = 50;
	ball.position.top = 300;
	ball.position.depth = 148
	ball.applyDepthStyle(ball.domElement, ball.position.depth);
	ball.position.apply(ball.position.left, ball.position.top);
	ball.velocity.left = (Math.random() * Math.floor(3)) - 1
	ball.velocity.top = -10;
	ball.velocity.depth = (2 * Math.random()) - 1;
	// ball.velocity.depth = ;//random
}
function displayHighScore() {
	// determine highest score
	let pulledScore = JSON.parse(window.localStorage.getItem("tennis3d_high_score"));
	if (pulledScore && parseInt(pulledScore) > score) {
		highScore = pulledScore; // highScore is already a string
	} else {
		highScore = score + " "; // make highScore a string
		localStorage.setItem("tennis3d_high_score", JSON.stringify(highScore)); // push to localStorage
	}
	// display highest score
	highScoreString.innerHTML = highScore;
}
