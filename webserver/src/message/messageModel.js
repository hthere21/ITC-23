const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
  roomId: String,
  message: Array,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
