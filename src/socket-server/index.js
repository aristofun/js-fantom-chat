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

      const note = m(`${userId.userName} has joined`);
      note['joined'] = true;
      socket.broadcast.to(userId.roomName).emit('userAddedRemoved', note);

      io.to(userId.roomName).emit('userListUpdate',
        { userIds: uDB.getUserIdsInRoom(userId.roomName), roomName: userId.roomName }
      );

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
        const note = m(`${userId.userName} has left`);
        note['joined'] = false;
        io.to(userId.roomName).emit('userAddedRemoved', note);

        io.to(userId.roomName).emit('userListUpdate',
          { userIds: uDB.getUserIdsInRoom(userId.roomName), roomName: userId.roomName }
        );

      }
    });
  });

  return io;
};

module.exports = openSocket;

