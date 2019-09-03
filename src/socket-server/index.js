const socket = require('socket.io');
const { m } = require('../utils/messages-processing');
const uDB = require('../utils/users-tracking');


function sendMessage(socket, io, message, messageType, callback) {
  const userId = uDB.getUserId(socket.id);

  if (!userId) {
    if (typeof callback === "function") callback('No such user in the room');
  } else {
    io.to(userId.roomName).emit(messageType, m(message, userId.userName));
    if (typeof callback === "function") callback();
  }
}


// Main socket functions wrapper

const openSocket = (server) => {
  const io = socket(server);

  //
  io.on('connection', (socket) => {
    console.log('New socket client', socket.id);

    socket.on('join', ({ userName, roomName }, callback) => {
      const { userId, error } = uDB.addUser(socket.id, userName, roomName);

      if (error && typeof callback === "function") {
        return callback(error);
      }

      socket.join(userId.roomName);
      socket.emit('userMessage', m(`Welcome to server ${JSON.stringify(server.address())}`, userId.userName));
      socket.broadcast.to(userId.roomName).emit('userMessage', m(`${userId.userName} has joined`, userId.userName));

      if (typeof callback === "function") {
        callback(); // Success ack
      }
    });


    socket.on('userMessage', (message, callback) => {
      sendMessage(socket, io, message, 'userMessage', callback);
    });

    socket.on('userLocation', (location, callback) => {
      sendMessage(socket, io, location, 'userLocation', callback);
    });


    socket.on('disconnect', (callback) => {
      const userId = uDB.removeUser(socket.id);

      if (!userId && typeof callback === "function") {
        return callback('No user');
      }

      if (userId) {
        io.to(userId.roomName).emit('userMessage', m(`${userId.userName} has left...`, userId.userName));
      }
    });
  });

  return io;
};

module.exports = openSocket;

