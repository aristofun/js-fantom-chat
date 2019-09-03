const m = (content, userName) => {
  return {
    content,
    userName,
    createdAt: new Date().getTime()
  }
};

module.exports = { m };