"use strict";
console.clear();

// Define the styles for each depth
let depthStyles = [
    { // far
        backgroundColor: "#6700ce",
        border: "5px solid #7b00f6",
        zIndex: "400"
    },
    { // middle
        backgroundColor: "#c08cff",
        border: "5px solid #d3a7ff",
        zIndex: "500"
    },
    { // near
        backgroundColor: "#f1e2ff",
        border: "5px solid #fff5fb",
        zIndex: "600"
    }
]
function applyDepthStyle(element, newDepth) {
    element.style.backgroundColor = depthStyles[newDepth].backgroundColor;
    element.style.border = depthStyles[newDepth].border;
    element.style.zIndex = depthStyles[newDepth].zIndex;
}

// Set the racket's starting values
racket = {
    domElement: document.getElementsByClassName("racket")[0],
    position: {
        left: 40, // initial horiz position (%)
        depth: 1
    },
    velocity: {
        left: 10, // step size for animation
    }
}
// Set the ball's starting values
applyDepthStyle(racket.domElement, racket.position.depth);
ball = {
    domElement: document.getElementsByClassName("ball")[0],
    position: {
        left: 50, // (% instead of px)
        top: 300,
        depth: 1
    },
    velocity: {
        Left: (Math.random() * Math.floor(3)) - 1, // step size for animation (px)
        Top: -10 // step size for animation (%)
    }
}
applyDepthStyle(ball.domElement, ball.position.depth);
applyBallUnits(ball.position.left, ball.position.top);
// Set other starting values
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

// Event handlers for keyboard and mouse activity
window.addEventListener("keydown", function(e) {
    switch (e.keyCode || e.which) {
        case 37: // left arrow key
            e.preventDefault(); moveLeft(); break;
        case 38: // up arrow key
            e.preventDefault(); moveNearer(); break;
        case 39: // right arrow key
            e.preventDefault(); moveRight(); break;
        case 40: // down arrow key
            e.preventDefault(); moveFarther(); break;
        case 32: // ignore space bar
            e.preventDefault(); break;
        case 13: // ignore enter key
            e.preventDefault(); break;
    }
});
document.getElementById("start-button").addEventListener("click", startTimer);

// Move the racket
function moveNearer() {
    if (racket.position.depth >= 2) // enforce a maximum racket.position.depth of 2
        return false;
    racket.position.depth += 1;
    applyDepthStyle(racket.domElement, racket.position.depth)
}
function moveFarther() {
    if (racket.position.depth <= 0) // enforce a minimum racket.position.depth of 0
        return false;
    racket.position.depth -= 1;
    applyDepthStyle(racket.domElement, racket.position.depth)
}
function moveLeft() {
    if (racket.position.left <= 0) // enforce a minimum horiz position of 0
        return false;
    racket.position.left -= racket.velocity.left;
    racket.domElement.style.left = racket.position.left + "%";
}
function moveRight() {
    if (racket.position.left >= 79) // enforce a maximum horiz position of 79
        return false;
    racket.position.left += racket.velocity.left;
    racket.domElement.style.left = racket.position.left + "%";
}

// Move the ball
function checkForBounce() {
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
        // game over
        stopTimer();
        splashScreen.style.display = "block"; // show the splashScreen
    }
}
function applyBallUnits(x, y) {
    ball.domElement.style.left = ball.position.left + "%";
    ball.domElement.style.top = ball.position.top + "px";
}
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
    checkForBounce();
	ball.position.top += ball.velocity.top;
	ball.position.left += ball.velocity.left;
	applyBallUnits(ball.position.left + 17.5, ball.position.top);
    stopWatch += (33.3 / 1000) // convert milliseconds to seconds
    timeRunning.innerHTML = stopWatch.toFixed(2); // round seconds
}
function stopTimer() {
    console.log("----stopping timer #" + timerID);
    clearInterval(timerID);
    score = (stopWatch + 0.03).toFixed(2);
    scoreString.innerHTML = score + " "; // show final score
    displayHighScore();
}

// Navigation and scoring
function restart() {
    splashScreen.style.display = "none"; // hide the splashScreen
    stopWatch = 0;
    // reset position of ball but not racket
    ball.position.left = 50;
    ball.position.top = 300;
    ball.position.depth = 1
    applyDepthStyle(ball.domElement, ball.position.depth);
    applyBallUnits(ball.position.left, ball.position.top);
    ball.velocity.left = (Math.random() * Math.floor(3)) - 1
    ball.velocity.top = -10;
}
function displayHighScore() {
    // determine highest score
    let pulledScore = JSON.parse(window.localStorage.getItem("tennis3d_high_score"));
    if (pulledScore && parseInt(pulledScore) > score) {
        highScore = pulledScore; // highScore is already a string
    } else {
        highScore = score + " "; // make highScore a string
        console.log(highScore);
        localStorage.setItem("tennis3d_high_score", JSON.stringify(highScore)); // push to localStorage
    }
    // display highest score
    highScoreString.innerHTML = highScore;
}
