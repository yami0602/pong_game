function Ball(dimensions){
  console.log('dimensions ',dimensions);
  this.size = 20;
  this.velocity = {
    x: 0,
    y: 0
  };
  this.speed = 2;
  this.position = {
    x: dimensions.width / 2 - this.size / 2,
    y: dimensions.height / 2,
  }
}

Ball.prototype.initialize = function () {
  var r = Math.random() - 0.5;
  var angle = Math.PI * r;
  this.velocity = {
    x: this.speed * Math.cos(angle),
    y: this.speed * Math.sin(angle)
  }
};

Ball.prototype.update = function (Game) {
  var PLAYERS = Game.PLAYERS;

  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

  // For testing we will allow the ball to bounce at both sides of the board
  if (this.position.x + this.size >= Game.dimensions.width && this.velocity.x > 0) {
    this.velocity.x *= -1;
  }
  if (this.position.x <= 0 && this.velocity.x < 0) {
    this.velocity.x *= -1;
  }


  if (this.position.y <= 0 || this.position.y >= Game.dimensions.height - this.size) {
    this.velocity.y *= -1;
  }

  for(const ID in PLAYERS){
    if (this.position.x > PLAYERS[ID].position.x - this.size && this.position.x < PLAYERS[ID].position.x + PLAYERS[ID].dimensions.width) {
      if (this.position.y > PLAYERS[ID].position.y - this.size && this.position.y < PLAYERS[ID].position.y + PLAYERS[ID].dimensions.height) {

        //in here, it bounced against the PLAYERS[ID]
        this.velocity.x *= -1;
        this.velocity.x += PLAYERS[ID].velocity.x;
        this.velocity.y += PLAYERS[ID].velocity.y;
      }
    }
  }

  // End the game if the ball hits the left or right side
  // if (this.position.x + this.size >= Game.dimensions.width) {
  //   Game.stop();
  // }
  // if (this.position.x < 0 && this.velocity.x < 0) {
  //   Game.stop();
  // }

};

Ball.prototype.draw = function (ctx) {
  ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
}

module.exports = Ball;
