const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  clubId: String,
  clubMemberId: [String],
  nickname: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  readBy: { type: [String], default: [] }, // clubMemberId를 key로 갖고 읽은 횟수를 값으로 갖는 Map
});

const Message = mongoose.model(`Message`, messageSchema);

module.exports = Message;
