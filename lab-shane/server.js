'use strict';

const net = require('net');
const EE = require('events');

var ee = new EE();
var count = 1;
var thisUser;

var ClientPool = function(){
  this.pool = {};
};
var clients = new ClientPool();

function addUser(){
  var newUser = 'user ' + count;
  var createdUser = clients.pool[count] = newUser;
  count++;
  return createdUser;
}

ee.on('register', function(){
  thisUser = count;
  addUser();
  console.log('user ' + thisUser + ' connected');
  console.log('clients pool: ' + clients.pool);
});

ee.on('broadcast', function(socket){
  // var clientsArray = Object.keys(clients.pool);
  // clientsArray.forEach(function(client){
  //   client.pipe(socket);
  //   socket.pipe(client);
  // });
});

let server = net.createServer(function(socket){
  ee.emit('register');
  socket.write('hello from the server\n');
  socket.pipe(process.stdout);

  socket.on('data', function(data){
    if(data.toString() === 'END\r\n'){
      socket.end();
    }
    ee.emit('broadcast');
    socket.write('user ' + thisUser + ' msg: ' + data.toString());
  });

  socket.on('error', function(err){
    if(err) console.log(err);
  });


  socket.on('close', function(){
    console.log('user ' + thisUser + ' disconnected');
    delete clients.pool[thisUser];
    console.log('clients pool: ' + clients.pool);
  });
});

server.listen(3000, function(){
  console.log('server up');
});
