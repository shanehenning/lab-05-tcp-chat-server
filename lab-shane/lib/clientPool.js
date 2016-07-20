const EE = require('events');

module.exports = exports = function ClientPool(){
  this.pool = {};
  this.ee = new EE();

  this.ee.on('register', function(socket){
    socket.write('hello from server!\n');
    socket.pipe(process.stdout);
    socket.id = socket.remotePort;
    socket.userName = 'user-' + socket.id;
    this.pool[socket.id] = socket;
  }.bind(this));

  this.ee.on('broadcast', function(data, socket){
    Object.keys(this.pool).forEach(function(item){
      this.pool[item].write(socket.userName + ' msg: ' + data.toString());
    }.bind(this));
  }.bind(this));
};
