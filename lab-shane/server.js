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
    this.pool[socket.id] = socket.userName;
  }.bind(this));

  this.ee.on('data', function(data, socket){
    if(data.toString() === 'END\r\n'){
      socket.end();
      delete clients.pool[socket.id];
    } else {
      // console.log('clients.pool[socket.id] = ' + clients.pool[socket.id]);
      clients.ee.emit('broadcast', data, socket);
    }
  });

  this.ee.on('error', function(err){
    if(err) console.log(err);
  });

  this.ee.on('broadcast', function(data, socket){
    Object.keys(this.pool).forEach(function(client){
      this.pool[client].write(data.toString());
      // (this.pool[client] + ' msg: ' + data.toString());
    });
  }.bind(this));

  this.ee.on('close', function(socket){
    console.log(this.pool[socket.id] + ' disconnected');
    delete this.pool[socket.id];
  });

};





var clients = new ClientPool();

let server = net.createServer(function(socket){
  clients.ee.emit('register', socket);
});

server.listen(3000, function(){
  console.log('server up');
});
