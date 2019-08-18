const socket = require('socket.io');

const openSocket = (server) => {
  const io = socket(server);

  io.on('connection', (socket) => {
    console.log('New socket client');
    socket.emit('message', `Welcome to server ${JSON.stringify(server.address())}`);

    socket.broadcast.emit('userMessage', 'New user joined!');

    socket.on('userMessage', (message) => {
      io.emit('userMessage', message);
    });

    socket.on('disconnect', () => {
      io.emit('userMessage', 'User left...');
    })
  });
  
  return io;
};

module.exports = openSocket;

