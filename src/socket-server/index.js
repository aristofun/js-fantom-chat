const socket = require('socket.io');
const { m } = require('../utils/messages');

const openSocket = (server) => {
  const io = socket(server);

  io.on('connection', (socket) => {
    console.log('New socket client');
    socket.emit('message', m(`Welcome to server ${JSON.stringify(server.address())}`));

    socket.broadcast.emit('userMessage', m('New user joined!'));

    socket.on('userMessage', (message, callback) => {
      io.emit('userMessage', m(message));

      if (typeof callback === "function") {
        callback(); // callback('Error message') on error
      }
    });

    socket.on('userLocation', (location, callback) => {
      io.emit('userLocation', m(location));
      if (typeof callback === "function") {
        callback(); // callback('Error message') on error
      }
    });

    socket.on('disconnect', () => {
      io.emit('userMessage', m('User left...'));
    })
  });

  return io;
};

module.exports = openSocket;

