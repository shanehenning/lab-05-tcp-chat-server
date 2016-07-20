'use strict';

const net = require('net');
const expect = require('chai').expect;

const server = require('../lib/server.js');
const port = 5000;

describe('chat server', function(){
  before(function(done){
    server.listen(port, done);
  });

  after(function(done){
    server.close(done);
  });

  it('should send a standard greeting from the server', function(done){
    let client1 = net.connect({port});
    let client2 = net.connect({port});
    var messages = ['user-55555 msg: test', 'hello from server!\n'];
    var toSend = ['test'];

    client2.on('data', function(data){
      expect(data.toString().length).to.eql(messages.pop().length);
      if(toSend.length){
        client1.write(toSend.pop());
      } else{
        client1.end();
      }
    });

    client1.on('close', function(){
      client2.end();
      expect(messages.length).to.eql(0);
      done();
    });
  });
  
});
