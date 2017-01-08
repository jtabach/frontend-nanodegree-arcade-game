// Global Variables
var colLength = 101;
var rowLength = 83;

// Super class for creating Player and Enemy
var Char = function(sprite, x, y) {
  this.sprite = sprite;
  this.x = x;
  this.y = y;
}

Char.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function(sprite, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    Char.call(this, sprite, -colLength, y)
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
    } else {
      this.reset();
    }
};

Enemy.prototype.reset = function() {
  this.speed = (1 + Math.random()) * 200;
  this.x = -colLength;
  this.y = Math.round(Math.random() * 2) * rowLength + 60;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(sprite, x, y) {
  Char.call(this, sprite, x, y);
}

Player.prototype = Object.create(Char.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(x, y) {
  if(x || y) {
    this.x += x;
    this.y += y;
  }
};

Player.prototype.handleInput = function(direction) {
  var x;
  switch(direction) {
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
        console.log('winner');
        this.reset(this.x);
      }
      break;
    case 'down':
      if (this.y < canvas.limit.bottom) {
        this.update(0, rowLength);
      }
      break;
  }
};

Player.prototype.reset = function(x) {
  this.x = x;
  this.y = 386;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy1 = new Enemy('images/enemy-bug.png', 143, 200);
var enemy2 = new Enemy('images/enemy-bug.png', 60, 300);
var enemy3 = new Enemy('images/enemy-bug.png', 226, 100);
var player = new Player('images/char-boy.png', 202, 386);
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
