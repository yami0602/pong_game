function Player(dimensions, socket, name, side){
  this.moving = {
    UP: false,
    DOWN: false,
    RIGHT: false,
    LEFT: false,
  }

  this.dimensions = {
    width: 20,
    height: 100,
  }

  this.position = {
    x: side === 'left' ? 0 : dimensions.width - this.dimensions.width,
    y: dimensions.height / 2 - 50,
  }
  
  this.velocity = {
    x: 0,
    y: 0
  }

  this.id = socket.id;

  this.side = side;

  this.name = name;
}

Player.prototype.move = function (DIRECTION, MOVING) {
  this.moving[DIRECTION] = MOVING;
}

Player.prototype.update = function (dimensions) {
  if (this.moving.UP){
    this.velocity.y = -7;
  }
  else if (this.moving.DOWN){ 
    this.velocity.y = 7;
  }
  else {
    this.velocity.y = 0;
  }

  if (this.moving.RIGHT){ 
    this.velocity.x = 7;
  }
  else if (this.moving.LEFT) {
    this.velocity.x = -7;
  }
  else{
    this.velocity.x = 0;
  }

  // keep the paddle inside of the canvas
  this.position.y = Math.max(Math.min(this.position.y + this.velocity.y, dimensions.height - this.dimensions.height), 0);
  
  if(this.side === 'left'){
    this.position.x = Math.max(Math.min(this.position.x + this.velocity.x, dimensions.width / 2 - this.dimensions.width), 0);
  }
  
  if (this.side === 'right') {
    this.position.x = Math.max(Math.min(Math.max(dimensions.width / 2, this.position.x + this.velocity.x), dimensions.width - this.dimensions.width), 0);
  }
},

Player.prototype.draw = function (ctx) {
  ctx.fillRect(this.position.x, this.position.y, this.dimensions.width, this.dimensions.height);
}

module.exports = Player;