function Spectator(socket, name) {
  this.id = socket.id;
  this.name = name; 
}

module.exports = Spectator;