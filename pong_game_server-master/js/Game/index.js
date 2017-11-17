var Player = require('../Player');
var Spectator = require('../Spectator');
var Ball = require('../Ball');

function Game(){
  this.dimensions = { width: 700, height: 600, };
  this.PLAYERS = {};

  this.SPECTATORS = {};

  this.BALL = new Ball(this.dimensions);

  this.score = {};

  this.running = false;
}

Game.prototype.changeDimensions = function(w,h){
  if (w) dimensions.width = w;
  if (h) dimensions.height = h;
  return dimensions;
}


Game.prototype.subscribe = function(socket, name, callback){
  var PLAYERS = this.PLAYERS;
  var ID = socket.id;

  if (!ID || !name){
    return callback(false, 'Invalid data provided');
  }

  if (Object.keys(PLAYERS).length === 2) {
    this.addExpectaror(socket, name, callback);
    return callback(false, 'Expecator Added');
  }
  else {
    var side = Object.keys(PLAYERS).length === 0 ? 'left' : 
      PLAYERS[Object.keys(PLAYERS)[0]].side === 'left' ? 'right' : 'left';

    PLAYERS[ID] = new Player(this.dimensions, socket, name, side);
    this.score[ID] = 0;
    this.running = Object.keys(PLAYERS).length === 2;
    return callback(PLAYERS[ID], 'Player Added', this.running);
  }
}

Game.prototype.addExpectaror = function(socket, name){
  var ID = socket.id;
  this.SPECTATORS[ID] = new Spectator(socket, name);
}

Game.prototype.initializeBall = function(){
  this.BALL.initialize();
  return this.BALL;
}

Game.prototype.stop = function(){
  this.running = false;
  return this.score;
}

Game.prototype.unsubscribe = function(ID){
  var PLAYER_TO_BE_REMOVED = this.PLAYERS[ID];
  var SPECTATOR_TO_BE_REMOVED = this.SPECTATORS[ID];

  if (PLAYER_TO_BE_REMOVED){
    delete this.PLAYERS[ID];
    return { user: PLAYER_TO_BE_REMOVED, player: true };
  }
  else if (SPECTATOR_TO_BE_REMOVED){
    delete this.SPECTATORS[ID];
    return { user: SPECTATOR_TO_BE_REMOVED, player: false };
  }
  return false;
}

Game.prototype.reset = function(){
  this.dimensions = { width: 700, height: 600, };
  this.PLAYERS = {};

  this.SPECTATORS = {};

  this.BALL = new Ball(this.dimensions);

  this.score = {};

  this.running = false;
}

Game.prototype.update = function(){
  this.BALL.update(this);

  for (var ID in this.PLAYERS) {
    this.PLAYERS[ID].update(this.dimensions);
    this.PLAYERS[ID].update(this.dimensions);
  }
}

module.exports = new Game();