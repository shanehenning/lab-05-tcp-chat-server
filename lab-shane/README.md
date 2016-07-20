# Simple Chat Server

## Lab 05 Creating a Chat Server

Using node.js we create a simple chat server that will send messages between clients.

- We create a server using `net.server`
- New clients who log onto the server will receive a unique user id number
- When a client types a message, all other clients will see their message
- Messages sent out will be preceded by that user's id

Users who connect to the chat server are passed through a constructor function to instantiate their client into a pool of all clients in the chat server.  Upon exiting, they are removed from this pool

## Lab 06 Testing a Chat Server

Using Mocha, we test our chat server to determine several agendas:

- When a client types a message, other clients should see the message
- Each message sent should prepend the username before the message
