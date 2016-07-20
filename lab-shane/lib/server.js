'use strict';

const net = require('net');
const ClientPool = require('./clientPool.js');


var clients = new ClientPool();

module.exports = exports = net.createServer(function(socket){
  clients.ee.emit('register', socket);

  socket.on('data', function(data){
    if(data.toString() === 'END\r\n'){
      socket.end();
      delete clients.pool[socket.id];
    } else {
      clients.ee.emit('broadcast', data, socket);
    }
  });

  socket.on('error', function(err){
    if(err) console.log(err);
  });

  socket.on('close', function(){
    console.log(socket.userName, ' disconnected');
    delete clients.pool[socket.id];
  });
});
