const m = (content) => {
  return {
    content,
    createdAt: new Date().getTime()
  }
};

module.exports = { m };