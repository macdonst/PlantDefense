// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Flower image
var flowerReady = false;
var flowerImage = new Image();
flowerImage.onload = function () {
	flowerReady = true;
};
flowerImage.src = "images/flower.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/crow.png";

// Game objects
var flowers = [
	{x:95,y:415},
	{x:250,y:415},
	{x:413,y:415}
];
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {
	speed: 128
};
var crowsScared = 0;

canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    writeMessage(canvas, message);
    	// Are they touching?
	if (
		mousePos.x <= (monster.x + 32)
		&& monster.x <= (mousePos.x + 32)
		&& mousePos.y <= (monster.y + 32)
		&& monster.y <= (mousePos.y + 32)
	) {
		++crowsScared;
		reset();
	}
}, false);

var getMousePos = function(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      };

var writeMessage = function(canvas, message) {
        console.log(message);
      };

// Setup initial flowers
var drawFlowers = function() {
};

// Reset the game when the player catches a monster
var reset = function () {
	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 0;
};

// Update game objects
var update = function (modifier) {
	// move monster
	monster.y += monster.speed * modifier;

	// Are they touching?
	for (var i=0; i<flowers.length; i++) {
		if (
			flowers[i].x <= (monster.x + 32)
			&& monster.x <= (flowers[i].x + 32)
			&& flowers[i].y <= (monster.y + 32)
			&& monster.y <= (flowers[i].y + 32)
		) {
			flowers.splice(i, 1);
			if (flowers.length == 0) {
				clearInterval(gameLoop);
				console.log("calling game over");
				setInterval(gameOver, 5000);
				return;
			}
		}
	}

	if (monster.y >= 480) {
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (flowerReady) {
		for (var i=0; i<flowers.length; i++) {
			ctx.drawImage(flowerImage, flowers[i].x, flowers[i].y);
		}
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Birds Scared Away: " + crowsScared, 32, 32);
};

var gameOver = function() {
	console.log("in game over");
	if (bgReady) {
		console.log("draw background");
		ctx.drawImage(bgImage, 0, 0);
	}

	// Score
	console.log("show score");
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Game Over!!!", 32, 0);
	ctx.fillText("Birds Scared Away: " + crowsScared, 32, 32);
};

var notSetup = true;
// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
var gameLoop = setInterval(main, 1); // Execute as fast as possible