require('dotenv').config();

const { MongoClient } = require('mongodb');

let db;
let client;

module.exports = {
  connectToServer(callback) {
    MongoClient.connect(process.env.MONGO_ADDRESS, { useNewUrlParser: true }, (err, cl) => {
      db = cl.db(process.env.MONGO_DB);
      client = cl;
      return callback(err);
    });
  },

  getDB() {
    return db;
  },

  getClient() {
    return client;
  }
};
