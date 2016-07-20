'use strict';

const net = require('net');
const EE = require('events');

var ClientPool = function(){
  this.pool = {};
  this.ee = new EE();

  this.ee.on('register', function(socket){
    socket.write('hello from server!\n');
    socket.pipe(process.stdout);
    socket.id = socket.remotePort;
    socket.userName = 'user-' + socket.id;
    this.pool[socket] = socket.userName;
  }.bind(this));

  this.ee.on('broadcast', function(data, socket){
    Object.keys(this.pool).forEach(function(item){
      this.pool[item].write(data.toString());
    }.bind(this));
  }.bind(this));
};

//   console.log(this.pool[client] + ' msg: ' + data.toString());




var clients = new ClientPool();

let server = net.createServer(function(socket){
  clients.ee.emit('register', socket);

  socket.on('data', function(data){
    if(data.toString() === 'END\r\n'){
      socket.end();
      delete clients.pool[socket.id];
    } else {
      // console.log('clients.pool[socket.id] = ' + clients.pool[socket.id]);
      clients.ee.emit('broadcast', data, socket);
    }
  });

  socket.on('error', function(err){
    if(err) console.log(err);
  });

  socket.on('close', function(){
    console.log(clients.pool[socket.id] + ' disconnected');
    delete clients.pool[socket.id];
  });
});

server.listen(3000, function(){
  console.log('server up');
});
