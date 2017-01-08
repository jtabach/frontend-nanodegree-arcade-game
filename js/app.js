// Global Variables
var colLength = canvas.limit.right / 4;
var rowLength = (canvas.limit.bottom - canvas.limit.top) / 4;
var enemySpeedMulitplier = 200;
var wins = 0;

// Super class for creating Player and Enemy
var Char = function(sprite, x, y) {
  this.sprite = sprite;
  this.x = x;
  this.y = y;
};

// Renders characters to the canvas
Char.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Create enemy class by calling the Char superclass
var Enemy = function(sprite, y, speed) {
  Char.call(this, sprite, -colLength, y);
  this.speed = speed;
};

Enemy.prototype = Object.create(Char.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (this.x < canvas.limit.right + colLength) {
    this.x += this.speed * dt;
    this.checkCollision();
  } else {
    this.reset();
  }
};

// Reset Enemy when enemy reaches canvas limit with new row and speed
Enemy.prototype.reset = function() {
  this.speed = getRandomSpeed();
  this.x = -colLength;
  this.y = getRandomRow();
};

// check Enemy position in comparison to player to determine if a collision has occured
Enemy.prototype.checkCollision = function() {
  if (this.y === player.y && this.x > player.x - colLength / 2 && this.x < player.x + colLength / 2) {
    // Decision to only reset the player to allow for smoother game flow
    player.reset();
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(sprite, x, y) {
  Char.call(this, sprite, x, y);
};

Player.prototype = Object.create(Char.prototype);
Player.prototype.constructor = Player;

// Update Player's position
Player.prototype.update = function(x, y) {
  if (x || y) {
    this.x += x;
    this.y += y;
  }
};

// Handle user input (keyup) and invokes Player.update with respect to canvas limits
Player.prototype.handleInput = function(direction) {
  var x;
  switch (direction) {
    case 'left':
      if (this.x > canvas.limit.left) {
        this.update(-colLength, 0);
      }
      break;
    case 'right':
      if (this.x < canvas.limit.right) {
        this.update(colLength, 0);
      }
      break;
    case 'up':
      if (this.y > canvas.limit.top) {
        this.update(0, -rowLength);
      } else {
        updateWinCount();
        this.reset();
      }
      break;
    case 'down':
      if (this.y < canvas.limit.bottom) {
        this.update(0, rowLength);
      }
      break;
  }
};

// Resets Player to starting position either on collision or win condition
Player.prototype.reset = function() {
  this.x = canvas.limit.right / 2;
  this.y = canvas.limit.bottom;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy1 = new Enemy('images/enemy-bug.png', getRandomRow(), getRandomSpeed());
var enemy2 = new Enemy('images/enemy-bug.png', getRandomRow(), getRandomSpeed());
var enemy3 = new Enemy('images/enemy-bug.png', getRandomRow(), getRandomSpeed());
var player = new Player('images/char-boy.png', canvas.limit.right / 2, canvas.limit.bottom);
var allEnemies = [enemy1, enemy2, enemy3];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

// Win condition updates win count on UI
function updateWinCount() {
  wins++;
  document.getElementById("wins").innerHTML = wins;
}

// Generates random speed for enemy bugs
function getRandomSpeed() {
  return (1 + Math.random()) * enemySpeedMulitplier;
}

// Generates random starting row for enemy bugs
function getRandomRow() {
  return Math.round(Math.random() * 2) * rowLength + canvas.limit.top;
} 