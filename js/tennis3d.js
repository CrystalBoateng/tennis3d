"use strict";
console.clear();

// Define the styles for each depth
let depthStyles = [{ // far
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
let racket = document.getElementsByClassName("racket")[0];
let racketLeft = 40; // initial horiz position (%)
let racketStep = 10; // step size for animation
let racketDepth = 1

// Set the ball's starting values
applyDepthStyle(racket, racketDepth);
let ball = document.getElementsByClassName("ball")[0];
let ballLeft = 50; // initial horiz position (%)
let ballTop = 300;
let ballDepth = 1
applyDepthStyle(ball, ballDepth);
applyBallUnits(ballLeft, ballTop);
let dBallLeft = (Math.random() * Math.floor(3)) - 1 // step size for animation (px)
let dBallTop = -10; // step size for animation (%)

// Set other starting values
let splashScreen = document.getElementById("splash-screen");
let timeRunning = document.getElementById("time-running");
let scoreString = document.getElementById("score-string");
let timerID;
let stopWatch = 0;

// Event handlers for keyboard and mouse activity
window.addEventListener("keydown", function(e) {
    switch (e.keyCode || e.which) {
        case 37:
            e.preventDefault(); moveLeft(); break;
        case 38:
            e.preventDefault(); moveNearer(); break;
        case 39:
            e.preventDefault(); moveRight(); break;
        case 40:
            e.preventDefault(); moveFarther(); break;
        case 32:
            e.preventDefault(); break; // ignore space bar
        case 13:
            e.preventDefault(); break; // ignore enter key
    }
});
document.getElementById("start-button").addEventListener("click", startTimer);

// Move the racket
function moveNearer() {
    if (racketDepth >= 2) // enforce a maximum racketDepth of 2
        return false;
    racketDepth += 1;
    applyDepthStyle(racket, racketDepth)
}
function moveFarther() {
    if (racketDepth <= 0) // enforce a minimum racketDepth of 0
        return false;
    racketDepth -= 1;
    applyDepthStyle(racket, racketDepth)
}
function moveLeft() {
    if (racketLeft <= 0) // enforce a minimum horiz position of 0
        return false;
    racketLeft -= racketStep;
    racket.style.left = racketLeft + "%";
}
function moveRight() {
    if (racketLeft >= 79) // enforce a maximum horiz position of 79
        return false;
    racketLeft += racketStep;
    racket.style.left = racketLeft + "%";
}

// Move the ball
function checkForBounce() {
    // bounce horizontally if needed
    if (ballLeft <= 0 || (ballLeft + 5) >= 100)
        dBallLeft = 0 - dBallLeft;

    // bounce vertically if needed
    if ( // ball touches racket
        (ballLeft + 2) > (racketLeft - 5) &&
        (ballLeft + 2) < (racketLeft + 25) &&
        ballTop == 480
    )
        dBallTop = 0 - dBallTop;
    else if (ballTop == 0) // ball touches top of wrapper
        dBallTop = 0 - dBallTop;
    else if (ballTop == 550) { // ball touches bottom of wrapper
        // game over
        stopTimer();
        splashScreen.style.display = "block"; // show the splashScreen
    }
}
function applyBallUnits(x, y) {
    ball.style.left = ballLeft + "%";
    ball.style.top = ballTop + "px";
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
	ballTop += dBallTop;
	ballLeft += dBallLeft;
	applyBallUnits(ballLeft + 17.5, ballTop);
    stopWatch += (33.3 / 1000) // convert milliseconds to seconds and round;
    timeRunning.innerHTML = stopWatch.toFixed(1);
}
function stopTimer() {
	console.log("----stopping timer #" + timerID);
	clearInterval(timerID);
    scoreString.innerHTML = stopWatch.toFixed(2) + " " // show final score
}

// Navigation
function restart() {
    splashScreen.style.display = "none"; // hide the splashScreen
    stopWatch = 0;
    // reset position of ball but not racket
    ballLeft = 50;
    ballTop = 300;
    ballDepth = 1
    applyDepthStyle(ball, ballDepth);
    applyBallUnits(ballLeft, ballTop);
    dBallLeft = (Math.random() * Math.floor(3)) - 1
    dBallTop = -10;
}
