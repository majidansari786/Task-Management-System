const mongoose = require('mongoose');

mongoose.connect('mongodb://internshala-db:27017/intern', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;

