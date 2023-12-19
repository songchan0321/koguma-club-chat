const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  clubId: String,
  clubMemberId: [String],
  nickname: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  readBy: { type: [String], default: [] }, // clubMemberId�� key�� ���� ���� Ƚ���� ������ ���� Map
});

const Message = mongoose.model(`Message`, messageSchema);

module.exports = Message;
