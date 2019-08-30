const socket = require('socket.io');

const openSocket = (server) => {
  const io = socket(server);

  io.on('connection', (socket) => {
    console.log('New socket client');
    socket.emit('message', `Welcome to server ${JSON.stringify(server.address())}`);

    socket.broadcast.emit('userMessage', 'New user joined!');

    socket.on('userMessage', (message, callback) => {
      io.emit('userMessage', message);

      if (typeof callback === "function") {
        callback(); // callback('Error message') on error
      }
    });

    socket.on('userLocation', (location, callback) => {
      io.emit('userLocation', location);
      if (typeof callback === "function") {
        callback(); // callback('Error message') on error
      }
    });

    socket.on('disconnect', () => {
      io.emit('userMessage', 'User left...');
    })
  });

  return io;
};

module.exports = openSocket;

