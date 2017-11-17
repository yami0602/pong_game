import $ from "jquery";
import socket from './socket';
import chat from './chat';
import waiting, { remove } from './waiting';

/**
 * Game elements
 */
var canvas;
var ctx;
var keystate;

var GAME = null;

var playing = {
  state: false,
  player: null,
}

var NAME = '';

export const initialize = () => {
  var btnContainer = document.createElement("div");
  btnContainer.setAttribute("id", "btn-container");
  btnContainer.classList.add('btn-container');
  btnContainer.innerHTML = `
    <input placeholder='ENTER NAME' id='name' class='name-input' type='text'/>
    <button id='start-btn' class='start-btn'>START GAME</button>
  `;

  document.body.appendChild(btnContainer);

  return gameEnterFormListeners();
}

function gameEnterFormListeners() {

  $('#start-btn').click(function (e) {
    e.preventDefault();
    var btn = document.getElementById("btn-container");
    var name = $('#name').val();
    // console.log('clicked');
    if(name){
      NAME = name;
      socket.emit('PLAYER JOIN', name);
      document.body.removeChild(btn);

      remove();
      waiting();
    }
    else {
      alert('Enter Name To Join');
    }
  });

  socket.on('JOINED AS PLAYER', (Player) => {
    console.log('JOINED AS PLAYER ', Player);

    playing.state = true;
    playing.player = Player.id;
  });

  socket.on('JOINED AS EXPECTAROR', (Game) => {
    GAME = Game;
    console.log('start game', GAME);
    main();
  });

  socket.on('START GAME', (Game) => {
    if(NAME){
      GAME = Game;
      console.log('start game', GAME);
      main();
    }
  });

  socket.on('END GAME', (Game) => {
    if(NAME){
      GAME = Game;

      $('#game').remove();

      remove();
      waiting('OPPONENT LEFT THE GAME');
    }
  });
}

/**
 * Starts the game
 */
function main() {

  var names = document.createElement("div");
  names.classList.add('names-container');
  names.setAttribute("style", `width: ${GAME.dimensions.width}px;`);

  var game = document.createElement("div");
  game.setAttribute("id", "game");
  game.classList.add('game');

  canvas = document.createElement("canvas");
  canvas.width = GAME.dimensions.width;
  canvas.height = GAME.dimensions.height;

  ctx = canvas.getContext("2d");

  remove();

  if ($("#btn-container")){
    $("#btn-container").remove();
  }

  for (var ID in GAME.PLAYERS) {
    var name = document.createElement("h1");
    name.classList.add('name');
    name.innerText = GAME.PLAYERS[ID].name;

    if(GAME.PLAYERS[ID].side === 'left'){
      names.insertBefore(name, names.firstChild);
    }
    else {
      names.appendChild(name);
    }
  }

  game.appendChild(names);
  game.appendChild(canvas);
  document.body.appendChild(game);
  chat(NAME);

  if (playing.state){
    // console.log('Player ', Player);

    document.addEventListener("keydown", function (evt) {
      if (evt.keyCode === 38) socket.emit('ACTION', {
        type: 'MOVE',
        direction: 'UP',
      });

      else if (evt.keyCode === 40) socket.emit('ACTION', {
        type: 'MOVE',
        direction: 'DOWN',
      });

      if (evt.keyCode === 39) socket.emit('ACTION', {
        type: 'MOVE',
        direction: 'RIGHT',
      });

      else if (evt.keyCode === 37) socket.emit('ACTION', {
        type: 'MOVE',
        direction: 'LEFT',
      });
    });

    document.addEventListener("keyup", function (evt) {
      if (evt.keyCode === 38) socket.emit('ACTION', {
        type: 'STOP',
        direction: 'UP',
      });

      else if (evt.keyCode === 40) socket.emit('ACTION', {
        type: 'STOP',
        direction: 'DOWN',
      });

      if (evt.keyCode === 39) socket.emit('ACTION', {
        type: 'STOP',
        direction: 'RIGHT',
      });

      else if (evt.keyCode === 37) socket.emit('ACTION', {
        type: 'STOP',
        direction: 'LEFT',
      });
    });
  }

  socket.on('GAME UPDATE', (Game) => {
    GAME = Game;
    console.log('updated');
  });

  var loop = function() {
    draw();
    socket.emit('GAME UPDATE');
    if(GAME.running){
      window.requestAnimationFrame(loop, canvas);
    }
  };
  window.requestAnimationFrame(loop, canvas);
}

/**
 * Clear canvas and draw all game objects and net
 */j
function draw() {
  ctx.fillRect(0, 0, 700, 600);
  ctx.save();
  ctx.fillStyle = "#fff";

  ctx.fillRect(GAME.BALL.position.x, GAME.BALL.position.y, GAME.BALL.size, GAME.BALL.size);

  for (var ID in GAME.PLAYERS) {
    ctx.fillRect(GAME.PLAYERS[ID].position.x, GAME.PLAYERS[ID].position.y, GAME.PLAYERS[ID].dimensions.width, GAME.PLAYERS[ID].dimensions.height);
  }

  //ai.draw();
  // draw the net
  var w = 4;
  var x = (700 - w) * 0.5;
  var y = 0;
  var step = 600 / 20; // how many net segments
  while (y < 600) {
    ctx.fillRect(x, y + step * 0.25, w, step * 0.5);
    y += step;
  }
  ctx.restore();
}

