// Global user sockets hash map style simple storage

const allUserIds = [];

const addUser = (id, userName, roomName) => {
  //  clean data
  userName = userName.trim().toLowerCase();
  roomName = roomName.trim().toLowerCase();

  // validate
  if (!userName || !roomName)
    return {
      error: 'User and Room required'
    };

  // check user existence
  const existUserId = allUserIds.find((user) => user.roomName === roomName && user.userName === userName);

  if (existUserId)
    return {
      error: 'This user name is taken in this room'
    };

  // Store user
  const userId = { id, userName, roomName };
  allUserIds.push(userId);
  return { userId };
};

const removeUser = (id) => {
  const index = allUserIds.findIndex((user) => user.id === id);
  if (index !== -1) return allUserIds.splice(index, 1)[0];
};

const getUserId = (id) => {
  // console.log(allUserIds, id);
  
  const index = allUserIds.findIndex((user) => user.id === id);
  if (index !== -1) return allUserIds[index];
  else return null;
};

const getUsersInRoom = (roomName) => {
  roomName = roomName.trim().toLowerCase();
  return allUserIds.filter((user) => user.roomName === roomName);
};

module.exports = {
  addUser,
  removeUser,
  getUserId,
  getUsersInRoom
};